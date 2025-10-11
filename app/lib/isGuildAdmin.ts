import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getRedisClient } from "@/app/lib/redis";

export default async function isUserGuildAdmin(userId: string, guildId: string) {
  const redis = getRedisClient();
  const cacheKey = `user_guilds:${userId}`;

  const cached = await redis.get(cacheKey);
  let guilds;

  if (cached) {
    guilds = JSON.parse(cached);
  } else {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session?.accessToken) return false;

    const res = await fetch("https://discord.com/api/users/@me/guilds", {
      // @ts-ignore
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });

    if (!res.ok) {
      console.error("Failed to fetch Discord guilds:", res.statusText);
      return false;
    }

    guilds = await res.json();
    await redis.set(cacheKey, JSON.stringify(guilds), "EX", 600); // 10 minuten cache
  }

  const guild = guilds.find((g: any) => g.id === guildId);
  if (!guild) return false;

  const ADMINISTRATOR = 0x00000008;
  const permissions = BigInt(guild.permissions);

  return (permissions & BigInt(ADMINISTRATOR)) === BigInt(ADMINISTRATOR) || guild.owner === true;
}
