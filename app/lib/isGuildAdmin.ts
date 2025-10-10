export default async function isUserGuildAdmin(userId: string, guildId: string) {
  try {
    const res = await fetch("https://bot.botinorbit.com/api/admin-users");
    const guildAdmins = await res.json();

    if (!guildAdmins[guildId]) return false;

    return guildAdmins[guildId].admins.some((admin: { id: string }) => admin.id === userId);
  } catch (err) {
    console.error("Failed to fetch admin users:", err);
    return false;
  }
}