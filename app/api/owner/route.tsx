import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: "Please authenticate first" });
    if (!session.user) return NextResponse.json({ error: "User does not exist" });
    if (session.user.id !== process.env.OWNER_ID) return NextResponse.json({ error: "User not allowed" });

    const { updateMessage } = data;
    if (!updateMessage) return NextResponse.json({ error: "Please fill in a message" });

    const botSettings = await prisma.botSettings.findMany();
    const token = process.env.DISCORD_BOT_TOKEN;

    for (const botSetting of botSettings) {
      if (!botSetting.updatesChannel) continue;

      try {
        await fetch(`https://discord.com/api/v10/channels/${botSetting.updatesChannel}/messages`, {
          method: "POST",
          headers: {
            "Authorization": `Bot ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: updateMessage }),
        });
      } catch (err) {
        console.error(`Failed to send message to channel ${botSetting.updatesChannel}:`, err);
      }
    }

    return NextResponse.json({ success: "Messages sent!" });

  } catch (err) {
    console.error("POST /api/send-update failed:", err);
    return NextResponse.json({ error: "An unexpected error occurred", details: String(err) });
  }
}