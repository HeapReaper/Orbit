import { NextResponse } from "next/server";
import { status } from "minecraft-server-util";
import { getServerSession } from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/options";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ip = searchParams.get("ip");
  const port = parseInt(searchParams.get("port") || "25565", 10);
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ error: "Please authenticate first" });

  if (!ip) return NextResponse.json({ error: "IP missing" }, { status: 400 });

  try {
    const result = await status(ip, port);
    return NextResponse.json({
      online: true,
      players: result.players.sample?.map((p) => p.name) || [],
      maxPlayers: result.players.max,
    });
  } catch (err) {
    return NextResponse.json({ online: false, players: [], maxPlayers: 0 });
  }
}
