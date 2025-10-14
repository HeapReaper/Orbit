import { clickhouseClient } from "@/app/lib/clickhouse";

async function getAverageMessagesPerHourOfDay() {
  const query = `
      SELECT
          hour_of_day,
          avg(hourly_count) AS avg_messages
      FROM (
               SELECT
                   toHour(created_at) AS hour_of_day,
                   count() AS hourly_count
               FROM discord_messages
               WHERE guild_id = '716388937450389514'
               GROUP BY hour_of_day, toStartOfDay(created_at)
           )
      GROUP BY hour_of_day
      ORDER BY hour_of_day
  `;

  try {
    const resultSet = await clickhouseClient.query({
      query,
      format: "JSONEachRow",
    });

    const rows = await resultSet.json();
    console.table(rows);
  } catch (error) {
    console.error("Error querying ClickHouse:", error);
  }
}

getAverageMessagesPerHourOfDay();
