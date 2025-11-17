"use client";

import { useGuild } from "@/app/context/GuildContext";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function ChannelSelect({ label, value, onChange }: Props) {
  const { channels } = useGuild();

  const filteredChannels = channels
    .filter((c) => c.type === 0 || c.type === 5) // Only use text and announcement channels
    .sort((a, b) => a.name.localeCompare(b.name)) // Sort from a to Z
    .map((ch) => ({ value: ch.id, label: ch.name }))

  return (
    <div className="mb-4 relative">
      <label className="block text-gray-400 mb-1">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#0d0f13] border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] appearance-none h-10 flex items-center"
        >
          <option value="">
            Select...
          </option>
          {filteredChannels.map((channel) => (
            <option key={channel.value} value={channel.value}>
              {channel.label}
            </option>
          ))}
        </select>

        {/* Custom arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
