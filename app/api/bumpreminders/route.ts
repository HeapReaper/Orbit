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
  if (!await isUserGuildAdmin(session.user.id, guildId)) {
    return NextResponse.json({ error: "You must be a guild admin to access this" });
  }

  try {
    const reminders = await prisma.bumpReminderSettings.findFirst({
      where: { guildId },
    });
    return NextResponse.json(reminders);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch reminders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Please authenticate first" });
  }

  if (!data.guildId) {
    return NextResponse.json({ error: "guildId is required" });
  }

  // @ts-ignore
  if (!await isUserGuildAdmin(session.user.id, data.guildId)) {
    return NextResponse.json({ error: "You must be a guild admin to access this" });
  }

  const { guildId, channel, message, interval, enabled } = data;

  const updated = await prisma.bumpReminderSettings.upsert({
    where: { guildId },
    update: { channel, message, interval, enabled },
    create: { guildId, channel, message, interval, enabled },
  });

  return NextResponse.json(updated);
}