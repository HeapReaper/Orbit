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
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { selectedGuild, channels } = useGuild();
  const { notify } = useNotification();
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.title = "Giveaway Settings";
    if (!selectedGuild) return;

    const fetchGuildData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/giveaway?guildId=${selectedGuild}`);
        const data = await res.json();
        setEnabled(data.enabled ?? false);
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
      const resp = await fetch("/api/giveaway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guildId: selectedGuild,
          channel: selectedChannel,
          enabled,
        }),
      });

      if (!resp.ok) {
        notify("Could not save", "", "error");
      }

      void addDashboardLog(selectedGuild, "INFO", "Updated Giveaway settings");

      if (!auto) notify("Saved", "", "success");
    } catch (error) {
      if (!auto) notify("Error", String(error), "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Auto save when changes occur
  useEffect(() => {
    if (!selectedGuild) return;
    triggerAutoSave();
  }, [enabled, selectedChannel]);

  return (
    <section className="relative bg-[#181b25] p-6 rounded-lg max-w-3xl mx-auto mt-6">
      {loading && <PageLoader />}

      <h1 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
        Giveaway Settings
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

      <SelectInput
        label="Select channel for Giveaway Messages"
        value={selectedChannel || ""}
        onChange={(val) => setSelectedChannel(val)}
        options={channels
          .filter((c) => c.type === 0) // Filter non text channels out
          .sort((a, b) => a.name.localeCompare(b.name)) // Sort from a to Z
          .map((ch) => ({ value: ch.id, label: ch.name }))
        }
      />

      <div className="text-right text-gray-400 text-sm mt-3">
        {isSaving ? "Saving..." : "Auto saved!"}
      </div>

      <SaveButton onClick={() => handleSave(false)} />
    </section>
  );
}
