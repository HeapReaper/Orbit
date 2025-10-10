import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const DISCORD_API = "https://discord.com/api";
const ADMINISTRATOR = 0x00000008;

export async function GET() {
  const session = await getServerSession(authOptions);

  // @ts-ignore
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get users guilds
    const userRes = await fetch(`${DISCORD_API}/users/@me/guilds`, {
      // @ts-ignore
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });

    if (!userRes.ok) {
      return NextResponse.json({ error: "Failed to fetch user guilds" }, { status: userRes.status });
    }

    const userGuilds = await userRes.json();

    // Get bot guilds
    const botRes = await fetch(`${DISCORD_API}/users/@me/guilds`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
    });

    const botGuilds = botRes.ok ? await botRes.json() : [];
    const botGuildIds = new Set(botGuilds.map((g: any) => g.id));

    // Only include where bot is in and where user has admin rights
    const manageableGuilds = userGuilds.filter((g: any) => {
      const hasAdmin = g.owner || (parseInt(g.permissions, 10) & ADMINISTRATOR) === ADMINISTRATOR;
      return hasAdmin && botGuildIds.has(g.id);
    });

    // Get roles with channels
    const detailedGuilds = await Promise.all(
      manageableGuilds.map(async (g: any) => {
        try {
          const [channelsRes, rolesRes] = await Promise.all([
            fetch(`${DISCORD_API}/guilds/${g.id}/channels`, {
              headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
            }),
            fetch(`${DISCORD_API}/guilds/${g.id}/roles`, {
              headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
            }),
          ]);

          if (!channelsRes.ok || !rolesRes.ok) {
            const errJson = !channelsRes.ok ? await channelsRes.json() : await rolesRes.json();
            if (errJson?.code === 10004 || errJson?.code === 50001) {
              console.warn(`Skipping guild ${g.name} (${g.id}) — bot not in guild or missing access`);
              return null;
            }
          }

          const [channels, roles] = await Promise.all([
            channelsRes.ok ? channelsRes.json() : [],
            rolesRes.ok ? rolesRes.json() : [],
          ]);

          return {
            id: g.id,
            name: g.name,
            icon: g.icon,
            owner: g.owner,
            isAdmin: true,
            channels,
            roles,
          };
        } catch (err) {
          console.warn(`Skipping guild ${g.id} due to fetch error:`, err);
          return null;
        }
      })
    );

    const validGuilds = detailedGuilds.filter(Boolean);

    return NextResponse.json({ guilds: validGuilds });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
