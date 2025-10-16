"use client";

import { useEffect, useState, useRef } from "react";
import SaveButton from "@/app/(dashboard)/dashboard/components/buttons/Save";
import { useNotification } from "@/app/context/NotificationContext";
import SelectInput from "@/app/(dashboard)/dashboard/components/inputs/Select";
import PageLoader from "@/app/(dashboard)/dashboard/components/PageLoader";
import { useGuild } from "@/app/context/GuildContext";
import { addDashboardLog } from "@/app/lib/addDashboardLog";
import InfoTooltip from "@/app/(dashboard)/dashboard/components/ui/InfoToolTip";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [emoji, setEmoji] = useState<string>("");
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { selectedGuild, channels } = useGuild();
  const { notify } = useNotification();
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.title = "Channel of Fame Settings";
    if (!selectedGuild) return;

    const fetchGuildData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/channel-of-fame?guild_id=${selectedGuild}`);
        const data = await res.json();
        setEnabled(data.enabled ?? false);
        setEmoji(data.emoji ?? "");
        setSelectedChannel(data.channel ?? "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    void fetchGuildData();
  }, [selectedGuild]);

  const triggerAutoSave = () => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      void handleSave(true);
    }, 1500);
  };

  const handleSave = async (auto = false) => {
    if (!selectedGuild) return;
    setIsSaving(true);

    try {
      const resp = await fetch("/api/channel-of-fame", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guild_id: selectedGuild,
          channel: selectedChannel,
          emoji,
          enabled,
        }),
      });

      if (!resp.ok) {
        notify("Could not save", "", "error");
      }

      void addDashboardLog(selectedGuild, "INFO", "Updated Channel of Fame settings");

      if (!auto) notify("Saved", "", "success");
    } catch (error) {
      if (!auto) notify("Error", String(error), "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Auto save on changes
  useEffect(() => {
    if (!selectedGuild) return;
    triggerAutoSave();
  }, [enabled, emoji, selectedChannel]);

  return (
    <section className="relative bg-[#181b25] p-6 rounded-lg max-w-3xl mx-auto mt-6">
      {loading && <PageLoader />}

      <h1 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
        Channel of Fame Settings
        <InfoTooltip text="Work in progress" />
      </h1>

      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400">Enable module</span>
        <button
          type="button"
          onClick={() => setEnabled(!enabled)}
          className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-200 focus:outline-none ${
            enabled ? "bg-[var(--primary-color)]" : "bg-gray-700"
          }`}
        >
          <span
            className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${
              enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">Emoji</label>
        <input
          type="text"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          placeholder="🎉"
          className="w-full bg-[#0f1117] border border-gray-700 rounded p-2 text-white"
        />
        <p className="text-sm text-gray-500 mt-1">The emoji that will trigger the Channel of Fame message.</p>
      </div>

      <SelectInput
        label="Select channel"
        value={selectedChannel || ""}
        onChange={(val) => setSelectedChannel(val)}
        options={channels
          .filter((c) => c.type === 0)
          .map((ch) => ({ value: ch.id, label: ch.name }))}
      />

      <div className="text-right text-gray-400 text-sm mt-3">
        {isSaving ? "Saving..." : "Auto saved!"}
      </div>

      <SaveButton onClick={() => handleSave(false)} />
    </section>
  );
}
