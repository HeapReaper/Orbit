"use client";

import { useEffect, useState, useRef } from "react";
import SaveButton from "@/app/(dashboard)/dashboard/components/buttons/Save";
import { useNotification } from "@/app/context/NotificationContext";
import PageLoader from "@/app/(dashboard)/dashboard/components/PageLoader";
import { useGuild } from "@/app/context/GuildContext";
import { addDashboardLog } from "@/app/lib/addDashboardLog";
import InfoTooltip from "@/app/(dashboard)/dashboard/components/ui/InfoToolTip";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [levelRoles, setLevelRoles] = useState<string[]>([]);
  const [xpRate, setXpRate] = useState<number>(1);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { selectedGuild, roles, channels } = useGuild();
  const { notify } = useNotification();
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.title = "Leveling Settings";
    if (!selectedGuild) return;

    const fetchGuildData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/leveling?guild_id=${selectedGuild}`);
        const data = await res.json();
        setEnabled(data.enabled ?? false);
        setLevelRoles(data.level_roles ?? []);
        setXpRate(data.xp_rate ?? 1);
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
          guild_id: selectedGuild,
          enabled,
          channel: selectedChannel,
          level_roles: levelRoles,
          xp_rate: xpRate,
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
    <section className="relative bg-[#181b25] p-6 rounded-lg max-w-2xl mx-auto mt-6">
      {loading && <PageLoader />}

      <h1 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
        Leveling Settings
        <InfoTooltip text="Work in progress" />
      </h1>

      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400">Enable Module</span>
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
        <label className="block text-sm text-gray-400 mb-2">Notification Channel</label>
        <select
          value={selectedChannel}
          onChange={(e) => setSelectedChannel(e.target.value)}
          className="w-full bg-[#0f1117] border border-gray-700 rounded p-2 text-white"
        >
          <option value="">Select channel</option>
          {channels?.map((ch) => (
            <option key={ch.id} value={ch.id}>
              {ch.name}
            </option>
          ))}
        </select>
      </div>

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
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto border border-gray-700 p-2 rounded bg-[#1f2330]">
          {roles?.map((role) => (
            <label key={role.id} className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={levelRoles.includes(role.id)}
                onChange={() => toggleRole(role.id)}
                className="accent-[var(--primary-color)]"
              />
              {role.name}
            </label>
          ))}
        </div>
      </div>

      <div className="text-right text-gray-400 text-sm mt-3">
        {isSaving ? "Saving..." : "Auto saved!"}
      </div>

      <SaveButton onClick={() => handleSave(false)} />
    </section>
  );
}
