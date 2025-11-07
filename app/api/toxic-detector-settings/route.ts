import { NextRequest, NextResponse} from "next/server";
import { validateApiSessionAndGuildAdmin } from "@/app/lib/validateApiSessionAndGuildAdmin";

export default async function POST(req: NextResponse) {
  const {guildId, channel, triggerLevel } = await req.json();

  // Validate authentication by session and if user is guild admin
  const session = await validateApiSessionAndGuildAdmin(guildId);
  if (typeof session === "string") return NextResponse.json({ error: session }, { status: 403 });

}