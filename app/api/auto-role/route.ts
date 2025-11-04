import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { validateApiSessionAndGuildAdmin } from "@/app/lib/validateApiSessionAndGuildAdmin";
import {rateLimitApi} from "@/app/lib/rateLimitApi";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const guildId = searchParams.get("guildId");

  // Validate authentication by session and if user is guild admin
  const session = await validateApiSessionAndGuildAdmin(guildId);
  if (typeof session === "string") return NextResponse.json({ error: session }, { status: 403 });
  if (!guildId) return NextResponse.json({ error: "Guild ID is missing"}, { status: 403 });

  // Rate limit
  const rateLimitResp = await rateLimitApi(`${session.user.id}:getRequest`, guildId, 10, 60);
  if (rateLimitResp) return rateLimitResp;

  try {
    const data = await prisma.autoRoleSettings.findUnique({ where: { guildId } });
    return NextResponse.json(data ?? { enabled: false, channel: null, levelRoles: [] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch Auto Role settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { guildId, autoRoles, enabled } = data;

  // Validate authentication by session and if user is guild admin
  const session = await validateApiSessionAndGuildAdmin(guildId);
  if (typeof session === "string") return NextResponse.json({ error: session }, { status: 403 });
  if (!guildId) return NextResponse.json({ error: "Guild ID is missing"}, { status: 403 });

  // Rate limit
  const rateLimitResp = await rateLimitApi(`${session.user.id}:postRequest`, guildId, 10, 60);
  if (rateLimitResp) return rateLimitResp;

  try {
    const updated = await prisma.autoRoleSettings.upsert({
      where: { guildId },
      update: { autoRoles, enabled },
      create: { guildId, autoRoles, enabled },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save Auto Role settings" }, { status: 500 });
  }
}