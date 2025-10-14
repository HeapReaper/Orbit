import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import isUserGuildAdmin from "@/app/lib/isGuildAdmin";
import { clickhouseClient } from "@/app/lib/clickhouse";

const TIME_RANGES = {
  last_week: 7,
  last_month: 30,
  last_year: 365,
} as const;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const guild_id = searchParams.get("guild_id");
  const range = (searchParams.get("range") as keyof typeof TIME_RANGES) || "last_week";

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Please authenticate first" });

  if (!guild_id)
    return NextResponse.json({ error: "guild_id is required" }, { status: 400 });

  // @ts-ignore
  if (!(await isUserGuildAdmin(session.user.id, guild_id)))
    return NextResponse.json({ error: "You must be a guild admin to access this" });

  try {
    const days: 7 | 30 | 365 = TIME_RANGES[range];

    // 1️⃣ Message flow hourly
    const hourlyQuery = `
        SELECT
            hour_of_day,
            avg(hourly_count) AS avg_messages
        FROM (
                 SELECT
                     toHour(created_at) AS hour_of_day,
                     count() AS hourly_count
                 FROM discord_messages
                 WHERE created_at >= now() - INTERVAL ${days} DAY
                   AND guild_id = '${guild_id}'
                 GROUP BY hour_of_day, toStartOfDay(created_at)
             )
        GROUP BY hour_of_day
        ORDER BY hour_of_day
    `;
    const hourlyResult = await clickhouseClient.query({ query: hourlyQuery, format: "JSONEachRow" });
    const messageFlowHourly = await hourlyResult.json();

    // 2️⃣ Top channels
    const topChannelsQuery = `
        SELECT channel_id, count() AS message_count
        FROM discord_messages
        WHERE created_at >= now() - INTERVAL ${days} DAY
          AND guild_id = '${guild_id}'
        GROUP BY channel_id
        ORDER BY message_count DESC
        LIMIT 10
    `;
    const topChannelsResult = await clickhouseClient.query({ query: topChannelsQuery, format: "JSONEachRow" });
    const topChannels = await topChannelsResult.json();

    // 3️⃣ Top 4 most active users
    const topUsersQuery = `
        SELECT user_id, count() AS message_count
        FROM discord_messages
        WHERE created_at >= now() - INTERVAL ${days} DAY
          AND guild_id = '${guild_id}'
        GROUP BY user_id
        ORDER BY message_count DESC
        LIMIT 4
    `;
    const topUsersResult = await clickhouseClient.query({ query: topUsersQuery, format: "JSONEachRow" });
    const topUsers = await topUsersResult.json();

    // 4️⃣ Member counts over time
    const memberQuery = `
        SELECT
            toDate(joined_at) AS day,
            countIf(left_at IS NULL OR left_at > day) AS member_count
        FROM discord_membership
        WHERE guild_id = '${guild_id}'
          AND joined_at >= now() - INTERVAL ${days} DAY
        GROUP BY day
        ORDER BY day
    `;
    const memberResult = await clickhouseClient.query({ query: memberQuery, format: "JSONEachRow" });
    const memberCounts = await memberResult.json();

    // 5️⃣ Active vs Inactive members based on recent messages
    const activeInactiveQuery = `
        WITH current_members AS (
            SELECT user_id
            FROM discord_membership
            WHERE guild_id = '${guild_id}'
              AND left_at IS NULL
        )
        SELECT
            COUNTIf(user_id IN (
                SELECT DISTINCT user_id
                FROM discord_messages
                WHERE guild_id = '${guild_id}'
                  AND created_at >= now() - INTERVAL ${days} DAY
            )) AS active,
            COUNTIf(user_id NOT IN (
                SELECT DISTINCT user_id
                FROM discord_messages
                WHERE guild_id = '${guild_id}'
            )) AS inactive
        FROM current_members
    `;
    const activeInactiveResult = await clickhouseClient.query({ query: activeInactiveQuery, format: "JSONEachRow" });
    const [activeVsInactive] = await activeInactiveResult.json();

    console.log("Active vs inactive: ", activeVsInactive);

    return NextResponse.json({
      messageFlowHourly,
      topChannels,
      topUsers,
      memberCounts,
      activeVsInactive,
    });
  } catch (error) {
    console.error("Error querying ClickHouse:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
