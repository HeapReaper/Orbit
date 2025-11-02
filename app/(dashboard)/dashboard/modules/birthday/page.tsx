"use client";

import { useEffect, useState, useRef } from "react";
import SaveButton from "@/app/(dashboard)/dashboard/components/buttons/Save";
import { useNotification } from "@/app/context/NotificationContext";
import SelectInput from "@/app/(dashboard)/dashboard/components/inputs/Select";
import InlineCode from "@/app/(dashboard)/dashboard/components/ui/InlineCode";
import { useGuild } from "@/app/context/GuildContext";
import MarkdownEditor from "@/app/(dashboard)/dashboard/components/MarkdownEditor";
import MessagePreview from "@/app/(dashboard)/dashboard/components/previews/Message";
import PageLoader from "@/app/(dashboard)/dashboard/components/PageLoader";
import cleanMessage from "@/app/lib/cleanMessage";
import { addDashboardLog } from "@/app/lib/addDashboardLog";
import InfoTooltip from "@/app/(dashboard)/dashboard/components/ui/InfoToolTip";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { selectedGuild, channels } = useGuild();
  const { notify } = useNotification();
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.title = "Birthday settings";
    if (!selectedGuild) return;

    const fetchGuildData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/birthday?guildId=${selectedGuild}`);
        const data = await res.json();
        setMessage(data.message ?? "");
        setTime(data.time ?? "");
        setSelectedChannel(data.channel ?? "");
        setEnabled(data.enabled ?? false);
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
      const resp = await fetch("/api/birthday", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guildId: selectedGuild,
          channel: selectedChannel,
          message: cleanMessage(message),
          time,
          enabled,
        }),
      });

      if (!resp.ok) {
        notify("Could not save", "", "error")
      }

      void addDashboardLog(selectedGuild, "INFO", "Updated birthday settings");

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
  }, [message, time, enabled, selectedChannel]);

  return (
    <section className="relative bg-[#181b25] p-6 rounded-lg max-w-3xl mx-auto mt-6">
      {loading && <PageLoader />}

      <h1 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
        Birthday Settings
        <InfoTooltip text="Work in progress" />
      </h1>

      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400">Enable</span>
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

      <div className="mb-6">
        <label className="block text-gray-400 mb-2">Birthday Message</label>
        <div className="rounded-lg border border-gray-700 bg-[#1f2330]">
          <MarkdownEditor
            value={message}
            onChange={(v) => setMessage(v)}
            placeholder=""
          />
        </div>
        <p className="text-sm text-gray-500 mb-4 mt-1">
          You can use <InlineCode text="{user}" /> to mention the user and{" "}
          <InlineCode text="{age}" /> to display their age.
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">Announcement Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full bg-[#0f1117] border border-gray-700 rounded p-2 text-white"
        />
      </div>

      <SelectInput
        label="Select channel"
        value={selectedChannel || ""}
        onChange={(val) => setSelectedChannel(val)}
        options={channels
          .filter((c) => c.type === 0) // Filter non text channels out
          .sort((a, b) => a.name.localeCompare(b.name)) // Sort from a to Z
          .map((ch) => ({ value: ch.id, label: ch.name }))
        }
      />

      <MessagePreview
        username="Orbit"
        message={message.replace("{age}", "24").replace("{user}", "@HeapReaper")}
        channels={Object.fromEntries(channels.map(channel => [channel.id, channel.name]))}
      />

      <div className="text-right text-gray-400 text-sm mt-3">
        {isSaving ? "Saving..." : "Auto saved!"}
      </div>

      <SaveButton onClick={() => handleSave(false)} />
    </section>
  );
}
