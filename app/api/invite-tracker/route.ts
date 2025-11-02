import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import isUserGuildAdmin from "@/app/lib/isGuildAdmin";
import { prisma } from "@/app/lib/prisma";
import { getRedisClient } from "@/app/lib/redis";

const redis = getRedisClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const guildId = searchParams.get("guildId");
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Please authenticate first" }, { status: 401 });
  }

  if (!guildId) {
    return NextResponse.json({ error: "guildId is required" }, { status: 400 });
  }

  // @ts-ignore
  if (!(await isUserGuildAdmin(session.user.id, guildId))) {
    return NextResponse.json({ error: "You must be a guild admin to access this" }, { status: 403 });
  }

  const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  if (!DISCORD_BOT_TOKEN) {
    return NextResponse.json({ error: "Missing bot token" }, { status: 500 });
  }

  const cacheKey = `invite_tracker:${guildId}`;

  try {
    // Try to read from Redis cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`[Cache Hit] ${cacheKey}`);
      return NextResponse.json(JSON.parse(cached));
    }

    console.log(`[Cache Miss] ${cacheKey} → fetching from Discord & DB`);

    // Fetch invites from Discord API
    const discordRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/invites`, {
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
    });

    if (!discordRes.ok) {
      const text = await discordRes.text();
      return NextResponse.json({ error: `Discord API error: ${text}` }, { status: discordRes.status });
    }

    const discordInvites = await discordRes.json();

    // Fetch invites from our database
    const dbInvites = await prisma.inviteTrackerInvite.findMany({
      where: { guildId },
    });

    // Merge Discord + DB data
    const merged = discordInvites.map((inv: any) => {
      const db = dbInvites.find((d) => d.inviteCode === inv.code);
      return {
        code: inv.code,
        url: `https://discord.gg/${inv.code}`,
        uses: inv.uses,
        inviter: inv.inviter?.username ?? "Unknown",
        channel: inv.channel?.name ?? "Unknown",
        type: db?.inviteType ?? "",
      };
    });

    // Get guild settings
    const settings = await prisma.guildInviteSettings.findUnique({
      where: { guildId },
    });

    const result = {
      enabled: settings?.enabled ?? false,
      invites: merged,
    };

    // Cache the result in Redis for 3 minutes (180s)
    await redis.set(cacheKey, JSON.stringify(result), "EX", 180);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Error fetching invites:", err);
    return NextResponse.json({ error: "Failed to fetch invites" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Please authenticate first" }, { status: 401 });
  }

  if (!body.guildId) {
    return NextResponse.json({ error: "guildId is required" }, { status: 400 });
  }

  // @ts-ignore
  if (!(await isUserGuildAdmin(session.user.id, body.guildId))) {
    return NextResponse.json({ error: "You must be a guild admin to access this" }, { status: 403 });
  }

  const { guildId, enabled, invites } = body;

  try {
    await prisma.guildInviteSettings.upsert({
      where: { guildId },
      update: { enabled },
      create: { guildId, enabled },
    });

    await prisma.inviteTrackerInvite.deleteMany({ where: { guildId } });
    await prisma.inviteTrackerInvite.createMany({
      data: invites.map((i: any) => ({
        guildId,
        inviteCode: i.code,
        inviteType: i.type ?? null,
      })),
    });

    // Invalidate Redis cache after saving
    const cacheKey = `invite_tracker:${guildId}`;
    await redis.del(cacheKey);
    console.log(`[Cache Cleared] ${cacheKey}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update invites" }, { status: 500 });
  }
}
