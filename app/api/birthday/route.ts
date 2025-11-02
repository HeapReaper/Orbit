import { NextRequest, NextResponse } from "next/server";
import { rateLimitApi } from "@/app/lib/rateLimitApi";
import { prisma } from "@/app/lib/prisma";
import { validateApiSessionAndGuildAdmin } from "@/app/lib/validateApiSessionAndGuildAdmin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const guildId = searchParams.get("guildId");

  // Validate authentication by session and if user is guild admin
  const session = await validateApiSessionAndGuildAdmin(guildId);
  if (typeof session === "string") return NextResponse.json({ error: session }, { status: 403 });
  if (!guildId) return NextResponse.json({ error: "Guild ID is missing"}, { status: 403 });

  // Rate limit
  const rateLimitResp = await rateLimitApi(session.user.id, guildId, 10, 60);
  if (rateLimitResp) return rateLimitResp;

  try {
    const data = await prisma.birthdaySettings.findFirst({
      where: { guildId },
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch reminders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { guildId, channel, message, time, enabled } = data;

  const validation = await validateApiSessionAndGuildAdmin(guildId);
  if (typeof validation === "string") return NextResponse.json({ error: validation }, { status: 403 });
  if (!guildId) return NextResponse.json({ error: "Guild ID is missing"}, { status: 403 });

  try {
    const updated = await prisma.birthdaySettings.upsert({
      where: { guildId },
      update: { channel, message, time, enabled },
      create: { guildId, channel, message, time, enabled },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update birthday settings" }, { status: 500 });
  }
}
