import { useSession } from "next-auth/react";

export async function addDashboardLog(guildId: string, type: string, message: string) {
  try {
    // Get current session
    const sessionRes = await fetch("/api/auth/session");
    const sessionData = await sessionRes.json();

    const username = sessionData?.user?.name || "Unknown User";

    // Prepend username to message
    const fullMessage = `[${username}] ${message}`;

    const res = await fetch("/api/add-dashboard-action-log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guild_id: guildId,
        type,
        message: fullMessage,
      }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      console.error("Failed to add log:", data.error);
      return;
    }

    console.log("Log added successfully!");
  } catch (err) {
    console.error("Error adding log:", err);
  }
}