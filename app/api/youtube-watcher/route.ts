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
    const data = await prisma.youtubeWatcher.findUnique({
      where: { guildId },
    });

    return NextResponse.json({
      ...data,
      users: data?.users ?? [],
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch Youtube watcher" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { guildId, channel, users, enabled } = data;

  // Validate authentication by session and if user is guild admin
  const session = await validateApiSessionAndGuildAdmin(guildId);
  if (typeof session === "string") return NextResponse.json({ error: session }, { status: 403 });
  if (!guildId) return NextResponse.json({ error: "Guild ID is missing"}, { status: 403 });

  try {
    const updated = await prisma.youtubeWatcher.upsert({
      where: { guildId },
      update: {
        channel,
        enabled,
        users: Array.isArray(users) ? users : [],
      },
      create: {
        guildId,
        channel,
        enabled,
        users: Array.isArray(users) ? users : [],
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save Youtube watcher" }, { status: 500 });
  }
}
