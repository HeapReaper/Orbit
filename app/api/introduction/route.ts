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

  if (!session) return NextResponse.json({ error: "Please authenticate first" }, { status: 401 });
  if (!guild_id) return NextResponse.json({ error: "guild_id is required" }, { status: 400 });
  // @ts-ignore
  if (!(await isUserGuildAdmin(session.user.id, guild_id)))
    return NextResponse.json({ error: "You must be a guild admin" }, { status: 403 });

  try {
    const data = await prisma.introduction_settings.findFirst({ where: { guild_id } });
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch introduction settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ error: "Please authenticate first" }, { status: 401 });
  if (!data.guild_id) return NextResponse.json({ error: "guild_id is required" }, { status: 400 });
  // @ts-ignore
  if (!(await isUserGuildAdmin(session.user.id, data.guild_id)))
    return NextResponse.json({ error: "You must be a guild admin" }, { status: 403 });

  const { guild_id, channel, enabled, max_messages, auto_reply, auto_emoji } = data;

  try {
    const updated = await prisma.introduction_settings.upsert({
      where: { guild_id },
      update: { channel, enabled, max_messages, auto_reply, auto_emoji },
      create: { guild_id, channel, enabled, max_messages, auto_reply, auto_emoji },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save introduction settings" }, { status: 500 });
  }
}
