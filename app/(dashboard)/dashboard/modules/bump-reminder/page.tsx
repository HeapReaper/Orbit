"use client";

import {useEffect, useState} from "react";
import SaveButton from "@/app/(dashboard)/dashboard/components/buttons/Save";
import { useNotification } from "@/app/context/NotificationContext";
import TextInput from "@/app/(dashboard)/dashboard/components/inputs/Text";
import NumberInput from "@/app/(dashboard)/dashboard/components/inputs/Number";
import SelectInput from "@/app/(dashboard)/dashboard/components/inputs/Select";
import { useGuild } from "@/app/context/GuildContext";
import MarkdownEditor from "@/app/(dashboard)/dashboard/components/MarkdownEditor";
import MessagePreview from "@/app/(dashboard)/dashboard/components/previews/Message";
import PageLoader from "@/app/(dashboard)/dashboard/components/PageLoader";
import cleanMessage from "@/app/lib/cleanMessage";

export default function BumpReminderPage() {
  const [loading, setLoading] = useState<boolean>(false);

  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [intervalHours, setIntervalHours] = useState<number>(1);
  const { selectedGuild, setSelectedGuild, channels } = useGuild();
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const { notify } = useNotification();

  useEffect(() => {
    document.title = "Bump reminder settings";

    if (!selectedGuild) return;

    const fetchGuildData = async () => {
      setLoading(true);

      try {
        const res = await fetch(`/api/bumpreminders?guild_id=${selectedGuild}`);
        const data = await res.json();

        setLoading(false);
        setMessage(data.message != null ? data.message : "");
        setIntervalHours(data.interval != null ? data.interval : "");
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
      const resp = await fetch("/api/bumpreminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guild_id: selectedGuild,
          channel: selectedChannel,
          message: cleanMessage(message),
          interval: intervalHours,
          enabled: enabled ? 1 : 0,
        })
      });

      if (!resp.ok) {
        return notify("Oeps", "Could not save settings", "error");
      }

      notify("Saved", "", "success");
    } catch (error) {
      notify("Error", `${error}`, "error");
    }
  };

  return (
    <section className="relative bg-[#181b25] p-6 rounded-lg max-w-2xl mx-auto mt-6">
      {loading && <PageLoader />}

      <h1 className="text-2xl font-semibold mb-4 text-white">Bump Reminder Settings</h1>

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
      </div>

      <NumberInput
        label="Interval (hours)"
        value={intervalHours}
        onChange={setIntervalHours}
        min={1}
        max={24}
      />

      <SelectInput
        label="Select channel"
        value={selectedChannel || ""}
        onChange={(val) => setSelectedChannel(val)}
        options={channels.filter(c => c.type === 0).map(channel => ({
          value: channel.id,
          label: channel.name,
        }))}
      />


      <MessagePreview username="Orbit" message={message} />

      <SaveButton onClick={handleSave} />
    </section>
  );
}
