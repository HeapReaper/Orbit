import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import isUserGuildAdmin from "@/app/lib/isGuildAdmin";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json();
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ error: "Please authenticate first" });

  if (!data.guild_id) return NextResponse.json({ error: "guild_id is required" });

  // @ts-ignore
  if (!await isUserGuildAdmin(session.user.id, data.guild_id)) {
    return NextResponse.json({ error: "You must be a guild admin to access this" });
  }

  const { guild_id, type, time_range } = data;

  let startDate: Date | undefined;
  const now = new Date();

  if (time_range === "1w") {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (time_range === "1m") {
    startDate = new Date();
    startDate.setMonth(now.getMonth() - 1);
  }

  const whereClause: any = { guild_id };
  if (startDate) whereClause.timestamp = { gte: startDate };

  if (type === "guild") {
    const logs = await prisma.guild_log.findMany({
      where: whereClause,
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json(logs);
  }

  if (type === "dashboard") {
    const logs = await prisma.dashboard_log.findMany({
      where: whereClause,
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json(logs);
  }

  return NextResponse.json({ error: "Invalid log type" });
}
