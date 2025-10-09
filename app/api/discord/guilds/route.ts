import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  console.log(session);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const res = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const guilds = await res.json();
    return NextResponse.json({ guilds });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ guilds: [], error: "Failed to fetch" }, { status: 500 });
  }
}