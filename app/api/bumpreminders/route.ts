import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { validateApiSessionAndGuildAdmin } from "@/app/lib/validateApiSessionAndGuildAdmin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const guildId = searchParams.get("guildId");

  // Validate authentication by session and if user is guild admin
  const session = await validateApiSessionAndGuildAdmin(guildId);
  if (typeof session === "string") return NextResponse.json({ error: session }, { status: 403 });
  if (!guildId) return NextResponse.json({ error: "Guild ID is missing"}, { status: 403 });

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
  const { guildId, channel, message, interval, enabled } = data;

  // Validate authentication by session and if user is guild admin
  const session = await validateApiSessionAndGuildAdmin(guildId);
  if (typeof session === "string") return NextResponse.json({ error: session }, { status: 403 });
  if (!guildId) return NextResponse.json({ error: "Guild ID is missing"}, { status: 403 });

  const updated = await prisma.bumpReminderSettings.upsert({
    where: { guildId },
    update: { channel, message, interval, enabled },
    create: { guildId, channel, message, interval, enabled },
  });

  return NextResponse.json(updated);
}