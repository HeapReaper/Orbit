import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import isUserGuildAdmin from "@/app/lib/isGuildAdmin";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  const guildId = req.nextUrl.searchParams.get("guildId");
  if (!guildId) return NextResponse.json([], { status: 400 });

  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ error: "Please authenticate first" });

  if (!await isUserGuildAdmin(session.user.id, guildId)) {
    return NextResponse.json({ error: "You must be a guild admin to access this" });
  }

  const autoMessages = await prisma.autoMessage.findMany({
    where: { guildId },
    orderBy: { id: "asc" },
  });

  return NextResponse.json(autoMessages);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { guildId, autoMessages } = body;

  if (!guildId || !Array.isArray(autoMessages)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ error: "Please authenticate first" });

  if (!await isUserGuildAdmin(session.user.id, guildId)) {
    return NextResponse.json({ error: "You must be a guild admin to access this" });
  }

  try {
    // Delete all old auto messages
    await prisma.autoMessage.deleteMany({ where: { guildId } });
    // Insert new auto messages
    const createData = autoMessages.map((msg: any) => ({
      guildId,
      message: msg.message,
      channel: msg.channel,
      time: msg.time,
      days: msg.days ?? [],
      enabled: msg.enabled,
    }));
    
    await prisma.autoMessage.createMany({ data: createData });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
