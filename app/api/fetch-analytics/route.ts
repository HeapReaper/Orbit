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
  last_5_years: 1825, // 5 * 365
} as const;

async function fetchDiscordNames(type: "channel" | "user", ids: string[]) {
  if (ids.length === 0) return {};

  try {
    const url = new URL(`${process.env.API_URL}/api/fetch-info`);
    url.searchParams.set("type", type);
    url.searchParams.set("ids", ids.join(","));

    const res = await fetch(url.toString(), {
      headers: {
        "x-api-key": process.env.BOT_API_KEY || "",
      },
      next: { revalidate: 180 },
    });

    if (!res.ok) {
      console.warn(`Failed to fetch ${type} names: ${res.status}`);
      return {};
    }

    const data = await res.json();
    return data.results || {};
  } catch (err) {
    console.error(`Error fetching ${type} names:`, err);
    return {};
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const guild_id = searchParams.get("guildId");
  const range = (searchParams.get("range") as keyof typeof TIME_RANGES) || "last_week";

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Please authenticate first" });

  if (!guild_id)
    return NextResponse.json({ error: "guild_id is required" }, { status: 400 });

  // @ts-ignore
  if (!(await isUserGuildAdmin(session.user.id, guild_id)))
    return NextResponse.json({ error: "You must be a guild admin to access this" });

  try {
    const days: number = TIME_RANGES[range];
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
    const hourlyResult = await clickhouseClient.query({
      query: hourlyQuery,
      format: "JSONEachRow",
    });
    const messageFlowHourly = await hourlyResult.json();

    // Total messages over period
    let period: "day" | "month";
    let points: number;

    if (days === 7 || days === 30) {
      period = "day";
      points = days;
    } else if (days === 365) {
      period = "month";
      points = 12;
    } else if (days === 1825) {
      period = "month";
      points = 60; // 5 years = 60 months
    } else {
      period = "day";
      points = days;
    }

    const totalMessagesQuery = `
        SELECT
            period_start,
            count() AS message_count
        FROM (
                 SELECT
                     CASE
                         WHEN '${period}' = 'day' THEN toDate(created_at)
                         ELSE toStartOfMonth(created_at)
                         END AS period_start
                 FROM discord_messages
                 WHERE guild_id = '${guild_id}'
                   AND created_at >= now() - INTERVAL ${days} DAY
             )
        GROUP BY period_start
        ORDER BY period_start
    `;
    const totalMessagesResult = await clickhouseClient.query({
      query: totalMessagesQuery,
      format: "JSONEachRow",
    });
    const totalMessages = await totalMessagesResult.json();

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
    const topChannelsResult = await clickhouseClient.query({
      query: topChannelsQuery,
      format: "JSONEachRow",
    });
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
    const topUsersResult = await clickhouseClient.query({
      query: topUsersQuery,
      format: "JSONEachRow",
    });
    const topUsers = await topUsersResult.json();

    // Fetch Discord names from bot API
    const channelIds = topChannels.map((c: any) => c.channel_id);
    const userIds = topUsers.map((u: any) => u.user_id);
    const [channelNames, userNames] = await Promise.all([
      fetchDiscordNames("channel", channelIds),
      fetchDiscordNames("user", userIds),
    ]);

    const topChannelsWithNames = topChannels.map((c: any) => ({
      ...c,
      name: channelNames[c.channel_id] || "Unknown Channel",
    }));
    const topUsersWithNames = topUsers.map((u: any) => ({
      ...u,
      name: userNames[u.user_id] || "Unknown User",
    }));

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
            ELSE ${days === 1825 ? 60 : 12}
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
    const memberResult = await clickhouseClient.query({
      query: memberQuery,
      format: "JSONEachRow",
    });
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
    const activeInactiveResult = await clickhouseClient.query({
      query: activeInactiveQuery,
      format: "JSONEachRow",
    });
    const [activeVsInactive] = await activeInactiveResult.json();

    const result = {
      messageFlowHourly,
      totalMessages,
      topChannels: topChannelsWithNames,
      topUsers: topUsersWithNames,
      memberCounts: memberCounts ?? [],
      activeVsInactive,
    };


    // Cache 3 minutes
    await redis.set(cacheKey, JSON.stringify(result), "EX", 180);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error querying ClickHouse:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
