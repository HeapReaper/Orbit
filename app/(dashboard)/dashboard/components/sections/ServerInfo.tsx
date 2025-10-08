"use client";

import { MessageCircle } from "lucide-react";
import { useGuild } from "@/app/context/GuildContext";

export default function ServerInfo() {
  const { selectedGuild, setSelectedGuild, channels, guilds } = useGuild();

  let guildName = guilds.find(g => g.id === selectedGuild);

  if (!guildName) return null;

  return (
    <section className="bg-[#181b25] p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="w-6 h-6 text-[var(--primary-color)]" />

        <h2 className="text-lg font-semibold">Server info</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <p>
          <span className="font-semibold text-white">Guild:</span> {guildName.name}
        </p>
        <p>
          <span className="font-semibold text-white">Members:</span> 3
        </p>
        <p>
          <span className="font-semibold text-white">Channels:</span> {channels.length}
        </p>
      </div>
    </section>
  );
}
