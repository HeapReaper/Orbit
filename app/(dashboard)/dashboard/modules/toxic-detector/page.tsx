"use client";

import PageLoader from "@/app/(dashboard)/dashboard/components/PageLoader";
import InfoTooltip from "@/app/(dashboard)/dashboard/components/ui/InfoToolTip";
import SelectInput from "@/app/(dashboard)/dashboard/components/inputs/Select";
import SaveButton from "@/app/(dashboard)/dashboard/components/buttons/Save";
import {useEffect, useRef, useState} from "react";
import { useGuild } from "@/app/context/GuildContext";
import {useNotification} from "@/app/context/NotificationContext";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [triggerLevel, setTriggerLevel] = useState<string>("medium");
  const [error, setError] = useState(false);
  const { selectedGuild, channels } = useGuild();
  const [channel, setChannel] = useState<string>("");

  const { notify } = useNotification();
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.title = "Toxic Detector Settings";
    if (!selectedGuild) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/toxic-detector-settings?guildId=${selectedGuild}`);
        const data = await res.json();

        setChannel(data.channel ?? "");
        setTriggerLevel(data.triggerLevel ?? "medium");
        setEnabled(data.enabled != null ? data.enabled : false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [selectedGuild]);

  const triggerAutoSave = () => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      void handleSave(true);
    }, 1500);
  };

  const handleSave = (autoSave: boolean) => {
    //
  }

  useEffect(() => {
    triggerAutoSave();
  }, [enabled, channel, setTriggerLevel]);
  return (
    <section className="relative bg-[#181b25] p-6 rounded-lg max-w-3xl mx-auto mt-6">
      {loading && <PageLoader />}

      <h1 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
        Toxic Detector Settings
        <InfoTooltip
          text="Get notified when we think a conversation is getting toxic. "
        />
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
        label="Notification channel"
        value={channel || ""}
        onChange={setChannel}
        options={channels
          .filter((c) => c.type === 0) // Filter non text channels out
          .sort((a, b) => a.name.localeCompare(b.name)) // Sort from a to Z
          .map((ch) => ({ value: ch.id, label: ch.name }))
        }
      />

      <SelectInput
        label="Trigger level"
        value={triggerLevel || ""}
        onChange={setTriggerLevel}
        options={[
          { label: "Low", value: "low"},
          { label: "Medium", value: "medium"},
          { label: "High", value: "High"},
        ]}
      />

      <div className="text-right text-gray-400 text-sm mt-3">
        {isSaving ? "Saving..." : "Auto saved!"}
      </div>

      <SaveButton onClick={() => handleSave(false)} />
    </section>
  );
}