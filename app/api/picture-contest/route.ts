import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import isUserGuildAdmin from "@/app/lib/isGuildAdmin";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const guild_id = searchParams.get("guild_id");
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ error: "Please authenticate first" }, { status: 401 });

  if (!guild_id)
    return NextResponse.json({ error: "guild_id is required" }, { status: 400 });

  // @ts-ignore
  if (!(await isUserGuildAdmin(session.user.id, guild_id)))
    return NextResponse.json({ error: "You must be a guild admin" }, { status: 403 });

  try {
    const data = await prisma.picture_contest_settings.findUnique({
      where: { guild_id },
      include: { contests: true },
    });

    if (!data) {
      const created = await prisma.picture_contest_settings.create({
        data: { guild_id },
        include: { contests: true },
      });
      return NextResponse.json(created);
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to fetch picture contest data:", err);
    return NextResponse.json({ error: "Failed to fetch picture contest data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ error: "Please authenticate first" }, { status: 401 });

  const { guild_id, contests } = body;

  if (!guild_id)
    return NextResponse.json({ error: "guild_id is required" }, { status: 400 });

  // @ts-ignore
  if (!(await isUserGuildAdmin(session.user.id, guild_id)))
    return NextResponse.json({ error: "You must be a guild admin" }, { status: 403 });

  try {
    await prisma.picture_contest_settings.upsert({
      where: { guild_id },
      update: {},
      create: { guild_id },
    });

    await prisma.picture_contest_item.deleteMany({
      where: { guild_id },
    });

    if (Array.isArray(contests) && contests.length > 0) {
      await prisma.picture_contest_item.createMany({
        data: contests.map((c: any) => ({
          guild_id,
          contest_channel: c.contestChannel,
          announce_channel: c.announceChannel,
          vote_emoji: c.voteEmoji || "👍",
          vote_type: c.voteType || "highest",
          required_votes: c.voteType === "fixed" ? c.requiredVotes : null,
          schedule: c.schedule || "end_month",
          enabled: c.enabled ?? true,
        })),
      });
    }

    const updated = await prisma.picture_contest_settings.findUnique({
      where: { guild_id },
      include: { contests: true },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Failed to save picture contest settings:", err);
    return NextResponse.json({ error: "Failed to save picture contest settings" }, { status: 500 });
  }
}
