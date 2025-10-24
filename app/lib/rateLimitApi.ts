// lib/rateLimitApi.ts
import { NextResponse } from "next/server";
import { getRedisClient } from "./redis";

const redis = getRedisClient();

export async function rateLimitApi(
  userId: string,
  guildId: string,
  limit = 10,
  windowSeconds = 60
) {
  const key = `rl:${userId}:${guildId}`;
  const current = await redis.incr(key);

  // If key gets incremented set expire time
  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }

  // If rate limit exceeded
  if (current > limit) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  // allowed
  return null;
}
