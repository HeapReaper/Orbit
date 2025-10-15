import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import isUserGuildAdmin from "@/app/lib/isGuildAdmin";
import { PrismaClient } from "@prisma/client";
import { getRedisClient } from "@/app/lib/redis";

const prisma = new PrismaClient();
const redis = getRedisClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const guild_id = searchParams.get("guild_id");

  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ error: "Please authenticate first" }, { status: 401 });
  if (!guild_id) return NextResponse.json({ error: "guild_id is required" }, { status: 400 });

  if (!(await isUserGuildAdmin(session.user.id, guild_id))) {
    return NextResponse.json({ error: "You must be a guild admin to access this" }, { status: 403 });
  }

  try {
    const cacheKey = `premium_guild:${guild_id}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    const data = await prisma.premium_guilds.findFirst({
      where: {
        guild_id: guild_id,
        premium: true,
      },
    });

    await redis.set(cacheKey, JSON.stringify(data), "EX", 180);

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not fetch guild data" }, { status: 500 });
  }
}