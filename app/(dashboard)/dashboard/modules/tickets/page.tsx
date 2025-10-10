"use client";

import { useEffect, useState } from "react";
import SaveButton from "@/app/(dashboard)/dashboard/components/buttons/Save";
import { useNotification } from "@/app/context/NotificationContext";
import SelectInput from "@/app/(dashboard)/dashboard/components/inputs/Select";
import {useGuild} from "@/app/context/GuildContext";
import PageLoader from "@/app/(dashboard)/dashboard/components/PageLoader";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);

  const [enabled, setEnabled] = useState<boolean>(false);
  const [channel, setChannel] = useState<string>("");
  const [channelConfidential, setChannelConfidential] = useState<string>("");
  const { notify } = useNotification();
  const { selectedGuild, channels } = useGuild();

  useEffect(() => {
    if (!selectedGuild) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await fetch(`/api/tickets-settings?guild_id=${selectedGuild}`);
        const data = await res.json();

        setLoading(false);

        setChannel(data.channel);
        setChannelConfidential(data.channel_conf);
        setEnabled(data.enabled != null ? data.enabled : false);
      } catch (err) {
        console.error(err);
      }
    };

    void fetchData();
  }, [selectedGuild]);

  const handleSave = async () => {
    try {
      const resp = await fetch("/api/tickets-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guild_id: selectedGuild,
          channel: channel,
          channel_conf: channelConfidential,
          enabled: enabled ? 1 : 0,
        })
      });

      if (!resp.ok) {
        return notify("Oops", "Could not save settings", "error");
      }

      notify("Saved", "", "success");
    } catch (error) {
      notify("Error", `${error}`, "error");
    }
  };

  return (
    <section className="relative bg-[#181b25] p-6 rounded-lg max-w-2xl mx-auto mt-6">
      {loading && <PageLoader />}

      <h1 className="text-2xl font-semibold mb-4 text-white">Tickets Settings</h1>

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
        label="Ticket channel"
        value={channel || ""}
        onChange={(val) => setChannel(val)}
        options={channels.filter(c => c.type === 0).map(channel => ({
          value: channel.id,
          label: channel.name,
        }))}
      />

      <SelectInput
        label="Tickets confidential channel"
        value={channelConfidential || ""}
        onChange={(val) => setChannelConfidential(val)}
        options={[
          { value: "not-necessary", label: "Not necessary" },
          ...channels
            .filter(c => c.type === 0)
            .map(channel => ({
              value: channel.id,
              label: channel.name,
            }))
        ]}
      />

      <SaveButton onClick={handleSave} />
    </section>
  );
}
