"use client";

import { useState } from "react";
import SaveButton from "@/app/dashboard/components/buttons/Save"; // jouw bestaande SaveButton
import ToggleSwitch from "@/app/dashboard/components/inputs/Switch";
import { useNotification } from "@/app/context/NotificationContext";

export default function BumpReminderPage() {
  const [enabled, setEnabled] = useState(true);
  const [message, setMessage] = useState("Don't forget to bump the server!");
  const [intervalHours, setIntervalHours] = useState(24);
  const { notify } = useNotification();

  const handleSave = () => {
    console.log("Bump reminder saved:", { enabled, message, intervalHours });
    notify("Settings saved", "", "success")
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

      <div className="mb-4">
        <label className="block text-gray-400 mb-1">Bump Message</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-[#0d0f13] border border-gray-700 rounded px-3 py-2 text-white"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-400 mb-1">Interval (hours)</label>
        <input
          type="number"
          min={1}
          value={intervalHours}
          onChange={(e) => setIntervalHours(Number(e.target.value))}
          className="w-full bg-[#0d0f13] border border-gray-700 rounded px-3 py-2 text-white"
        />
      </div>

      <SaveButton onClick={handleSave} />
    </section>
  );
}
