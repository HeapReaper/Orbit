import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import isUserGuildAdmin from "@/app/lib/isGuildAdmin";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const guildId = searchParams.get("guildId");
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Please authenticate first" });
  }

  if (!guildId) {
    return NextResponse.json({ error: "guildId is required" }, { status: 400 });
  }

  // @ts-ignore
  if (!(await isUserGuildAdmin(session.user.id, guildId))) {
    return NextResponse.json({ error: "You must be a guild admin to access this" });
  }

  try {
    const data = await prisma.leaveMessageSettings.findFirst({
      where: { guildId },
    });
    return NextResponse.json(
      data || { messages: [""], channel: null, enabled: 0, randomize: false }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch leave message settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Please authenticate first" });
  }

  const { guildId, messages, channel, enabled, randomize } = data;

  if (!guildId) {
    return NextResponse.json({ error: "guildId is required" });
  }

  // @ts-ignore
  if (!(await isUserGuildAdmin(session.user.id, guildId))) {
    return NextResponse.json({ error: "You must be a guild admin to access this" });
  }

  try {
    const updated = await prisma.leaveMessageSettings.upsert({
      where: { guildId },
      update: {
        messages,
        channel,
        enabled,
        randomize,
      },
      create: {
        guildId,
        messages,
        channel,
        enabled,
        randomize,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update leave message settings" }, { status: 500 });
  }
}