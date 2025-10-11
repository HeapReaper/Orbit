"use client";

import { useState, useEffect } from "react";
import { ClipboardClock, RefreshCw, MessageCircle, LayoutPanelTop } from "lucide-react";
import IconButton from "@/app/(dashboard)/dashboard/components/inputs/IconButton";
import SelectInput from "@/app/(dashboard)/dashboard/components/inputs/Select";
import { useNotification } from "@/app/context/NotificationContext";
import { useGuild } from "@/app/context/GuildContext";

export default function BotLogs() {
  const { notify } = useNotification();

  const [logType, setLogType] = useState<"guild" | "dashboard">("guild");
  const [timeRange, setTimeRange] = useState<"1w" | "1m">("1w");
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { selectedGuild, guilds } = useGuild();
  const [isPremium, setIsPremium] = useState(false);

  const fetchLogs = async () => {
    if (!selectedGuild) return;
    // @ts-ignore
    setIsPremium(guilds.filter(g => g.id === selectedGuild)[0].isPremium)

    setLoading(true);

    try {
      const resp = await fetch(`/api/logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guild_id: selectedGuild,
          type: logType,
          time_range: timeRange,
        }),
      });

      const data = await resp.json();

      if (data.error) {
        notify(data.error, "", "error");
        return;
      }

      setLogs(data);
      notify("Logs loaded successfully", "", "success");
    } catch (err) {
      console.error(err);
      notify("Failed to fetch logs", "", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedGuild) return;
    void fetchLogs();
  }, [selectedGuild, logType, timeRange]);

  return (
    <section className="relative bg-[#181b25] p-6 rounded-lg max-w-2xl mx-auto mt-6">
      <div className="flex items-center gap-2 mb-3">
        <ClipboardClock className="w-6 h-6 text-[var(--primary-color)]" />
        <h2 className="text-lg font-semibold">Logs</h2>
      </div>

      <div className="flex flex-wrap gap-4 items-center">

        <div className="flex flex-wrap gap-4 items-center mb-4">
          <SelectInput
            label="Log Type"
            value={logType}
            onChange={(v) => setLogType(v as "guild" | "dashboard")}
            options={[
              { value: "guild", label: "Guild Logs" },
              { value: "dashboard", label: "Dashboard Logs" },
            ]}
          />

          <SelectInput
            label="Time Range"
            value={timeRange}
            onChange={(v) => setTimeRange(v as "1w" | "1m")}
            options={[
              { value: "1w", label: "1 Week" },
              ...(isPremium ? [{ value: "1m", label: "1 Month" }] : []),
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
      </div>

      <div className="border-t border-gray-700 pt-4">
        <div className="flex items-center gap-2 mb-3 text-gray-400">
          {logType === "guild" ? (
            <MessageCircle className="w-5 h-5" />
          ) : (
            <LayoutPanelTop className="w-5 h-5" />
          )}
          <h3 className="font-semibold">
            {logType === "guild" ? "Guild Logs" : "Dashboard Logs"}
          </h3>
        </div>

        <div className="bg-[#0f1117] border border-gray-800 rounded-lg p-4 h-[300px] overflow-y-auto font-mono text-sm text-gray-300">
        {loading ? (
            <p className="text-gray-500 italic">Loading logs...</p>
          ) : logs.length > 0 ? (
            logs.map((log, i: number) => (
              <div key={log.id} className="whitespace-pre-wrap">
                {new Date(log.timestamp).toLocaleString()} {" "}
                <span
                  className={
                    log.type === "ERROR"
                      ? "text-red-500"
                      : log.type === "INFO"
                        ? "text-green-500"
                        : log.type === "WARN"
                          ? "text-orange-500"
                          : "text-gray-500"
                  }
                >
                  [{log.type}]
                </span>{" "}
                {log.message}
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
