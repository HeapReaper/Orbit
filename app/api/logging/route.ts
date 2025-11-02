import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import isUserGuildAdmin from "@/app/lib/isGuildAdmin";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const guildId = searchParams.get("guildId");
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ error: "Please authenticate first" }, { status: 401 });
  if (!guildId)
    return NextResponse.json({ error: "guildId is required" }, { status: 400 });

  // @ts-ignore
  if (!(await isUserGuildAdmin(session.user.id, guildId)))
    return NextResponse.json({ error: "You must be a guild admin" }, { status: 403 });

  try {
    const data = await prisma.loggingSettings.findUnique({ where: { guildId } });
    return NextResponse.json(data ?? { enabled: false, channel: null, events: [] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch logging settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ error: "Please authenticate first" }, { status: 401 });
  if (!data.guildId)
    return NextResponse.json({ error: "guildId is required" }, { status: 400 });

  // @ts-ignore
  if (!(await isUserGuildAdmin(session.user.id, data.guildId)))
    return NextResponse.json({ error: "You must be a guild admin" }, { status: 403 });

  const { guildId, channel, events, enabled } = data;

  try {
    const updated = await prisma.loggingSettings.upsert({
      where: { guildId },
      update: { channel, events, enabled },
      create: { guildId, channel, events, enabled },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save logging settings" }, { status: 500 });
  }
}
