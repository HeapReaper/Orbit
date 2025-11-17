"use client";

import { useGuild } from "@/app/context/GuildContext";
import { useState, useRef, useEffect } from "react";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function ChannelSelect({ label, value, onChange }: Props) {
  const { channels } = useGuild();
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const allChannels = channels
    .filter((c) => c.type === 0 || c.type === 5)
    .map((ch) => ({ value: ch.id, label: ch.name }));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string, label: string) => {
    onChange(val);
    setSearch(label);
    setIsOpen(false);
  };

  useEffect(() => {
    const selected = allChannels.find((channel) => channel.value === value);
    if (selected) setSearch(selected.label);
  }, [value]);

  const sortedChannels = allChannels
    .map((ch) => {
      const nameLower = ch.label.toLowerCase();
      const searchLower = search.toLowerCase();
      const index = nameLower.indexOf(searchLower);
      return { ...ch, matchIndex: index >= 0 ? index : Infinity };
    })
    .sort((a, b) => {
      if (a.matchIndex !== b.matchIndex) return a.matchIndex - b.matchIndex;
      return a.label.localeCompare(b.label);
    });

  return (
    <div className="mb-4 relative" ref={wrapperRef}>
      <label className="block text-gray-400 mb-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Select..."
          className="w-full bg-[#0d0f13] border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] h-10"
        />

        {isOpen && (
          <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-[#0d0f13] border border-gray-700 rounded shadow-lg">
            {sortedChannels.map((channel) => (
              <li
                key={channel.value}
                className={`px-3 py-2 cursor-pointer text-sm hover:bg-gray-700 ${
                  channel.matchIndex === Infinity ? "text-gray-500" : "text-white"
                }`}
                onClick={() => handleSelect(channel.value, channel.label)}
              >
                {channel.label}
              </li>
            ))}
          </ul>
        )}

        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
