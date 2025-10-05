"use client";

import IconButton from "@/app/dashboard/components/inputs/IconButton";
import { Bot, Save } from "lucide-react";
import SelectInput from "@/app/dashboard/components/inputs/Select";
import TextInput from "@/app/dashboard/components/inputs/Text";
import { useNotification } from "@/app/context/NotificationContext";
import { useState } from "react";

export default function BotSettings() {
  const { notify } = useNotification();

  // Bot settings
  const [nickname, setNickname] = useState("Aether");
  const [managerRoles, setManagerRoles] = useState("");
  const [updatesChannel, setUpdatesChannel] = useState("");
  const [timezone, setTimezone] = useState("Europe/Amsterdam");

  // Theme settings
  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [secondaryColor, setSecondaryColor] = useState("#10b981");
  const [fontStyle, setFontStyle] = useState("Default");
  const [darkMode, setDarkMode] = useState(true);

  const handleSave = () => {
    notify("Settings saved!", "", "success");
    // Send settings to API here if needed
  };

  return (
    <section className="bg-[#181b25] p-6 rounded-lg space-y-6">
      <div className="flex items-center gap-2 mb-3">
        <Bot className="w-6 h-6 text-[var(--primary-color)]" />
        <h2 className="text-lg font-semibold">Bot Settings</h2>
      </div>

      <form className="space-y-6">
        {/* Bot General Settings */}
        <div className="grid md:grid-cols-2 gap-4">
          <TextInput label="Nickname" value={nickname} onChange={setNickname} />
          <SelectInput
            label="Manager Roles (Owner/Administrator Only)"
            value={managerRoles}
            onChange={setManagerRoles}
            options={[{ value: "", label: "Select..." }]}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <SelectInput
            label="Updates Channel"
            value={updatesChannel}
            onChange={setUpdatesChannel}
            options={[{ value: "", label: "Select..." }]}
          />
          <TextInput label="Timezone" value={timezone} onChange={setTimezone} />
        </div>

        {/* Theme Settings */}
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
