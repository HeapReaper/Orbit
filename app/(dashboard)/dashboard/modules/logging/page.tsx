"use client";

import { useEffect, useState, useRef } from "react";
import SaveButton from "@/app/(dashboard)/dashboard/components/buttons/Save";
import { useNotification } from "@/app/context/NotificationContext";
import SelectInput from "@/app/(dashboard)/dashboard/components/inputs/Select";
import PageLoader from "@/app/(dashboard)/dashboard/components/PageLoader";
import { useGuild } from "@/app/context/GuildContext";
import { addDashboardLog } from "@/app/lib/addDashboardLog";
import InfoTooltip from "@/app/(dashboard)/dashboard/components/ui/InfoToolTip";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const { selectedGuild, channels } = useGuild();
  const { notify } = useNotification();
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const availableEvents = [
    { id: "message_delete", label: "Message deleted" },
    { id: "message_bulk_delete", label: "Multiple messages deleted" },
    { id: "message_edit", label: "Message edited" },
    { id: "message_pin", label: "Message pinned" },
    { id: "message_unpin", label: "Message unpinned" },
    { id: "message_reaction_add", label: "Reaction added" },
    { id: "message_reaction_remove", label: "Reaction removed" },
    { id: "message_reaction_clear", label: "All reactions cleared" },
    { id: "member_join", label: "Member joined" },
    { id: "member_leave", label: "Member left" },
    { id: "member_kick", label: "Member kicked" },
    { id: "member_ban", label: "Member banned" },
    { id: "member_unban", label: "Member unbanned" },
    { id: "member_update", label: "Member updated (nickname/avatar/etc)" },
    { id: "member_timeout", label: "Member timed out" },
    { id: "member_role_add", label: "Role added to member" },
    { id: "member_role_remove", label: "Role removed from member" },
    { id: "voice_join", label: "Joined voice channel" },
    { id: "voice_leave", label: "Left voice channel" },
    { id: "voice_switch", label: "Switched voice channel" },
    { id: "voice_mute", label: "Server muted" },
    { id: "voice_unmute", label: "Server unmuted" },
    { id: "voice_deafen", label: "Server deafened" },
    { id: "voice_undeafen", label: "Server undeafened" },
    { id: "voice_stream_start", label: "Started streaming" },
    { id: "voice_stream_stop", label: "Stopped streaming" },
    { id: "role_create", label: "Role created" },
    { id: "role_delete", label: "Role deleted" },
    { id: "role_update", label: "Role updated" },
    { id: "channel_create", label: "Channel created" },
    { id: "channel_delete", label: "Channel deleted" },
    { id: "channel_update", label: "Channel updated" },
    { id: "channel_pins_update", label: "Channel pins updated" },
    { id: "thread_create", label: "Thread created" },
    { id: "thread_delete", label: "Thread deleted" },
    { id: "thread_update", label: "Thread updated" },
    { id: "thread_member_join", label: "Joined a thread" },
    { id: "thread_member_leave", label: "Left a thread" },
    { id: "guild_update", label: "Server settings updated" },
    { id: "guild_integrations_update", label: "Integrations updated" },
    { id: "guild_emojis_update", label: "Emojis updated" },
    { id: "guild_stickers_update", label: "Stickers updated" },
    { id: "guild_scheduled_event_create", label: "Scheduled event created" },
    { id: "guild_scheduled_event_delete", label: "Scheduled event deleted" },
    { id: "guild_scheduled_event_update", label: "Scheduled event updated" },
    { id: "bot_command_used", label: "Bot command used" },
    { id: "auto_moderation_trigger", label: "Auto-moderation triggered" },
    { id: "giveaway_started", label: "Giveaway started" },
    { id: "giveaway_ended", label: "Giveaway ended" },
    { id: "birthday_announced", label: "Birthday message sent" },
  ];

  // Filter events op basis van zoekterm
  const filteredEvents = availableEvents.filter((event) =>
    event.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    document.title = "Logging Settings";
    if (!selectedGuild) return;

    const fetchGuildData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/logging?guild_id=${selectedGuild}`);
        const data = await res.json();
        setEnabled(data.enabled ?? false);
        setSelectedChannel(data.channel ?? "");
        setSelectedEvents(data.events ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    void fetchGuildData();
  }, [selectedGuild]);

  const triggerAutoSave = () => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      void handleSave(true);
    }, 1500);
  };

  const handleSave = async (auto = false) => {
    if (!selectedGuild) return;
    setIsSaving(true);

    try {
      const resp = await fetch("/api/logging", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guild_id: selectedGuild,
          enabled,
          channel: selectedChannel,
          events: selectedEvents,
        }),
      });

      if (!resp.ok) {
        notify("Could not save", "", "error");
      }

      void addDashboardLog(selectedGuild, "INFO", "Updated logging settings");

      if (!auto) notify("Saved", "", "success");
    } catch (error) {
      if (!auto) notify("Error", String(error), "error");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!selectedGuild) return;
    triggerAutoSave();
  }, [enabled, selectedChannel, selectedEvents]);

  const toggleEvent = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((e) => e !== eventId)
        : [...prev, eventId]
    );
  };

  return (
    <section className="relative bg-[#181b25] p-6 rounded-lg max-w-3xl mx-auto mt-6">
      {loading && <PageLoader />}

      <h1 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
        Logging Settings
        <InfoTooltip text="Select what server events should be logged." />
      </h1>

      {/* Enable toggle */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400">Enable Logging</span>
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

      {/* Channel selector */}
      <SelectInput
        label="Select channel for Logs"
        value={selectedChannel || ""}
        onChange={(val) => setSelectedChannel(val)}
        options={channels
          .filter((c) => c.type === 0)
          .map((ch) => ({ value: ch.id, label: ch.name }))}
      />

      {/* Events selector */}
      <div className="mt-4">
        <label className="block text-sm text-gray-400 mb-2">
          Select Events to Log
        </label>

        {/* Search field */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events..."
          className="w-full bg-[#0f1117] border border-gray-700 rounded p-2 mb-2 text-gray-200 placeholder-gray-500"
        />

        {/* Scrollable list */}
        <div className="flex flex-col gap-2 bg-[#0f1117] border border-gray-700 rounded p-3 max-h-[300px] overflow-y-auto custom-scrollbar">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <label
                key={event.id}
                className="flex items-center gap-2 text-gray-300 cursor-pointer hover:bg-[#1e212b] px-2 py-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedEvents.includes(event.id)}
                  onChange={() => toggleEvent(event.id)}
                  className="w-4 h-4 accent-[var(--primary-color)]"
                />
                {event.label}
              </label>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center py-2">
              No events found.
            </p>
          )}
        </div>
      </div>

      <div className="text-right text-gray-400 text-sm mt-3">
        {isSaving ? "Saving..." : "Auto saved!"}
      </div>

      <SaveButton onClick={() => handleSave(false)} />
    </section>
  );
}
