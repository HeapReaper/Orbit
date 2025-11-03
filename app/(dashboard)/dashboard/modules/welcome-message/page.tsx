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
import DeleteButton from "@/app/(dashboard)/dashboard/components/buttons/Delete";

export default function WelcomeMessagePage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([""]);
  const [channel, setChannel] = useState<string>("");
  const [randomize, setRandomize] = useState<boolean>(false);
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
        const res = await fetch(`/api/welcome-message?guildId=${selectedGuild}`);
        const data = await res.json();
        setMessages(data.messages?.length ? data.messages : [""]);
        setChannel(data.channel ?? "");
        setEnabled(data.enabled ?? false);
        setRandomize(data.randomize ?? false);
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
          guildId: selectedGuild,
          messages: messages.map((m) => cleanMessage(m)).filter((m) => m.trim() !== ""),
          channel: channel || null,
          enabled: enabled ? 1 : 0,
          randomize,
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
  }, [messages, channel, enabled, randomize]);

  const handleMessageChange = (index: number, value: string) => {
    const newMessages = [...messages];
    newMessages[index] = value;
    setMessages(newMessages);
  };

  const addMessage = () => setMessages([...messages, ""]);
  const removeMessage = (index: number) => setMessages(messages.filter((_, i) => i !== index));

  return (
    <section className="relative bg-[#181b25] p-6 rounded-lg max-w-3xl mx-auto mt-6">
      {loading && <PageLoader />}

      <h1 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
        Welcome Message Settings
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

      <SelectInput
        label="Announcement channel"
        value={channel || ""}
        onChange={setChannel}
        options={channels
          .filter((c) => c.type === 0) // Filter non text channels out
          .sort((a, b) => a.name.localeCompare(b.name)) // Sort from a to Z
          .map((ch) => ({ value: ch.id, label: ch.name }))
        }
      />

      <div className="mb-4">
        <label className="flex items-center gap-2 text-gray-400 mb-2">
          <input
            type="checkbox"
            checked={randomize}
            onChange={() => setRandomize(!randomize)}
            className="accent-[var(--primary-color)]"
          />
          Pick messages randomly
        </label>
      </div>

      <div className="mb-6">
        {messages.map((msg, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between mb-2">
              <label className="block text-gray-400 mb-1">Message {index + 1}</label>
              {messages.length > 1 && (
                <DeleteButton
                  onClick={() => removeMessage(index)}
                />
              )}
            </div>
            <div className="flex gap-2">
              <div className="flex-1 rounded-lg border border-gray-700 bg-[#1f2330]">
                <MarkdownEditor
                  value={msg}
                  onChange={(val) => handleMessageChange(index, val)}
                  placeholder=""
                />
              </div>

            </div>
            <p className="text-sm text-gray-500 mb-4 mt-1">
              You can use <InlineCode text="{user}" /> to mention the user.
            </p>
          </div>
        ))}
        <button
          type="button"
          onClick={addMessage}
          className="bg-[var(--primary-color)] hover:brightness-90 text-white px-3 py-1 rounded"
        >
          Add Message
        </button>
      </div>

      <MessagePreview
        username="Orbit"
        message={messages[0]?.replace("{user}", "@HeapReaper") ?? ""}
        channels={Object.fromEntries(channels.map(channel => [channel.id, channel.name]))}
      />

      <div className="text-right text-gray-400 text-sm mt-3">
        {isSaving ? "Saving..." : "Auto saved!"}
      </div>

      <SaveButton onClick={() => handleSave(false)} />
    </section>
  );
}
