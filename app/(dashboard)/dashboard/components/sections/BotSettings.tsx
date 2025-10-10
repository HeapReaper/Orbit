"use client";

import IconButton from "@/app/(dashboard)/dashboard/components/inputs/IconButton";
import { Bot, Save } from "lucide-react";
import SelectInput from "@/app/(dashboard)/dashboard/components/inputs/Select";
import TextInput from "@/app/(dashboard)/dashboard/components/inputs/Text";
import { useNotification } from "@/app/context/NotificationContext";
import {useEffect, useState} from "react";
import { useGuild } from "@/app/context/GuildContext";

export default function BotSettings() {
  const { notify } = useNotification();

  const [nickname, setNickname] = useState<string>("Orbit");
  const [language, setLanguage] = useState<string>("");
  const [updatesChannel, setUpdatesChannel] = useState<string>("");
  const [timezone, setTimezone] = useState<string>("Europe/Amsterdam");
  const [primaryColor, setPrimaryColor] = useState<string>("");
  const [secondaryColor, setSecondaryColor] = useState<string>("");
  const { selectedGuild, channels } = useGuild();

  useEffect(() => {
    if (!selectedGuild) return;

    const fetchGuildData = async () => {
      try {
        const res = await fetch(`/api/bot-settings?guild_id=${selectedGuild}`);
        const data = await res.json();

        setNickname(data.nickname ?? "");
        setUpdatesChannel(data.updates_channel  ?? "");
        setTimezone(data.timezone  ?? "");
        setPrimaryColor(data.primary_color);
        setSecondaryColor(data.secondary_color);
      } catch (err) {
        console.error(err);
      }
    };

    void fetchGuildData();
  }, [selectedGuild]);

  const handleSave = async () => {
    console.log(primaryColor)
    try {
      const resp = await fetch("/api/bot-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guild_id: selectedGuild,
          nickname: nickname,
          language: language,
          updates_channel: updatesChannel,
          timezone: timezone,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
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
    <section className="bg-[#181b25] p-6 rounded-lg space-y-6">
      <div className="flex items-center gap-2 mb-3">
        <Bot className="w-6 h-6 text-[var(--primary-color)]" />
        <h2 className="text-lg font-semibold">Bot Settings</h2>
      </div>

      <form className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <TextInput label="Nickname" value={nickname ?? ""} onChange={setNickname} />

          <SelectInput
            label="Language"
            value={language ?? ""}
            onChange={setLanguage}
            options={[
              { value: "en", label: "English" },
            ]}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <SelectInput
            label="Updates channel"
            value={updatesChannel || ""}
            onChange={(val) => setUpdatesChannel(val)}
            options={channels.filter(c => c.type === 0).map(channel => ({
              value: channel.id,
              label: channel.name,
            }))}
          />

          <TextInput label="Timezone" value={timezone ?? ""} onChange={setTimezone} />
        </div>

        <div className="border-t border-gray-700 pt-4 space-y-4 mb-3">
          <h3 className="text-md font-semibold text-gray-300 mb-2">Theme Settings</h3>

          <div className="grid md:grid-cols-2 gap-4 items-center">
            <label className="block text-gray-400">Primary Color</label>
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-full h-10 p-0 border border-gray-700 rounded cursor-pointer"
            />

            <label className="block text-gray-400">Secondary Color</label>
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="w-full h-10 p-0 border border-gray-700 rounded cursor-pointer"
            />
          </div>
        </div>

        <IconButton icon={Save} label="Save Settings" size={24} onClick={handleSave} />
      </form>
    </section>
  );
}
