import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { validateApiSessionAndGuildAdmin } from "@/app/lib/validateApiSessionAndGuildAdmin";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const guildId = searchParams.get("guildId");

  // Validate authentication by session and if user is guild admin
  const session = await validateApiSessionAndGuildAdmin(guildId);
  if (typeof session === "string") return NextResponse.json({ error: session }, { status: 403 });
  if (!guildId) return NextResponse.json({ error: "Guild ID is missing"}, { status: 403 });

  try {
    const data = await prisma.minecraftSettings.findUnique({
      where: { guildId },
    });

    return NextResponse.json(
      data ?? {
        enabled: false,
        ip: "",
        port: 25565,
        notifyEnabled: false,
        channel: null,
        players: [],
        maxPlayers: 0,
        online: false,
      }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch Minecraft settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { guildId, ip, port, enabled, notifyEnabled, channel } = data;

  // Validate authentication by session and if user is guild admin
  const session = await validateApiSessionAndGuildAdmin(guildId);
  if (typeof session === "string") return NextResponse.json({ error: session }, { status: 403 });
  if (!guildId) return NextResponse.json({ error: "Guild ID is missing"}, { status: 403 });

  try {
    const updated = await prisma.minecraftSettings.upsert({
      where: { guildId },
      update: { ip, port, enabled, notifyEnabled, channel },
      create: { guildId, ip, port, enabled, notifyEnabled, channel },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to save Minecraft settings" },
      { status: 500 }
    );
  }
}