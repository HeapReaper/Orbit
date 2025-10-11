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
  if (!data.type) return NextResponse.json({ error: "type is required" });
  if (!data.message) return NextResponse.json({ error: "message is required" });

  const { guild_id, type, message } = data;

  // @ts-ignore
  const isAdmin = await isUserGuildAdmin(session.user.id, guild_id);
  if (!isAdmin) return NextResponse.json({ error: "You must be a guild admin to access this" });

  await prisma.dashboard_log.create({
    data: {
      guild_id,
      type,
      message,
    },
  });

  return NextResponse.json({ success: true });
}
