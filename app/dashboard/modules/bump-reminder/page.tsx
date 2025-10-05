"use client";

import { useState } from "react";
import SaveButton from "@/app/dashboard/components/buttons/Save";
import { useNotification } from "@/app/context/NotificationContext";
import TextInput from "@/app/dashboard/components/inputs/Text";
import NumberInput from "@/app/dashboard/components/inputs/Number";
import SelectInput from "@/app/dashboard/components/inputs/Select";

export default function BumpReminderPage() {
  const [enabled, setEnabled] = useState(true);
  const [message, setMessage] = useState("The server can be bumped again!");
  const [channel, setChannel] = useState("");

  const [intervalHours, setIntervalHours] = useState(2);
  const { notify } = useNotification();
  const handleSave = () => {
    notify("Settings saved!", "", "success")
  };

  return (
    <section className="bg-[#181b25] p-6 rounded-lg max-w-xl mx-auto mt-6">
      <h1 className="text-2xl font-semibold mb-4 text-white">Bump Reminder Settings</h1>

      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400">Enable Bump Reminder</span>
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

      <TextInput
        label="Bump Message"
        value={message}
        onChange={setMessage}
      />

      <NumberInput
        label="Interval (hours)"
        value={intervalHours}
        onChange={setIntervalHours}
        min={1}
        max={24}
      />

      <SelectInput
        label="Bump channel"
        value={channel}
        onChange={setMessage}
        options={[{ value: "", label: "Select..." }]}
      />

      <SaveButton onClick={handleSave} />
    </section>
  );
}
