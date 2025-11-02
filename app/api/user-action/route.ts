import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import isUserGuildAdmin from "@/app/lib/isGuildAdmin";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No such session" });
  }

  try {
    const data = await prisma.userAction.findMany();

    return NextResponse.json({ data: data });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Failed to fetch logs" });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No such session" });
  }

  const { guildId, action, userId } = data;

  const updatedUser = await prisma.userAction.create({
    data: {
      userId: userId,
      guildId: guildId,
      action: action
    }
  })
}