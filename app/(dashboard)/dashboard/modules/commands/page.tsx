"use client";

import {useEffect, useState} from "react";
import SaveButton from "@/app/(dashboard)/dashboard/components/buttons/Save";
import { useNotification } from "@/app/context/NotificationContext";
import { useGuild } from "@/app/context/GuildContext";
import SelectInput from "@/app/(dashboard)/dashboard/components/inputs/Select";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { notify } = useNotification();
  const { selectedGuild, guilds } = useGuild();

  useEffect(() => {

  })

  const handleRefresh = async (guildId?: string) => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/refresh-commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guildId }),
      });

      const data = await res.json();

      if (!res.ok) {
        notify("Error", data.error || "Failed to refresh commands", "error");
        setResult("Error");
      } else {
        notify("Success", data.message, "success");
        setResult(data.message);
      }
    } catch (err) {
      console.error(err);
      notify("Error", "Something went wrong", "error");
      setResult("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#181b25] p-6 rounded-lg max-w-2xl mx-auto mt-6">
      <h1 className="text-2xl font-semibold mb-4 text-white">
        Slash Command Management
      </h1>

      <p className="text-gray-400 mb-6">
        Use this tool to refresh Discord slash commands for your bot.
        You can refresh them for A specific guild.
      </p>

      <div className="mb-6">
        <label className="block text-gray-400 mb-2">Selected Guild</label>
        <input
          type="text"
          value={guilds.find((g) => g.id === selectedGuild)?.name || ""}
          disabled
          className="w-full rounded-lg border border-gray-700 bg-[#1f2330] text-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => handleRefresh()}
          disabled={loading}
          className={`px-5 py-2 rounded-lg font-medium transition-colors duration-200 ${
            loading
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-[var(--primary-color)] hover:bg-[var(--hover-color)] text-white"
          }`}
        >
          {loading ? "Refreshing..." : "Refresh Commands"}
        </button>
      </div>

      {result && (
        <div className="mt-6 rounded-md border border-gray-700 bg-[#1f2330] p-4">
          <p
            className={`text-sm ${
              result.toLowerCase().includes("error")
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            {result}
          </p>
        </div>
      )}
    </section>
  );
}
