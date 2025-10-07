"use client";

import {useEffect, useState} from "react";
import SaveButton from "@/app/dashboard/components/buttons/Save";
import { useNotification } from "@/app/context/NotificationContext";
import TextInput from "@/app/dashboard/components/inputs/Text";
import SelectInput from "@/app/dashboard/components/inputs/Select";
import InlineCode from "@/app/dashboard/components/ui/InlineCode";
import { useGuild } from "@/app/context/GuildContext";
import MarkdownEditor from "@/app/dashboard/components/MarkdownEditor";
import MessagePreview from "@/app/dashboard/components/previews/Message";

export default function Page() {
  const [enabled, setEnabled] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const { selectedGuild, channels } = useGuild();

  const { notify } = useNotification();

  useEffect(() => {
    if (!selectedGuild) return;

    const fetchGuildData = async () => {
      try {
        const res = await fetch(`/api/birthday?guild_id=${selectedGuild}`);
        const data = await res.json();

        setMessage(data.message != null ? data.message : "");
        setTime(data.time != null ? data.time : "");
        setSelectedChannel(data.channel != null ? data.channel : "");
        setEnabled(data.enabled != null ? data.enabled : false);
      } catch (err) {
        console.error(err);
      }

    };

    void fetchGuildData();
  }, [selectedGuild]);

  const handleSave = async () => {
    try {
      const resp = await fetch("/api/birthday", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guild_id: selectedGuild,
          channel: selectedChannel,
          message: message,
          time: time,
          enabled: enabled,
        }),
      });

      if (!resp.ok) {
        return notify("Error", `${resp.statusText}`, "error");
      }
    } catch (error) {
      return notify("Error", `${error}`, "error");
    }

    notify("Settings saved!", "", "success");
  };

  return (
    <section className="bg-[#181b25] p-6 rounded-lg max-w-xl mx-auto mt-6">
      <h1 className="text-2xl font-semibold mb-4 text-white">Birthday Settings</h1>

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
        <label className="block text-gray-400 mb-2">Bump Message</label>
        <div className="rounded-lg border border-gray-700 bg-[#1f2330]">
          <MarkdownEditor
            value={message}
            onChange={setMessage}
            placeholder=""
          />
        </div>
        <p className="text-sm text-gray-500 mb-4 mt-1">
          You can use <InlineCode text={"{user}"}/> to mention the user in the message and <InlineCode text={"{age}"}/> to display his age.
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
        options={channels.filter(c => c.type === 0).map(channel => ({
          value: channel.id,
          label: channel.name,
        }))}
      />

      <MessagePreview
        username="Orbit"
        message={message.replace("{age}", "24").replace("{user}", "@HeapReaper")}
      />

      <SaveButton onClick={handleSave} />
    </section>
  );
}
