"use client";

import { useState, useEffect } from "react";
import { ClipboardClock, RefreshCw, Server, Bot } from "lucide-react";
import IconButton from "@/app/(dashboard)/dashboard/components/inputs/IconButton";
import SelectInput from "@/app/(dashboard)/dashboard/components/inputs/Select";
import { useNotification } from "@/app/context/NotificationContext";

export default function BotLogs() {
  const { notify } = useNotification();

  const [logType, setLogType] = useState("bot");
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const fetchedLogs =
        logType === "bot"
          ? [
            "[10:32:15] Bot connected successfully.",
            "[10:32:18] Registered 12 commands.",
            "[10:33:01] User @Admin issued /reload.",
            "[10:35:44] Guild 9421837174 synced settings.",
            "[10:37:02] Slash command /mute executed by @ModSara.",
          ]
          : [
            "[10:31:12] @heapreaper Enabled module Announcements.",
            "[10:32:40] @heapreaper Updated timezone setting to Europe/Amsterdam.",
            "[10:33:10] @Nova disabled module Music.",
            "[10:34:45] @heapreaper changed primary color to #4f46e5.",
            "[10:36:02] @Nova created a new role: Moderator.",
            "[10:37:25] @heapreaper saved Bot Settings.",
          ];
      setLogs(fetchedLogs);
      notify("Logs loaded successfully", "", "success");
    } catch {
      notify("Failed to fetch logs", "", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [logType]);

  return (
    <section className="bg-[#181b25] p-6 rounded-lg space-y-6">
      <div className="flex items-center gap-2 mb-3">
        <ClipboardClock className="w-6 h-6 text-[var(--primary-color)]" />
        <h2 className="text-lg font-semibold">Logs</h2>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <SelectInput
          label="Log Type"
          value={logType}
          onChange={setLogType}
          options={[
            { value: "bot", label: "Bot Logs" },
            { value: "application", label: "Admin Panel Logs" },
          ]}
        />

        <IconButton
          icon={RefreshCw}
          label="Refresh"
          size={20}
          onClick={fetchLogs}
          className="mt-3"
        />
      </div>

      <div className="border-t border-gray-700 pt-4">
        <div className="flex items-center gap-2 mb-3 text-gray-400">
          {logType === "bot" ? (
            <Bot className="w-5 h-5" />
          ) : (
            <Server className="w-5 h-5" />
          )}
          <h3 className="font-semibold">
            {logType === "bot" ? "Bot Logs" : "Admin Panel Logs"}
          </h3>
        </div>

        <div className="bg-[#0f1117] border border-gray-800 rounded-lg p-4 h-[300px] overflow-y-auto font-mono text-sm text-gray-300">
          {loading ? (
            <p className="text-gray-500 italic">Loading logs...</p>
          ) : logs.length > 0 ? (
            logs.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap">
                {line}
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No logs available.</p>
          )}
        </div>
      </div>
    </section>
  );
}
