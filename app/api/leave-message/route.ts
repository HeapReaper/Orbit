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
  const { guildId, messages, channel, enabled, randomize } = data;

  // Validate authentication by session and if user is guild admin
  const session = await validateApiSessionAndGuildAdmin(guildId);
  if (typeof session === "string") return NextResponse.json({ error: session }, { status: 403 });
  if (!guildId) return NextResponse.json({ error: "Guild ID is missing"}, { status: 403 });

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