"use client";

import IconButton from "@/app/dashboard/components/inputs/IconButton";
import { Bot, Save } from "lucide-react";

export default function BotSettings() {
  return (
    <section className="bg-[#181b25] p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Bot className="w-6 h-6 text-[var(--primary-color)]" />

        <h2 className="text-lg font-semibold">Bot settings</h2>
      </div>

      <form className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Nickname</label>
            <input
              type="text"
              value="Aether"
              className="w-full bg-[#0d0f13] border border-gray-700 rounded px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">
              Manager Roles (Owner/Administrator Only)
            </label>
            <select className="w-full bg-[#0d0f13] border border-gray-700 rounded px-3 py-2 text-gray-400">
              <option>Select...</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Updates Channel</label>
            <select className="w-full bg-[#0d0f13] border border-gray-700 rounded px-3 py-2 text-gray-400">
              <option>Select...</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Timezone</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value="Europe/Amsterdam"
                className="flex-1 bg-[#0d0f13] border border-gray-700 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        <IconButton icon={Save} label="Settings" size={24} onClick={() => console.log("Save clicked")} />
      </form>
    </section>
  );
}
