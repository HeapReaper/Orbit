import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import isUserGuildAdmin from "@/app/lib/isGuildAdmin";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const guild_id = searchParams.get("guild_id");
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ error: "Please authenticate first" }, { status: 401 });
  if (!guild_id)
    return NextResponse.json({ error: "guild_id is required" }, { status: 400 });

  // @ts-ignore
  if (!(await isUserGuildAdmin(session.user.id, guild_id)))
    return NextResponse.json({ error: "You must be a guild admin" }, { status: 403 });

  try {
    const data = await prisma.leveling_settings.findUnique({ where: { guild_id } });
    return NextResponse.json(data ?? { enabled: false, channel: null, level_roles: [], xp_rate: 1 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch leveling settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ error: "Please authenticate first" }, { status: 401 });
  if (!data.guild_id)
    return NextResponse.json({ error: "guild_id is required" }, { status: 400 });

  // @ts-ignore
  if (!(await isUserGuildAdmin(session.user.id, data.guild_id)))
    return NextResponse.json({ error: "You must be a guild admin" }, { status: 403 });

  const { guild_id, channel, level_roles, xp_rate, enabled } = data;

  try {
    const updated = await prisma.leveling_settings.upsert({
      where: { guild_id },
      update: { channel, level_roles, xp_rate, enabled },
      create: { guild_id, channel, level_roles, xp_rate, enabled },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save leveling settings" }, { status: 500 });
  }
}
