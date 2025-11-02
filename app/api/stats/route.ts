import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import modules from "@/app/(dashboard)/dashboard/data/modules";
import { getRedisClient } from "@/app/lib/redis";
import { getServerSession } from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/options";

const redis = getRedisClient();
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const cachedData = await redis.get(req.url);
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: "Please authenticate first" });

    if (cachedData)  return NextResponse.json(JSON.parse(cachedData));

    const data = await prisma.premiumGuild.findMany({
      where: { premium: true },
    });

    const enabledModulesCount = modules.filter((mod) => mod.enabled).length;

    const res = await fetch(`${process.env.API_URL}/api/expose-guild-channels-and-roles`);
    if (!res.ok) {
      console.error(`External API failed with status ${res.status}`);
    }
    const botData = await res.json();

    const response = {
      premiumGuilds: data.length,
      enabledModules: enabledModulesCount,
      totalGuilds: botData.totalGuilds,
      totalUsers: botData.totalUsers,
    };

    await redis.set(req.url, JSON.stringify(response), "EX", 600);

    return NextResponse.json(response);
  } catch (err) {
    console.error("Error in /api/stats:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}