"use client";

import { useEffect, useState, useRef } from "react";
import SaveButton from "@/app/(dashboard)/dashboard/components/buttons/Save";
import { useNotification } from "@/app/context/NotificationContext";
import PageLoader from "@/app/(dashboard)/dashboard/components/PageLoader";
import { useGuild } from "@/app/context/GuildContext";
import { addDashboardLog } from "@/app/lib/addDashboardLog";
import InfoTooltip from "@/app/(dashboard)/dashboard/components/ui/InfoToolTip";
import ChannelSelect from "@/app/(dashboard)/dashboard/components/inputs/ChannelSelect";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [levelRoles, setLevelRoles] = useState<string[]>([]);
  const [xpRate, setXpRate] = useState<number>(1);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const { selectedGuild, roles, channels } = useGuild();
  const { notify } = useNotification();
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.title = "Leveling Settings";
    if (!selectedGuild) return;

    const fetchGuildData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/leveling?guildId=${selectedGuild}`);
        const data = await res.json();
        setEnabled(data.enabled ?? false);
        setLevelRoles(data.levelRoles ?? []);
        setXpRate(data.xpRate ?? 1);
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
      const resp = await fetch("/api/leveling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guildId: selectedGuild,
          channel: selectedChannel,
          enabled,
          levelRoles,
          xpRate,
        }),
      });

      if (!resp.ok) {
        notify("Could not save", "", "error");
      }

      void addDashboardLog(selectedGuild, "INFO", "Updated Leveling settings");

      if (!auto) notify("Saved", "", "success");
    } catch (error) {
      if (!auto) notify("Error", String(error), "error");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!selectedGuild) return;
    triggerAutoSave();
  }, [enabled, selectedChannel, levelRoles, xpRate]);

  const toggleRole = (roleId: string) => {
    if (levelRoles.includes(roleId)) {
      setLevelRoles(levelRoles.filter((r) => r !== roleId));
    } else {
      setLevelRoles([...levelRoles, roleId]);
    }
  };

  return (
    <section className="relative bg-[#181b25] p-6 rounded-lg max-w-3xl mx-auto mt-6">
      {loading && <PageLoader />}

      <h1 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
        Leveling Settings
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

      <ChannelSelect
        label="Select channel for Leveling notifications"
        value={selectedChannel ?? ""}
        onChange={(value) => setSelectedChannel(value)}
      />

      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">XP Rate</label>
        <input
          type="number"
          min={0.1}
          step={0.1}
          value={xpRate}
          onChange={(e) => setXpRate(Number(e.target.value))}
          className="w-full bg-[#0f1117] border border-gray-700 rounded p-2 text-white"
        />
        <p className="text-sm text-gray-500 mt-1">The speed of how fast users earn XP</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">Level Roles</label>

        {/* Search input */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search roles..."
          className="w-full bg-[#0f1117] border border-gray-700 rounded p-2 mb-2 text-gray-200 placeholder-gray-500"
        />

        {/* Scrollable checkbox list */}
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto border border-gray-700 p-2 rounded bg-[#1f2330] custom-scrollbar">
          {roles
            ?.filter((role) => role.name.toLowerCase().includes(search.toLowerCase()))
            .map((role) => (
              <label key={role.id} className="flex items-center gap-2 text-white cursor-pointer hover:bg-[#2a2e3b] px-2 py-1 rounded">
                <input
                  type="checkbox"
                  checked={levelRoles.includes(role.id)}
                  onChange={() => toggleRole(role.id)}
                  className="w-4 h-4 accent-[var(--primary-color)]"
                />
                {role.name}
              </label>
            ))}
          {roles?.filter((role) => role.name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
            <p className="text-gray-500 text-sm text-center py-2">No roles found.</p>
          )}
        </div>
      </div>

      <div className="text-right text-gray-400 text-sm mt-3">
        {isSaving ? "Saving..." : "Auto saved!"}
      </div>

      <SaveButton onClick={() => handleSave(false)} />
    </section>
  );
}
