import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import isUserGuildAdmin from "@/app/lib/isGuildAdmin";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ error: "Please authenticate first" });
  if (!data.guildId) return NextResponse.json({ error: "guildId is required" });
  if (!data.type) return NextResponse.json({ error: "type is required" });
  if (!data.message) return NextResponse.json({ error: "message is required" });

  const { guildId, type, message } = data;

  // @ts-ignore
  const isAdmin = await isUserGuildAdmin(session.user.id, guildId);
  if (!isAdmin) return NextResponse.json({ error: "You must be a guild admin to access this" });

  await prisma.dashboardLog.create({
    data: {
      guildId,
      type,
      message,
    },
  });

  return NextResponse.json({ success: true });
}
