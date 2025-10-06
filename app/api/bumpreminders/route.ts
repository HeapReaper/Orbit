import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const guild_id = searchParams.get("guild_id");
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Please authenticate first" });
  }

  if (!guild_id) {
    return NextResponse.json({ error: "guild_id is required" }, { status: 400 });
  }

  try {
    const reminders = await prisma.bumpreminder_settings.findFirst({
      where: { guild_id },
    });
    return NextResponse.json(reminders);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch reminders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Please authenticate first" });
  }

  if (!data.guild_id) {
    return NextResponse.json({ error: "guild_id is required" });
  }

  const { guild_id, channel, message, interval, enabled } = data;

  const updated = await prisma.bumpreminder_settings.upsert({
    where: { guild_id },
    update: { channel, message, interval, enabled },
    create: { guild_id, channel, message, interval, enabled },
  });

  return NextResponse.json(updated);
}