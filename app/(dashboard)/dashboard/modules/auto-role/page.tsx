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
  const [autoRoles, setAutoRoles] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const { selectedGuild, roles } = useGuild();
  const { notify } = useNotification();
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.title = "Auto Role Settings";
    if (!selectedGuild) return;

    const fetchGuildData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/auto-role?guildId=${selectedGuild}`);
        const data = await res.json();
        setEnabled(data.enabled ?? false);
        setAutoRoles(data.autoRoles ?? []);
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
      const resp = await fetch("/api/auto-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guildId: selectedGuild,
          enabled,
          autoRoles,
        }),
      });

      if (!resp.ok) {
        notify("Could not save", "", "error");
      }

      void addDashboardLog(selectedGuild, "INFO", "Updated Auto Role settings");

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
  }, [enabled, autoRoles]);

  const toggleRole = (roleId: string) => {
    if (autoRoles.includes(roleId)) {
      setAutoRoles(autoRoles.filter((r) => r !== roleId));
    } else {
      setAutoRoles([...autoRoles, roleId]);
    }
  };

  return (
    <section className="relative bg-[#181b25] p-6 rounded-lg max-w-3xl mx-auto mt-6">
      {loading && <PageLoader />}

      <h1 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
        Auto Role Settings
        <InfoTooltip text="You can automaticly add specific roles to new users when they join your server." />
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
        <label className="block text-sm text-gray-400 mb-2">Roles to assign</label>

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
                  checked={autoRoles.includes(role.id)}
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
