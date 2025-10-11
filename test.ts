import {getRedisClient} from "@/app/lib/redis";

const redis = getRedisClient();

await redis.set("hello", "world");

console.log(await redis.("hello"));