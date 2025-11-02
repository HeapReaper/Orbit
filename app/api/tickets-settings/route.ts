import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/options";
import isUserGuildAdmin from "@/app/lib/isGuildAdmin";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const guildId = searchParams.get("guildId");
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Please authenticate first" });
  }

  if (!guildId) {
    return NextResponse.json({ error: "guildId is required" }, { status: 400 });
  }

  if (!await isUserGuildAdmin(session.user.id, guildId)) {
    return NextResponse.json({ error: "You must be a guild admin to access this" });
  }

  try {
    const data = await prisma.ticketSettings.findFirst({
      where: {
        guildId: guildId,
      },
    });

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Could not fetch ticket settings data" });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ error: "Please authenticate first"});

  if (!data.guildId) return NextResponse.json({ error: "guildId is required" });

  // @ts-ignore
  if (!await isUserGuildAdmin(session.user.id, data.guildId)) {
    return NextResponse.json({ error: "You must be a guild admin to access this" });
  }

  const { guildId, channel, channelConf, enabled } = data;

  const updated = await prisma.ticketSettings.upsert({
    where: { guildId },
    update: { channel, channelConf, enabled },
    create: { guildId, channel, channelConf, enabled }
  })

  return NextResponse.json(updated);
}