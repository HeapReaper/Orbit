"use client";

import { useEffect, useState, useRef } from "react";
import SaveButton from "@/app/(dashboard)/dashboard/components/buttons/Save";
import { useNotification } from "@/app/context/NotificationContext";
import SelectInput from "@/app/(dashboard)/dashboard/components/inputs/Select";
import PageLoader from "@/app/(dashboard)/dashboard/components/PageLoader";
import { useGuild } from "@/app/context/GuildContext";
import { addDashboardLog } from "@/app/lib/addDashboardLog";
import InfoTooltip from "@/app/(dashboard)/dashboard/components/ui/InfoToolTip";
import DeleteButton from "@/app/(dashboard)/dashboard/components/buttons/Delete";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [users, setUsers] = useState<string[]>([""]);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { selectedGuild, channels } = useGuild();
  const { notify } = useNotification();
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.title = "YouTube Watcher Settings";
    if (!selectedGuild) return;

    const fetchGuildData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/youtube-watcher?guildId=${selectedGuild}`);
        const data = await res.json();
        setEnabled(data.enabled ?? false);
        setSelectedChannel(data.channel ?? "");
        setUsers(data.users?.length ? data.users : [""]);
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
      const resp = await fetch("/api/youtube-watcher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guildId: selectedGuild,
          channel: selectedChannel,
          enabled,
          users: users.filter((u) => u.trim() !== ""),
        }),
      });

      if (!resp.ok) {
        notify("Could not save", "", "error");
      }

      void addDashboardLog(selectedGuild, "INFO", "Updated YouTube Watcher settings");

      if (!auto) notify("Saved", "", "success");
    } catch (error) {
      if (!auto) notify("Error", String(error), "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save on change
  useEffect(() => {
    if (!selectedGuild) return;
    triggerAutoSave();
  }, [enabled, selectedChannel, users]);

  const handleUserChange = (index: number, value: string) => {
    const newUsers = [...users];
    newUsers[index] = value;
    setUsers(newUsers);
  };

  const addUser = () => setUsers([...users, ""]);
  const removeUser = (index: number) => setUsers(users.filter((_, i) => i !== index));

  return (
    <section className="relative bg-[#181b25] p-6 rounded-lg max-w-3xl mx-auto mt-6">
      {loading && <PageLoader />}

      <h1 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
        YouTube Watcher Settings
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
        label="Select channel for YouTube Notifications"
        value={selectedChannel || ""}
        onChange={(val) => setSelectedChannel(val)}
        options={channels
          .filter((c) => c.type === 0) // Filter non text channels out
          .sort((a, b) => a.name.localeCompare(b.name)) // Sort from a to Z
          .map((ch) => ({ value: ch.id, label: ch.name }))
        }
      />

      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">YouTube Users / Channels</label>
        {users.map((user, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={user}
              onChange={(e) => handleUserChange(index, e.target.value)}
              placeholder="Youtube channel URL or handle like @FliteTest"
              className="flex-1 bg-[#0f1117] border border-gray-700 rounded p-2 text-white"
            />
            {users.length > 1 && (
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