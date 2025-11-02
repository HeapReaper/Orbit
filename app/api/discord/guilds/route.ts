import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { PrismaClient } from "@prisma/client";
import { getRedisClient } from "@/app/lib/redis";

const prisma = new PrismaClient();
const redis = getRedisClient();

const DISCORD_API = "https://discord.com/api";
const ADMINISTRATOR = 0x00000008;

const CACHE_TTL: number = 60 * 10; // 10 minutes

export async function GET() {
  const session = await getServerSession(authOptions);

  // @ts-ignore
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // First try cache
  const cacheKey = `guilds:${session.user.id}`;
  const cached = await redis.get(cacheKey);
  if (cached) return NextResponse.json(JSON.parse(cached));

  try {
    // Get user guilds
    const userRes = await fetch(`${DISCORD_API}/users/@me/guilds`, {
      // @ts-ignore
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });

    if (!userRes.ok) {
      return NextResponse.json({ error: "Failed to fetch user guilds" }, { status: userRes.status });
    }

    const userGuilds = await userRes.json();

    // Get bot guilds
    let botGuilds = await redis.get("bot:guilds");
    if (!botGuilds) {
      const botRes = await fetch(`${DISCORD_API}/users/@me/guilds`, {
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
      });
      botGuilds = botRes.ok ? JSON.stringify(await botRes.json()) : "[]";
      await redis.set("bot:guilds", botGuilds, "EX", CACHE_TTL); // 10 min cache
    }
    const botGuildIds = new Set(JSON.parse(botGuilds).map((g: any) => g.id));

    // Only include where bot is in and user is admin off
    const manageableGuilds = userGuilds.filter((g: any) => {
      const hasAdmin = g.owner || (parseInt(g.permissions, 10) & ADMINISTRATOR) === ADMINISTRATOR;
      return hasAdmin && botGuildIds.has(g.id);
    });

    const premiumGuilds = await prisma.premiumGuild.findMany({
      // @ts-ignore
      where: { guildId: { in: manageableGuilds.map(g => g.id) } },
    });
    const premiumMap = new Map(premiumGuilds.map(p => [p.guildId, p.premium]));

    const detailedGuilds = await Promise.all(
      manageableGuilds.map(async (g: any) => {
        try {
          const cacheKeyGuild = `guild:${g.id}:details`;
          const cachedGuild = await redis.get(cacheKeyGuild);
          if (cachedGuild) return JSON.parse(cachedGuild);

          const [channelsRes, rolesRes] = await Promise.all([
            fetch(`${DISCORD_API}/guilds/${g.id}/channels`, {
              headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
            }),
            fetch(`${DISCORD_API}/guilds/${g.id}/roles`, {
              headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
            }),
          ]);

          if (!channelsRes.ok || !rolesRes.ok) return null;

          const [channels, roles] = await Promise.all([channelsRes.json(), rolesRes.json()]);

          const guildDetails = {
            id: g.id,
            name: g.name,
            icon: g.icon,
            owner: g.owner,
            isAdmin: true,
            channels,
            roles,
            isPremium: premiumMap.get(g.id) || false,
          };

          await redis.set(cacheKeyGuild, JSON.stringify(guildDetails), "EX", CACHE_TTL);
          return guildDetails;
        } catch (err) {
          console.warn(`Skipping guild ${g.id} due to error:`, err);
          return null;
        }
      })
    );

    const validGuilds = detailedGuilds.filter(Boolean);
    const resp = { guilds: validGuilds };

    await redis.set(cacheKey, JSON.stringify(resp), "EX", CACHE_TTL);
    return NextResponse.json(resp);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}