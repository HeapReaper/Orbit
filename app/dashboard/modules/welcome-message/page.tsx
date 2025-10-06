"use client";

import { useState } from "react";
import SaveButton from "@/app/dashboard/components/buttons/Save";
import { useNotification } from "@/app/context/NotificationContext";
import TextInput from "@/app/dashboard/components/inputs/Text";
import SelectInput from "@/app/dashboard/components/inputs/Select";
import InlineCode from "@/app/dashboard/components/ui/InlineCode";

export default function Page() {
  const [enabled, setEnabled] = useState(true);
  const [message, setMessage] = useState("🎉 Welcome to our server, {user}!");
  const [channel, setChannel] = useState("");

  const { notify } = useNotification();

  const handleSave = () => {
    notify("Welcome message settings saved!", "", "success");
  };

  return (
    <section className="bg-[#181b25] p-6 rounded-lg max-w-xl mx-auto mt-6">
      <h1 className="text-2xl font-semibold mb-4 text-white">Welcome message Settings</h1>

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

      <TextInput
        label="Welcome message"
        value={message}
        onChange={setMessage}
        placeholder="Example: 🎉 Welcome to our server, {user}!"
      />
      <p className="text-sm text-gray-500 mb-4">
        You can use <InlineCode text={"{user}"}/> to mention the user in the message.
      </p>

      <SelectInput
        label="Announcement Channel"
        value={channel}
        onChange={setChannel}
        options={[{ value: "", label: "Select..." }]}
      />

      <SaveButton onClick={handleSave} />
    </section>
  );
}
