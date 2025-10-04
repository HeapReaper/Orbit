"use client";

import SaveButton from "../buttons/Save";

export default function BotSettings() {
  return (
    <section className="bg-[#181b25] p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Bot Settings</h2>

      <form className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Nickname</label>
            <input
              type="text"
              value="Dyno"
              className="w-full bg-[#0d0f13] border border-gray-700 rounded px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Command Prefix</label>
            <input
              type="text"
              value="?"
              className="w-full bg-[#0d0f13] border border-gray-700 rounded px-3 py-2 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">
            Manager Roles (Owner/Administrator Only)
          </label>
          <select className="w-full bg-[#0d0f13] border border-gray-700 rounded px-3 py-2 text-gray-400">
            <option>Select...</option>
          </select>
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

        <SaveButton />
      </form>
    </section>
  );
}
