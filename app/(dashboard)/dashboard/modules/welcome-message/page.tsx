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

export default function WelcomeMessagePage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [channel, setChannel] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { selectedGuild, channels } = useGuild();
  const { notify } = useNotification();

  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.title = "Welcome Message Settings";
    if (!selectedGuild) return;

    const fetchGuildData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/welcome-message?guild_id=${selectedGuild}`);
        const data = await res.json();

        setMessage(data.message ?? "");
        setChannel(data.channel ?? "");
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
      const resp = await fetch("/api/welcome-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guild_id: selectedGuild,
          message: cleanMessage(message),
          channel: channel ? channel.trim() : null,
          enabled: enabled ? 1 : 0,
        }),
      });

      if (!resp.ok) {
        if (!auto) notify("Oeps", "Could not save settings", "error");
      } else {
        void addDashboardLog(selectedGuild, "INFO", "Updated welcome message settings");
        if (!auto) notify("Saved", "", "success");
      }
    } catch (error) {
      if (!auto) notify("Error", `${error}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!selectedGuild) return;
    triggerAutoSave();
  }, [message, channel, enabled]);

  return (
    <section className="relative bg-[#181b25] p-6 rounded-lg max-w-2xl mx-auto mt-6">
      {loading && <PageLoader />}

      <h1 className="text-2xl font-semibold mb-4 text-white">Welcome Message Settings</h1>

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
        <label className="block text-gray-400 mb-2">Welcome Message</label>
        <div className="rounded-lg border border-gray-700 bg-[#1f2330]">
          <MarkdownEditor
            value={message ?? ""}
            onChange={setMessage}
            placeholder=""
          />
        </div>
        <p className="text-sm text-gray-500 mb-4 mt-2">
          You can use <InlineCode text="{user}" /> to mention the user in the message.
        </p>
      </div>

      <SelectInput
        label="Announcement channel"
        value={channel || ""}
        onChange={setChannel}
        options={channels
          .filter(c => c.type === 0)
          .map(ch => ({ value: ch.id, label: ch.name }))}
      />

      <MessagePreview
        username="Orbit"
        message={message?.replace("{user}", "@HeapReaper") ?? ""}
      />

      <div className="text-right text-gray-400 text-sm mt-3">
        {isSaving ? "Saving..." : "Auto saved!"}
      </div>

      <SaveButton onClick={() => handleSave(false)} />
    </section>
  );
}