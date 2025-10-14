import { NextResponse } from "next/server";
import { getRedisClient } from "@/app/lib/redis";

const redis = getRedisClient();
const CACHE_TTL: number = 60 * 10; // 10 minutes

export async function GET(req: Request) {
  const url = new URL(req.url);
  const guildId = url.searchParams.get("guildId");

  if (!guildId) {
    return NextResponse.json({ error: "Missing guildId" }, { status: 400 });
  }

  const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  if (!BOT_TOKEN) {
    return NextResponse.json({ error: "Bot token not set" }, { status: 500 });
  }

  const cacheKey = `guild:${guildId}:textChannels`;

  // First try Redis
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log(`Returning cached channels for guild ${guildId}`);
    return NextResponse.json(JSON.parse(cached));
  }

  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch channels" }, { status: res.status });
    }

    const data = await res.json();

    const textChannels = data
      .filter((c: any) => c.type === 0) // 0 = text channel
      .map((c: any) => ({
        id: c.id,
        name: c.name,
      }));

    // Store in Redis
    await redis.set(cacheKey, JSON.stringify(textChannels), "EX", CACHE_TTL);

    console.log("Fetching channels for guild:", guildId);
    return NextResponse.json(textChannels);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}