"use client";

import {useEffect, useRef, useState} from "react";
import SaveButton from "@/app/(dashboard)/dashboard/components/buttons/Save";
import DeleteButton from "@/app/(dashboard)/dashboard/components/buttons/Delete";
import { useNotification } from "@/app/context/NotificationContext";
import { useGuild } from "@/app/context/GuildContext";
import MarkdownEditor from "@/app/(dashboard)/dashboard/components/MarkdownEditor";
import MessagePreview from "@/app/(dashboard)/dashboard/components/previews/Message";
import PageLoader from "@/app/(dashboard)/dashboard/components/PageLoader";
import cleanMessage from "@/app/lib/cleanMessage";
import {addDashboardLog} from "@/app/lib/addDashboardLog";
import InfoTooltip from "@/app/(dashboard)/dashboard/components/ui/InfoToolTip";
import ChannelSelect from "@/app/(dashboard)/dashboard/components/inputs/ChannelSelect";

type AutoMessage = {
  id: string;
  message: string;
  channel: string;
  time: string;
  days: string[];
  enabled: boolean;
};

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);

  const { selectedGuild, channels } = useGuild();
  const { notify } = useNotification();
  const [autoMessages, setAutoMessages] = useState<AutoMessage[]>([]);

  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    document.title = "Auto message settings";

    if (!selectedGuild) return;

    const fetchAutoMessages = async () => {
      setLoading(true);

      try {
        const res = await fetch(`/api/auto-message?guildId=${selectedGuild}`);
        const data: AutoMessage[] = await res.json();

        setLoading(false);
        setAutoMessages(data);
      } catch (err) {
        console.error(err);
      }
    };

    void fetchAutoMessages();
  }, [selectedGuild]);

  const addAutoMessage = () => {
    setAutoMessages(prev => [
      ...prev,
      { id: crypto.randomUUID(), message: "", channel: "", time: "", days: [], enabled: true },
    ]);
  };

  const updateAutoMessage = (id: string, field: keyof AutoMessage, value: any) => {
    setAutoMessages(prev =>
      prev.map(msg => (msg.id === id ? { ...msg, [field]: value } : msg))
    );
  };

  const removeAutoMessage = (id: string) => {
    setAutoMessages(prev => prev.filter(msg => msg.id !== id));
  };

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
      const cleanedAutoMessages = autoMessages.map(msg => ({
        ...msg,
        message: cleanMessage(msg.message)
      }));

      const resp = await fetch(`/api/auto-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guildId: selectedGuild, autoMessages: cleanedAutoMessages }),
      });

      if (!resp.ok) throw new Error(resp.statusText);

      void addDashboardLog(selectedGuild, "INFO", "Updated the auto messages module");

      if (!auto) notify("Saved!", "", "success");
    } catch (err) {
      if (!auto) notify("Error", `${err}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!selectedGuild) return;
    triggerAutoSave();
  }, [autoMessages, selectedGuild]);

  return (
    <section className="relative bg-[#181b25] p-6 rounded-lg max-w-3xl mx-auto mt-6">
      {loading && <PageLoader />}

      <h1 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
        Automatic Messages Settings
        <InfoTooltip text="Work in progress" />
      </h1>

      {autoMessages.map((msg, i) => (
        <div key={msg.id} className="mb-6 border border-gray-700 rounded p-4 bg-[#1f2330]">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Auto Message {i + 1}</span>
            {autoMessages.length > 1 && (
              <DeleteButton
                onClick={() => removeAutoMessage(msg.id)}
              />
            )}
          </div>

          <div className="mb-2">
            <label className="block text-gray-400 mb-1">Message</label>
            <MarkdownEditor
              value={msg.message}
              onChange={(v) => updateAutoMessage(msg.id, "message", v)}
            />
          </div>

          <ChannelSelect
            label="Select channel for the automatic message"
            value={msg.channel ?? ""}
            onChange={(value) => updateAutoMessage(msg.id, "channel", value)}
          />

          <div className="mb-2">
            <label className="block text-gray-400 mb-1">Time</label>
            <input
              type="time"
              value={msg.time}
              onChange={(e) => updateAutoMessage(msg.id, "time", e.target.value)}
              className="w-full bg-[#0f1117] border border-gray-700 rounded p-2 text-white"
            />
          </div>

          <div className="mb-3 mt-3">
            <label className="block text-gray-400 mb-1">Days</label>
            <div className="flex flex-wrap gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                <label
                  key={day}
                  className={`cursor-pointer px-2 py-1 rounded border text-sm ${
                    msg.days?.includes(day)
                      ? "bg-[var(--primary-color)] border-[var(--primary-color)] text-white"
                      : "bg-[#0f1117] border-gray-700 text-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={msg.days?.includes(day)}
                    onChange={(e) => {
                      const newDays = e.target.checked
                        ? [...(msg.days || []), day]
                        : (msg.days || []).filter(d => d !== day);
                      updateAutoMessage(msg.id, "days", newDays);
                    }}
                    className="hidden"
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-gray-400 mr-2">Enabled</span>
            <button
              type="button"
              onClick={() => updateAutoMessage(msg.id, "enabled", !msg.enabled)}
              className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-200 focus:outline-none ${
                msg.enabled ? "bg-[var(--primary-color)]" : "bg-gray-700"
              }`}
            >
              <span
                className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${
                  msg.enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <MessagePreview
            username="Orbit"
            message={msg.message}
            channels={Object.fromEntries(channels.map(channel => [channel.id, channel.name]))}
          />
        </div>
      ))}

      {/* @ts-ignore */}
      <button
        onClick={addAutoMessage}
        className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg"
      >
        Add auto message
      </button>

      <div className="text-right text-gray-400 text-sm mt-3">
        {isSaving ? "Saving..." : "Auto saved!"}
      </div>

      <SaveButton onClick={handleSave} />
    </section>
  );
}