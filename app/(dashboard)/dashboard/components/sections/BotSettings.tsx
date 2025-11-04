"use client";

import SelectInput from "@/app/(dashboard)/dashboard/components/inputs/Select";
import TextInput from "@/app/(dashboard)/dashboard/components/inputs/Text";
import { useNotification } from "@/app/context/NotificationContext";
import { useEffect, useState, useRef } from "react";
import { useGuild } from "@/app/context/GuildContext";
import PageLoader from "@/app/(dashboard)/dashboard/components/PageLoader";
import { addDashboardLog } from "@/app/lib/addDashboardLog";
import InfoTooltip from "@/app/(dashboard)/dashboard/components/ui/InfoToolTip";
import SaveButton from "@/app/(dashboard)/dashboard/components/buttons/Save";
import { botSettingsSchema } from "@/app/zod/botSettings";

export default function BotSettings() {
  const [loading, setLoading] = useState<boolean>(false);
  const { notify } = useNotification();
  const { selectedGuild, channels } = useGuild();

  const [nickname, setNickname] = useState<string>("Orbit");
  const [language, setLanguage] = useState<string>("");
  const [updatesChannel, setUpdatesChannel] = useState<string>("");
  const [timezone, setTimezone] = useState<string>("Europe/Amsterdam");
  const [primaryColor, setPrimaryColor] = useState<string>("");
  const [secondaryColor, setSecondaryColor] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.title = "Bot settings";
    if (!selectedGuild) return;

    const fetchGuildData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/bot-settings?guildId=${selectedGuild}`);
        const data = await res.json();
        setNickname(data.nickname ?? "");
        setLanguage(data.language ?? "");
        setUpdatesChannel(data.updatesChannel ?? "");
        setTimezone(data.timezone ?? "Europe/Amsterdam");
        setPrimaryColor(data.primaryColor ?? "#5865F2");
        setSecondaryColor(data.secondaryColor ?? "#2F3136");
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
    const formData = {
      guildId: selectedGuild,
      nickname,
      language,
      updatesChannel,
      timezone,
      primaryColor,
      secondaryColor,
    }

    // Validate data and show errors
    const validation = botSettingsSchema.safeParse(formData);
    if (!validation.success) {
      const formatted: Record<string, string> = {};

      Object.entries(validation.error.flatten().fieldErrors).forEach(([key, value]) => {
        if (value && value.length > 0) formatted[key] = value[0];
        notify("Validation error", `${value[0]}`)
      });

      setIsSaving(false);
      return;
    }

    try {
      const resp = await fetch("/api/bot-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      if (!resp.ok) {
        if (!auto) notify("Error", `${resp.statusText}`, "error");
      } else {
        void addDashboardLog(selectedGuild, "INFO", "Updated the bot settings");
        if (!auto) notify("Settings saved!", "", "success");
      }
    } catch (error) {
      if (!auto) notify("Error", `${error}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Watch changes for auto-save
  useEffect(() => {
    if (!selectedGuild) return;
    triggerAutoSave();
  }, [nickname, language, updatesChannel, timezone, primaryColor, secondaryColor]);

  const timezones = Intl.supportedValuesOf("timeZone").map((tz) => {
    const now = new Date();
    const tzName = now.toLocaleTimeString("en-US", { timeZone: tz, timeZoneName: "short" });
    const parts = tzName.split(" ");
    const rawOffset = parts.length > 1 ? parts.pop() : "UTC";
    const offset = rawOffset?.replace("GMT", "UTC") ?? "UTC";
    return { value: tz, label: `${tz} (${offset})` };
  });

  return (
    <section className="relative bg-[#181b25] p-6 rounded-lg space-y-6">
      {loading && <PageLoader />}

      <h1 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
        Bot Settings
        <InfoTooltip text="Work in progress" />
      </h1>

      <form className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <TextInput label="Nickname" value={nickname ?? ""} onChange={setNickname} />

          <SelectInput
            label="Language"
            value={language ?? ""}
            onChange={setLanguage}
            options={[
              { value: "en", label: "English" },
              { value: "nl", label: "Dutch" },
            ]}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <SelectInput
            label="Updates channel"
            value={updatesChannel || ""}
            onChange={setUpdatesChannel}
            options={channels.filter(c => c.type === 0).map(ch => ({ value: ch.id, label: ch.name }))}
          />

          <SelectInput
            label="Timezone"
            value={timezone || ""}
            onChange={setTimezone}
            options={timezones}
          />
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

        <div className="text-right text-gray-400 text-sm mt-3">
          {isSaving ? "Saving..." : "Auto saved!"}
        </div>

        <SaveButton onClick={() => handleSave(false)} />
      </form>
    </section>
  );
}
