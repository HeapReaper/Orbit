"use client";

import { useState, useEffect, useRef } from "react";
import SaveButton from "@/app/(dashboard)/dashboard/components/buttons/Save";
import { useNotification } from "@/app/context/NotificationContext";
import PageLoader from "@/app/(dashboard)/dashboard/components/PageLoader";
import InfoTooltip from "@/app/(dashboard)/dashboard/components/ui/InfoToolTip";
import DeleteButton from "@/app/(dashboard)/dashboard/components/buttons/Delete";
import { useGuild } from "@/app/context/GuildContext";
import { addDashboardLog } from "@/app/lib/addDashboardLog";

type Invite = {
  code: string;
  inviter: string;
  channel: string;
  uses: number;
  type: string;
};

export default function InviteTrackerPage() {
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { selectedGuild } = useGuild();
  const { notify } = useNotification();
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.title = "Invite Tracker Settings";
    if (!selectedGuild) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/invite-tracker?guildId=${selectedGuild}`);
        if (res.ok) {
          const data = await res.json();
          setEnabled(data?.enabled ?? false);
          setInvites(data?.invites ?? []);
        } else {
          setInvites([]);
        }
      } catch (err) {
        console.error("Failed to fetch invite tracker data:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [selectedGuild]);

  const triggerAutoSave = () => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      void handleSave(true);
    }, 1500);
  };

  useEffect(() => {
    if (!selectedGuild) return;
    triggerAutoSave();
  }, [enabled, invites]);

  const updateInviteType = (code: string, newType: string) => {
    setInvites((prev) =>
      // `setInvites` updates the state based on the previous value (`prev`)
      prev.map((i) =>
        // Loop through each invite object (`i`) in the previous array
        i.code === code
          // If the current invite's code matches the one we want to update...
          ? {
            ...i,          // ...copy all the existing invite data
            type: newType  // ...but overwrite the `type` (invite label) with the new value
          }
          // Otherwise, leave this invite unchanged
          : i
      )
    );
  };

  const handleSave = async (auto = false) => {
    if (!selectedGuild) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/invite-tracker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guildId: selectedGuild,
          enabled,
          invites: invites.map((i) => ({
            code: i.code,
            type: i.type,
          })),
        }),
      });

      if (!res.ok) {
        if (!auto) notify("Failed to save settings", "", "error");
      } else {
        void addDashboardLog(selectedGuild, "INFO", "Updated Invite Tracker settings");
        if (!auto) notify("Saved!", "", "success");
      }
    } catch (err) {
      if (!auto) notify("Error saving settings", String(err), "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="relative bg-[#181b25] p-6 rounded-lg max-w-3xl mx-auto mt-6">
      {loading && <PageLoader />}

      <h1 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
        Invite Tracker Settings
        <InfoTooltip text="Track and label your invite links" />
      </h1>

      {/* Enable */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-gray-400">Enable Invite Tracker</span>
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

      {/* Invite List */}
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">Invite Links</label>
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto border border-gray-700 p-2 rounded bg-[#1f2330]">
          {invites.map((inv) => (
            <div key={inv.code} className="flex items-center gap-2">
              <span className="text-gray-400 bg-[#0f1117] border border-gray-700 px-3 py-2 rounded w-32 text-center">
                #{inv.code}
              </span>
              <input
                type="text"
                value={inv.type || ""}
                onChange={(e) => updateInviteType(inv.code, e.target.value)}
                placeholder="Enter custom label (like Facebook)"
                className="flex-1 bg-[#0f1117] border border-gray-700 rounded p-2 text-white"
              />
              <span className="text-sm text-gray-500 w-32">{inv.uses} uses</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-right text-gray-400 text-sm mt-3">
        {isSaving ? "Saving..." : "Auto saved!"}
      </div>

      <SaveButton onClick={() => void handleSave(false)} />
    </section>
  );
}