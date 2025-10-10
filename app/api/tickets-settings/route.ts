import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/options";
import isUserGuildAdmin from "@/app/lib/isGuildAdmin";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const guild_id = searchParams.get("guild_id");
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Please authenticate first" });
  }

  if (!guild_id) {
    return NextResponse.json({ error: "guild_id is required" }, { status: 400 });
  }

  if (!await isUserGuildAdmin(session.user.id, guild_id)) {
    return NextResponse.json({ error: "You must be a guild admin to access this" });
  }

  try {
    const data = await prisma.tickets_settings.findFirst({
      where: {
        guild_id: guild_id,
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

  if (!data.guild_id) return NextResponse.json({ error: "guild_id is required" });

  // @ts-ignore
  if (!await isUserGuildAdmin(session.user.id, data.guild_id)) {
    return NextResponse.json({ error: "You must be a guild admin to access this" });
  }

  const { guild_id, channel, channel_conf, enabled } = data;

  const updated = await prisma.tickets_settings.upsert({
    where: { guild_id },
    update: { channel, channel_conf, enabled },
    create: { guild_id, channel, channel_conf, enabled }
  })

  return NextResponse.json(updated);
}