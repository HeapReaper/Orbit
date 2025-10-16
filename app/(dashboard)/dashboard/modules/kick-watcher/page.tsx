"use client";

import { useEffect, useState, useRef } from "react";
import SaveButton from "@/app/(dashboard)/dashboard/components/buttons/Save";
import { useNotification } from "@/app/context/NotificationContext";
import SelectInput from "@/app/(dashboard)/dashboard/components/inputs/Select";
import PageLoader from "@/app/(dashboard)/dashboard/components/PageLoader";
import { useGuild } from "@/app/context/GuildContext";
import { addDashboardLog } from "@/app/lib/addDashboardLog";
import InfoTooltip from "@/app/(dashboard)/dashboard/components/ui/InfoToolTip";
import PremiumLabel from "@/app/(dashboard)/dashboard/components/labels/Premium";
import DeleteButton from "@/app/(dashboard)/dashboard/components/buttons/Delete";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [kickUsers, setKickUsers] = useState<string[]>([""]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPremium, setIsPremium] = useState<boolean>(false);

  const { selectedGuild, channels } = useGuild();
  const { notify } = useNotification();
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.title = "Kick Watcher Settings";

    if (!selectedGuild) return;

    const fetchGuildData = async () => {
      setLoading(true);

      const res = await fetch(`/api/premium?guild_id=${selectedGuild}`);
      const dataPremium = await res.json();
      setIsPremium(dataPremium?.premium ?? false);

      try {
        const res = await fetch(`/api/kick-watcher?guild_id=${selectedGuild}`);
        const data = await res.json();
        setEnabled(data.enabled ?? false);
        setSelectedChannel(data.channel ?? "");
        setKickUsers(data.users?.length ? data.users : [""]);
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
      const resp = await fetch("/api/kick-watcher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guild_id: selectedGuild,
          channel: selectedChannel,
          enabled,
          users: kickUsers.filter((u) => u.trim() !== ""),
        }),
      });

      if (!resp.ok) {
        notify("Could not save", "", "error");
      }

      void addDashboardLog(selectedGuild, "INFO", "Updated kick Watcher settings");

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
  }, [enabled, selectedChannel, kickUsers]);

  const handleUserChange = (index: number, value: string) => {
    const newUsers = [...kickUsers];
    newUsers[index] = value;
    setKickUsers(newUsers);
  };

  const addUser = () => setKickUsers([...kickUsers, ""]);
  const removeUser = (index: number) => setKickUsers(kickUsers.filter((_, i) => i !== index));

  if (!isPremium) {
    return (
      <section className="relative bg-[#181b25] p-6 rounded-lg max-w-3xl mx-auto mt-6 text-center text-gray-400">
        <p className="text-lg font-semibold mb-2 text-white">Premium Required</p>
        <p>This feature is only available for premium guilds.</p>
      </section>
    );
  }

  return (
    <section className="relative bg-[#181b25] p-6 rounded-lg max-w-3xl mx-auto mt-6">
      {loading && <PageLoader />}

      <h1 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
        Kick Watcher Settings
        <InfoTooltip text="Work in progress" />

        <PremiumLabel />
      </h1>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-white">Analytics</h1>
      </div>

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
        label="Select channel for Kick Notifications"
        value={selectedChannel || ""}
        onChange={(val) => setSelectedChannel(val)}
        options={channels
          .filter((c) => c.type === 0)
          .map((ch) => ({ value: ch.id, label: ch.name }))}
      />

      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">Kick Users / Channels</label>
        {kickUsers.map((user, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={user}
              onChange={(e) => handleUserChange(index, e.target.value)}
              placeholder="kick_username_or_channel"
              className="flex-1 bg-[#0f1117] border border-gray-700 rounded p-2 text-white"
            />
            {kickUsers.length > 1 && (
              <DeleteButton onClick={() => removeUser(index)} />
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addUser}
          className="bg-[var(--primary-color)] hover:brightness-90 text-white px-3 py-1 rounded"
        >
          Add User
        </button>
      </div>

      <div className="text-right text-gray-400 text-sm mt-3">
        {isSaving ? "Saving..." : "Auto saved!"}
      </div>

      <SaveButton onClick={() => handleSave(false)} />
    </section>
  );
}