"use client";

import { useEffect, useRef, useState } from "react";
import SaveButton from "@/app/(dashboard)/dashboard/components/buttons/Save";
import { useNotification } from "@/app/context/NotificationContext";
import { useGuild } from "@/app/context/GuildContext";
import PageLoader from "@/app/(dashboard)/dashboard/components/PageLoader";
import InfoTooltip from "@/app/(dashboard)/dashboard/components/ui/InfoToolTip";
import PremiumLabel from "@/app/(dashboard)/dashboard/components/labels/Premium";
import TextInput from "@/app/(dashboard)/dashboard/components/inputs/Text";
import NumberInput from "@/app/(dashboard)/dashboard/components/inputs/Number";
import { addDashboardLog } from "@/app/lib/addDashboardLog";

export default function MinecraftPage() {
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [ip, setIp] = useState("");
  const [port, setPort] = useState(25565);
  const [players, setPlayers] = useState<string[]>([]);
  const [maxPlayers, setMaxPlayers] = useState<number>(0);
  const [serverOnline, setServerOnline] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const { selectedGuild } = useGuild();
  const { notify } = useNotification();
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.title = "Minecraft Module";
    if (!selectedGuild) return;
    const fetchData = async () => {
      setLoading(true);

      const resPremium = await fetch(`/api/premium?guild_id=${selectedGuild}`);
      const dataPremium = await resPremium.json();
      setIsPremium(dataPremium?.premium ?? false);
      if (!dataPremium?.premium) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/minecraft?guild_id=${selectedGuild}`);
        const data = await res.json();
        setEnabled(data?.enabled ?? false);
        setIp(data?.ip ?? "");
        setPort(data?.port ?? 25565);
        setPlayers(data?.players ?? []);
        setMaxPlayers(data?.maxPlayers ?? 0);
        setServerOnline(data?.online ?? false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [selectedGuild]);

  const triggerAutoSave = () => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => void handleSave(true), 1500);
  };

  const handleSave = async (auto = false) => {
    if (!selectedGuild) return;
    setIsSaving(true);

    try {
      const res = await fetch("/api/minecraft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guild_id: selectedGuild,
          enabled,
          ip,
          port,
        }),
      });

      if (!res.ok) {
        if (!auto) notify("Failed to save settings", "", "error");
      } else {
        void addDashboardLog(selectedGuild, "INFO", "Updated Minecraft settings");
        if (!auto) notify("Saved!", "", "success");
      }
    } catch (err) {
      if (!auto) notify("Error saving settings", String(err), "error");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!selectedGuild || !isPremium) return;
    triggerAutoSave();
  }, [enabled, ip, port]);


  const fetchServerStatus = async () => {
    if (!ip) return;
    try {
      const res = await fetch(`/api/minecraft/status?ip=${ip}&port=${port}`);
      const data = await res.json();
      setServerOnline(data.online);
      setPlayers(data.players || []);
      setMaxPlayers(data.maxPlayers || 0);
    } catch {
      setServerOnline(false);
    }
  };

  useEffect(() => {
    if (!enabled || !ip) return;
    void fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 30000);
    return () => clearInterval(interval);
  }, [enabled, ip, port]);

  if (!isPremium) {
    return (
      <section className="relative bg-[#181b25] p-6 rounded-lg max-w-3xl mx-auto mt-6 text-center text-gray-400">
        <p className="text-lg font-semibold mb-2 text-white">Premium Required</p>
        <p>This feature is only available for premium guilds.</p>
      </section>
    );
  }

  return (
    <section className="bg-[#181b25] p-6 rounded-lg max-w-3xl mx-auto mt-6">
      {loading && <PageLoader />}

      <h1 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
        Minecraft Settings
        <InfoTooltip text="Monitor your Minecraft server and show online players." />
        <PremiumLabel />
      </h1>

      <div className="flex items-center justify-between mb-6">
        <span className="text-gray-400">Enable Minecraft module</span>
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

      <div className="mb-4">
        <TextInput
          label="Server IP"
          value={ip}
          onChange={(val) => setIp(val)}
          placeholder="play.example.com"
        />
      </div>
      <div className="mb-4">
        <NumberInput
          label="Port"
          value={port}
          onChange={(val) => setPort(Number(val))}
          placeholder="25565"
        />
      </div>

      {enabled && ip && (
        <div className="mt-6 bg-[#1f2330] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Server status</h2>
            <button
              onClick={fetchServerStatus}
              className="text-sm px-3 py-1 bg-[var(--primary-color)] rounded hover:brightness-90"
            >
              Refresh
            </button>
          </div>

          <p className="text-gray-300 mb-2">
            Status:{" "}
            <span className={serverOnline ? "text-green-400" : "text-red-400"}>
              {serverOnline ? "Online" : "Offline"}
            </span>
          </p>
          {serverOnline && (
            <>
              <p className="text-gray-300 mb-2">
                Players: {players.length}/{maxPlayers}
              </p>
              <div className="bg-[#0f1117] rounded p-2 max-h-40 overflow-y-auto border border-gray-700">
                {players.length > 0 ? (
                  players.map((player) => (
                    <div key={player} className="text-gray-400 py-1">
                      {player}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No players online</p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <div className="text-right text-gray-400 text-sm mt-3">
        {isSaving ? "Saving..." : "Auto saved!"}
      </div>

      <SaveButton onClick={() => void handleSave(false)} />
    </section>
  );
}
