import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: NextRequest) {

  try {
    const session = await getServerSession(authOptions);
    const { guildId } = await req.json();

    if (!session) return NextResponse.json({ error: "Please authenticate first" });

    const response = await fetch(
      `${process.env.API_URL}/api/refresh-commands${guildId ? `?guildId=${guildId}` : ""}`,
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.API_KEY!,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to refresh commands" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal error", details: error.message },
      { status: 500 }
    );
  }
}
