import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log("I got called")
  const url = new URL(req.url);
  const guildId = url.searchParams.get("guildId");

  if (!guildId) {
    return NextResponse.json({ error: "Missing guildId" }, { status: 400 });
  }

  const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  if (!BOT_TOKEN) {
    return NextResponse.json({ error: "Bot token not set" }, { status: 500 });
  }

  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch channels" }, { status: res.status });
    }

    const data = await res.json();

    const textChannels = data.filter((c: any) => c.type === 0).map((c: any) => ({
      id: c.id,
      name: c.name,
    }));
    console.log("Fetching channels for guild:", guildId);
    console.log("Bot token length:", BOT_TOKEN?.length);
    return NextResponse.json(textChannels);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
