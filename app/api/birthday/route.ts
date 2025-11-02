import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import isUserGuildAdmin from "@/app/lib/isGuildAdmin";
import { rateLimitApi } from "@/app/lib/rateLimitApi";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const guildId = searchParams.get("guildId");

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Please authenticate first" });
  }

  if (!guildId) {
    return NextResponse.json({ error: "guildId is required" }, { status: 400 });
  }

  // Rate limit
  const rateLimitResp = await rateLimitApi(session.user.id, guildId, 10, 60);
  if (rateLimitResp) return rateLimitResp;

  // @ts-ignore
  const isAdmin = await isUserGuildAdmin(session.user.id, guildId);

  if (!isAdmin) {
    return NextResponse.json({ error: "You must be a guild admin to access this" });
  }

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
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Please authenticate first" });
  }

  if (!data.guildId) {
    return NextResponse.json({ error: "guildId is required" });
  }

  // @ts-ignore
  const isAdmin = await isUserGuildAdmin(session.user.id, data.guildId);

  if (!isAdmin) {
    return NextResponse.json({ error: "You must be a guild admin to access this" });
  }

  const { guildId, channel, message, time, enabled } = data;

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
