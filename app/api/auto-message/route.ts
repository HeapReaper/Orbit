import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const guild_id = req.nextUrl.searchParams.get("guild_id");
  if (!guild_id) return NextResponse.json([], { status: 400 });

  const autoMessages = await prisma.auto_message.findMany({
    where: { guild_id },
    orderBy: { id: "asc" },
  });

  return NextResponse.json(autoMessages);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { guild_id, autoMessages } = body;

  if (!guild_id || !Array.isArray(autoMessages)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    // Delete all old auto messages
    await prisma.auto_message.deleteMany({ where: { guild_id } });
    // Insert new auto messages
    const createData = autoMessages.map((msg: any) => ({
      guild_id,
      message: msg.message,
      channel: msg.channel,
      time: msg.time,
      enabled: msg.enabled,
    }));
    
    await prisma.auto_message.createMany({ data: createData });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
