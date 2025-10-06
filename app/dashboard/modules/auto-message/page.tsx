"use client";

import { useEffect, useState } from "react";
import SaveButton from "@/app/dashboard/components/buttons/Save";
import { useNotification } from "@/app/context/NotificationContext";
import TextInput from "@/app/dashboard/components/inputs/Text";
import SelectInput from "@/app/dashboard/components/inputs/Select";
import InlineCode from "@/app/dashboard/components/ui/InlineCode";
import { useGuild } from "@/app/context/GuildContext";
import MarkdownEditor from "@/app/dashboard/components/MarkdownEditor";

type AutoMessage = {
  id: string;
  message: string;
  channel: string;
  time: string;
  enabled: boolean;
};

export default function AutoMessagesPage() {
  const { selectedGuild, channels } = useGuild();
  const { notify } = useNotification();
  const [autoMessages, setAutoMessages] = useState<AutoMessage[]>([]);

  useEffect(() => {
    if (!selectedGuild) return;

    const fetchAutoMessages = async () => {
      try {
        const res = await fetch(`/api/auto-message?guild_id=${selectedGuild}`);
        const data: AutoMessage[] = await res.json();
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
      { id: crypto.randomUUID(), message: "", channel: "", time: "", enabled: true },
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

  const handleSave = async () => {
    try {
      const resp = await fetch(`/api/automessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guild_id: selectedGuild, autoMessages }),
      });

      if (!resp.ok) return notify("Error", `${resp.statusText}`, "error");
      notify("Settings saved!", "", "success");
    } catch (err) {
      notify("Error", `${err}`, "error");
    }
  };

  return (
    <section className="bg-[#181b25] p-6 rounded-lg max-w-xl mx-auto mt-6">
      <h1 className="text-2xl font-semibold mb-4 text-white">Auto Messages</h1>

      {autoMessages.map((msg, i) => (
        <div key={msg.id} className="mb-6 border border-gray-700 rounded p-4 bg-[#1f2330]">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Auto Message {i + 1}</span>
            {autoMessages.length > 1 && (
              <button
                onClick={() => removeAutoMessage(msg.id)}
                className="text-red-500 hover:text-red-400"
              >
                Remove
              </button>
            )}
          </div>

          <div className="mb-2">
            <label className="block text-gray-400 mb-1">Message</label>
            <MarkdownEditor
              value={msg.message}
              onChange={(v) => updateAutoMessage(msg.id, "message", v)}
            />
            <p className="text-sm text-gray-500 mt-1">
              You can use <InlineCode text="{user}" /> to mention the user.
            </p>
          </div>

          <div className="mb-2">
            <label className="block text-gray-400 mb-1">Channel</label>
            <SelectInput
              label=""
              value={msg.channel}
              onChange={(v) => updateAutoMessage(msg.id, "channel", v)}
              options={channels
                .filter(c => c.type === 0)
                .map(c => ({ value: c.id, label: c.name }))}
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-400 mb-1">Time</label>
            <input
              type="time"
              value={msg.time}
              onChange={(e) => updateAutoMessage(msg.id, "time", e.target.value)}
              className="w-full bg-[#0f1117] border border-gray-700 rounded p-2 text-white"
            />
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
        </div>
      ))}

      <div className="flex flex-col gap-4">
        <button
          onClick={addAutoMessage}
          className="bg-[var(--primary-color)] text-white px-4 py-2 rounded"
        >
          Add Auto Message
        </button>

        <SaveButton onClick={handleSave} />
      </div>
    </section>
  );
}