"use client";

import { useState, useEffect, useRef } from "react";
import SaveButton from "@/app/(dashboard)/dashboard/components/buttons/Save";
import { useNotification } from "@/app/context/NotificationContext";
import NumberInput from "@/app/(dashboard)/dashboard/components/inputs/Number";
import SelectInput from "@/app/(dashboard)/dashboard/components/inputs/Select";
import InlineCode from "@/app/(dashboard)/dashboard/components/ui/InlineCode";
import DeleteButton from "@/app/(dashboard)/dashboard/components/buttons/Delete";
import { addDashboardLog } from "@/app/lib/addDashboardLog";
import { useGuild } from "@/app/context/GuildContext";
import PageLoader from "@/app/(dashboard)/dashboard/components/PageLoader";
import InfoTooltip from "@/app/(dashboard)/dashboard/components/ui/InfoToolTip";
import PremiumLabel from "@/app/(dashboard)/dashboard/components/labels/Premium";

export default function AntiBotPage() {
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [timeWindow, setTimeWindow] = useState(10);
  const [channelLimit, setChannelLimit] = useState(3);
  const [punishment, setPunishment] = useState("");
  const [forbiddenWords, setForbiddenWords] = useState<string[]>([""]);
  const [notificationChannel, setNotificationChannel] = useState("");
  const [jailRole, setJailRole] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const { selectedGuild, roles, channels } = useGuild();
  const { notify } = useNotification();
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.title = "Anti-Bot Settings";
    if (!selectedGuild) return;

    const fetchGuildData = async () => {
      setLoading(true);

      // Check premium status
      try {
        const resPremium = await fetch(`/api/premium?guild_id=${selectedGuild}`);
        const dataPremium = await resPremium.json();
        setIsPremium(dataPremium?.premium ?? false);
        if (!dataPremium?.premium) {
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Failed to fetch premium info:", err);
      }

      // Fetch Anti-Bot settings
      try {
        const res = await fetch(`/api/anti-bot?guild_id=${selectedGuild}`);
        const data = await res.json();

        setEnabled(data?.enabled ?? false);
        setTimeWindow(data?.time_window ?? 10);
        setChannelLimit(data?.channel_limit ?? 3);
        setPunishment(data?.punishment ?? "");
        setForbiddenWords(data?.forbidden_words?.length ? data.forbidden_words : [""]);
        setNotificationChannel(data?.notification_channel ?? "");
        setJailRole(data?.jail_role ?? "");
      } catch (err) {
        console.error("Failed to fetch anti-bot data:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchGuildData();
  }, [selectedGuild]);

  // Auto-save
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
      const res = await fetch("/api/anti-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guild_id: selectedGuild,
          enabled,
          time_window: timeWindow,
          channel_limit: channelLimit,
          punishment,
          forbidden_words: forbiddenWords.filter((w) => w.trim() !== ""),
          notification_channel: notificationChannel,
          jail_role: punishment === "jail" ? jailRole : null,
        }),
      });

      if (!res.ok) {
        if (!auto) notify("Failed to save settings", "", "error");
      } else {
        void addDashboardLog(selectedGuild, "INFO", "Updated Anti-Bot settings");
        if (!auto) notify("Saved!", "", "success");
      }
    } catch (err) {
      if (!auto) notify("Error saving settings", String(err), "error");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!selectedGuild || !isPremium) return;
    triggerAutoSave();
  }, [enabled, timeWindow, channelLimit, punishment, forbiddenWords, notificationChannel, jailRole]);

  // Manage forbidden words
  const addForbiddenWord = () => setForbiddenWords([...forbiddenWords, ""]);
  const updateForbiddenWord = (index: number, value: string) => {
    const updated = [...forbiddenWords];
    updated[index] = value;
    setForbiddenWords(updated);
  };
  const removeForbiddenWord = (index: number) => {
    const updated = [...forbiddenWords];
    updated.splice(index, 1);
    setForbiddenWords(updated);
  };

  if (!isPremium) {
    return (
      <section className="relative bg-[#181b25] p-6 rounded-lg max-w-3xl mx-auto mt-6 text-center text-gray-400">
        <p className="text-lg font-semibold mb-2 text-white">Premium Required</p>
        <p>This feature is only available for premium guilds.</p>
      </section>
    );
  }

  return (
    <section className="relative bg-[#181b25] p-6 rounded-lg max-w-3xl mx-auto mt-6">
      {loading && <PageLoader />}

      <h1 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
        Anti-Bot Settings
        <InfoTooltip text="Work in progress" />
        <PremiumLabel />
      </h1>

      {/* Enable */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-gray-400">Enable anti-bot</span>
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

      <div className="mb-4">
        <SelectInput
          label="Notification channel"
          value={notificationChannel}
          onChange={setNotificationChannel}
          options={[
            { value: "", label: "Select a channel..." },
            ...(channels?.filter(c => c.type === 0).map((c) => ({ value: c.id, label: `${c.name}` })) ?? []),
          ]}
        />
      </div>

      <div className="mb-4">
        <NumberInput
          label="Time window (seconds)"
          value={timeWindow}
          onChange={(val) => setTimeWindow(Number(val))}
          placeholder="Example: 10"
        />
        <p className="text-sm text-gray-500">
          Users cannot send messages in more than{" "}
          <InlineCode text={channelLimit.toString()} /> channels within{" "}
          <InlineCode text={timeWindow.toString()} /> seconds.
        </p>
      </div>

      <div className="mb-4">
        <NumberInput
          label="Channel limit"
          value={channelLimit}
          onChange={(val) => setChannelLimit(Number(val))}
          placeholder="Example: 3"
        />
      </div>

      <div className="mb-4">
        <SelectInput
          label="Punishment"
          value={punishment}
          onChange={setPunishment}
          options={[
            { value: "", label: "Select..." },
            { value: "mute", label: "Mute" },
            { value: "kick", label: "Kick" },
            { value: "ban", label: "Ban" },
            { value: "jail", label: "Jail" },
          ]}
        />
      </div>

      {punishment === "jail" && (
        <div className="mb-4">
          <SelectInput
            label="Jail Role"
            value={jailRole}
            onChange={setJailRole}
            options={[
              { value: "", label: "Select a role..." },
              ...(roles?.map((r) => ({ value: r.id, label: r.name })) ?? []),
            ]}
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">Forbidden Words/Sentences</label>
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto border border-gray-700 p-2 rounded bg-[#1f2330]">
          {forbiddenWords.map((word, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={word}
                onChange={(e) => updateForbiddenWord(index, e.target.value)}
                placeholder="Enter forbidden word or sentence"
                className="flex-1 bg-[#0f1117] border border-gray-700 rounded p-2 text-white"
              />
              {forbiddenWords.length > 1 && (
                <DeleteButton onClick={() => removeForbiddenWord(index)} />
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addForbiddenWord}
          className="mt-2 px-3 py-1 bg-[var(--primary-color)] rounded hover:brightness-90 text-white"
        >
          Add Word/Sentence
        </button>
      </div>

      <div className="text-right text-gray-400 text-sm mt-3">
        {isSaving ? "Saving..." : "Auto saved!"}
      </div>

      <SaveButton onClick={() => void handleSave(false)} />
    </section>
  );
}
