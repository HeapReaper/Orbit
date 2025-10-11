import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import modules from "@/app/(dashboard)/dashboard/data/modules";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const data = await prisma.premium_guilds.findMany({
      where: { premium: true}
    });

    const enabledModulesCount = modules.filter(mod => mod.enabled).length;

    const res = await fetch(`${process.env.API_URL}/api/expose-guild-channels-and-roles`);
    const botData = await res.json();

    console.log(botData);
    console.log(data);
    console.log(enabledModulesCount);
    return NextResponse.json({
      premiumGuilds: data.length,
      enabledModules: enabledModulesCount,
      totalGuilds: botData.totalGuilds,
      totalUsers: botData.totalUsers,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch reminders" }, { status: 500 });
  }
}