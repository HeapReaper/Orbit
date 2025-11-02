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
    const data = await prisma.antiBotSettings.findUnique({ where: { guildId } });
    return NextResponse.json(
      data ?? {
        enabled: false,
        timeWindow: 10,
        channelLimit: 3,
        punishment: "none",
        forbiddenWords: [],
        notificationChannel: null,
        jailRole: null,
      }
    );
  } catch (err) {
    console.error("GET /api/anti-bot failed:", err);
    return NextResponse.json({ error: "Failed to fetch anti-bot settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { guildId, enabled = false, timeWindow = 10, channelLimit = 3, punishment = "none", forbiddenWords = [], notificationChannel = null, jailRole = null,} = data;

  // Validate authentication by session and if user is guild admin
  const session = await validateApiSessionAndGuildAdmin(guildId);
  if (typeof session === "string") return NextResponse.json({ error: session }, { status: 403 });
  if (!guildId) return NextResponse.json({ error: "Guild ID is missing"}, { status: 403 });

  try {
    const updated = await prisma.antiBotSettings.upsert({
      where: { guildId },
      update: {
        enabled,
        timeWindow,
        channelLimit,
        punishment,
        forbiddenWords,
        notificationChannel,
        jailRole,
      },
      create: {
        guildId,
        enabled,
        timeWindow,
        channelLimit,
        punishment,
        forbiddenWords,
        notificationChannel,
        jailRole,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("POST /api/anti-bot failed:", err);
    return NextResponse.json({ error: "Failed to save anti-bot settings" }, { status: 500 });
  }
}