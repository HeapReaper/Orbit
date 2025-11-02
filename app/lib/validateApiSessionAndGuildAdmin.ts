import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import isUserGuildAdmin from "@/app/lib/isGuildAdmin";

export async function validateApiSessionAndGuildAdmin(guildId: string | null | undefined = null) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return "Please authenticate first";
  }

  if (!guildId) {
    return "guildId is required";
  }

  const isAdmin = await isUserGuildAdmin(session.user.id, guildId);
  if (!isAdmin) {
    return "You must be a guild admin to access this";
  }

  return session;
}