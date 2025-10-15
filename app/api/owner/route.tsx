import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ error: "Please authenticate first" });

  if (!session.user) return NextResponse.json({ error: "User does not exist" });

  if (session.user.id !== process.env.OWNER_ID) return NextResponse.json({ error: "User not allowed" });

  return NextResponse.json({ success: "Hi!" });
}