import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { validateApiSessionAndGuildAdmin } from "@/app/lib/validateApiSessionAndGuildAdmin";

export async function GET(req: NextRequest) {
  const guildId = req.nextUrl.searchParams.get("guildId");

  // Validate authentication by session and if user is guild admin
  const session = await validateApiSessionAndGuildAdmin(guildId);
  if (typeof session === "string") return NextResponse.json({ error: session }, { status: 403 });
  if (!guildId) return NextResponse.json({ error: "Guild ID is missing"}, { status: 403 });

  const autoMessages = await prisma.autoMessage.findMany({
    where: { guildId },
    orderBy: { id: "asc" },
  });

  return NextResponse.json(autoMessages);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { guildId, autoMessages } = body;

  // Validate authentication by session and if user is guild admin
  const validation = await validateApiSessionAndGuildAdmin(guildId);
  if (typeof validation === "string") return NextResponse.json({ error: validation }, { status: 403 });
  if (!guildId) return NextResponse.json({ error: "Guild ID is missing"}, { status: 403 });

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
