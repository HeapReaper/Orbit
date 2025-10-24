import { getRedisClient } from "./redis";

const redis = getRedisClient();

export async function rateLimit(key: string, limit = 10, windowSeconds = 60) {
  // Key:  Unique per user or per IP
  const current = await redis.incr(key);

  if (current === 1) {
    // Set expiration on first increment
    await redis.expire(key, windowSeconds);
  }

  // rate limit exceeded
  if (current > limit) {
    return false;
  }

  // allowed
  return true;
}
