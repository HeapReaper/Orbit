import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import isUserGuildAdmin from "@/app/lib/isGuildAdmin";
import { clickhouseClient } from "@/app/lib/clickhouse";
import { getRedisClient } from "@/app/lib/redis";

const redis = getRedisClient();

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

    const cacheKey = `analytics:${guild_id}:${range}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    // Message flow hourly
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

    // Top channels
    const topChannelsQuery = `
        SELECT channel_id, count() AS message_count
        FROM discord_messages
        WHERE created_at >= now() - INTERVAL ${days} DAY
          AND guild_id = '${guild_id}'
        GROUP BY channel_id
        ORDER BY message_count DESC
        LIMIT 5
    `;
    const topChannelsResult = await clickhouseClient.query({ query: topChannelsQuery, format: "JSONEachRow" });
    const topChannels = await topChannelsResult.json();

    // Top 4 most active users
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

    // Member counts over time
    const memberQuery = `
      WITH
        ${days} AS days,
        CASE
          WHEN ${days} = 7 THEN 'day'
          WHEN ${days} = 30 THEN 'day'
          ELSE 'month'
        END AS period_type,
        (
          CASE
            WHEN ${days} = 7 THEN 7
            WHEN ${days} = 30 THEN 30
            ELSE 12
          END
        ) AS points
      SELECT
        period_start,
        COUNTIf(joined_at <= period_start AND (left_at IS NULL OR left_at > period_start)) AS member_count
      FROM
        discord_membership
      ARRAY JOIN
        arrayMap(i ->
          CASE
            WHEN period_type = 'day' THEN toDate(addDays(now(), -1 * (points - i)))
            WHEN period_type = 'month' THEN toStartOfMonth(addMonths(now(), -1 * (points - i)))
          END,
          range(0, points)
        ) AS period_start
      WHERE
        guild_id = '${guild_id}'
      GROUP BY
        period_start
      ORDER BY
        period_start
    `;

    const memberResult = await clickhouseClient.query({ query: memberQuery, format: "JSONEachRow" });
    const memberCounts = await memberResult.json();

    // Active vs Inactive members
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

    const result = {
      messageFlowHourly,
      topChannels,
      topUsers,
      memberCounts,
      activeVsInactive,
    };

    // 3 minute cache
    await redis.set(cacheKey, JSON.stringify(result), "EX", 180); // TODO: to 180

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error querying ClickHouse:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}