import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const guild_id = searchParams.get("guild_id");
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Please authenticate first" });
  }
  // TODO: Add perms check to every route and action

  if (!guild_id) {
    return NextResponse.json({ error: "guild_id is required" }, { status: 400 });
  }

  try {
    const data = await prisma.welcome_message_settings.findFirst({
      where: { guild_id },
    });
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch welcome_message_settings" }, { status: 500 });
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

  const { guild_id, message, channel, enabled } = data;

  const updated = await prisma.welcome_message_settings.upsert({
    where: { guild_id },
    update: { guild_id, message, channel, enabled },
    create: { guild_id, message, channel, enabled },
  });

  return NextResponse.json(updated);
}