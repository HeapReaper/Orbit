import Redis from "ioredis";

let redis: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (redis === null) {
    try {
      const url = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
      console.log(`[Redis] Connecting to ${url}...`);

      redis = new Redis(url, {
        password: process.env.REDIS_PASSWORD,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          console.log(`[Redis] Retry #${times}, waiting ${delay}ms`);
          return delay;
        },
      });

      redis.on("connect", () => console.log("[Redis] Connected successfully"));
      redis.on("error", (err) => console.error("[Redis] Error:", err));
      redis.on("close", () => console.log("[Redis] Connection closed"));
    } catch (err) {
      console.warn("[Redis] Could not create client, using fallback. Error:", err);
      // fallback object so build doesn't crash
      redis = {
        get: async (key: string) => null,
        set: async (key: string, value: any, mode?: string, duration?: number) => {
          console.log(`[Redis fallback] set called for key=${key}`);
        },
        quit: async () => console.log("[Redis fallback] quit called"),
      } as any;
    }
  }

  // @ts-ignore
  return redis;
};

export const disconnectRedis = async () => {
  if (redis) {
    try {
      await redis.quit();
      console.log("[Redis] Disconnected");
    } catch (err) {
      console.warn("[Redis] Error disconnecting:", err);
    } finally {
      redis = null;
    }
  }
};
