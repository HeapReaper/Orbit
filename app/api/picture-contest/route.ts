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
    let data = await prisma.pictureContestSettings.findUnique({
      where: { guildId },
      include: { contests: true },
    });

    // Auto-create empty settings if none exist
    if (!data) {
      data = await prisma.pictureContestSettings.create({
        data: { guildId },
        include: { contests: true },
      });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to fetch picture contest data:", err);
    return NextResponse.json(
      { error: "Failed to fetch picture contest data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { guildId: guildId, contests } = body;

  // Validate authentication by session and if user is guild admin
  const session = await validateApiSessionAndGuildAdmin(guildId);
  if (typeof session === "string") return NextResponse.json({ error: session }, { status: 403 });
  if (!guildId) return NextResponse.json({ error: "Guild ID is missing"}, { status: 403 });

  try {
    // Ensure the settings entry exists
    await prisma.pictureContestSettings.upsert({
      where: { guildId },
      update: {},
      create: { guildId },
    });

    // Remove all existing contests for this guild
    await prisma.pictureContestItem.deleteMany({
      where: { guildId },
    });

    // Create new contests
    if (Array.isArray(contests) && contests.length > 0) {
      await prisma.pictureContestItem.createMany({
        data: contests.map((c: any) => ({
          guildId,
          name: c.name || "New Contest",
          contestChannel: c.contestChannel,
          announceChannel: c.announceChannel,
          voteEmoji: c.voteEmoji || "👍",
          voteType: c.voteType || "highest",
          requiredVotes: c.voteType === "fixed" ? c.requiredVotes : null,
          schedule: c.schedule || "end_month",
          enabled: c.enabled ?? true,
        })),
      });
    }

    // Return updated settings
    const updated = await prisma.pictureContestSettings.findUnique({
      where: { guildId },
      include: { contests: true },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Failed to save picture contest settings:", err);
    return NextResponse.json(
      { error: "Failed to save picture contest settings" },
      { status: 500 }
    );
  }
}