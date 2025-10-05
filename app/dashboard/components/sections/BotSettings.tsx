"use client";

import IconButton from "@/app/dashboard/components/inputs/IconButton";
import { Bot, Save } from "lucide-react";
import SelectInput from "@/app/dashboard/components/inputs/Select";
import TextInput from "@/app/dashboard/components/inputs/Text";
import { useNotification } from "@/app/context/NotificationContext";

export default function BotSettings() {
  const { notify } = useNotification();

  const handleSave = () => {
    notify("Settings saved!", "", "success")
  }

  return (
    <section className="bg-[#181b25] p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Bot className="w-6 h-6 text-[var(--primary-color)]" />

        <h2 className="text-lg font-semibold">Bot settings</h2>
      </div>

      <form className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <TextInput
            label="Nickname"
            value="HeapReaper"
            onChange={() => ""}
          />

          <SelectInput
            label="Manager Roles (Owner/Administrator Only)"
            value={""}
            onChange={() => console.log("Change Channel")}
            options={[
              { value: "", label: "Select..." },
            ]}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <SelectInput
            label="Updates Channel"
            value={""}
            onChange={() => console.log("Change Channel")}
            options={[
              { value: "", label: "Select..." },
            ]}
          />

          <TextInput
            label="Timezone"
            value="Europe/Amsterdam"
            onChange={() => ""}
          />
        </div>

        <IconButton icon={Save} label="Settings" size={24} onClick={() => handleSave()} />
      </form>
    </section>
  );
}
