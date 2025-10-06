import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@/app/generated/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId, username, action, guildId } = req.body;

  if (!userId || !username || !action) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const log = await PrismaClient.user_action.create({
      data: { userId, username, action, guildId },
    });
    res.status(200).json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to log action" });
  }
}
