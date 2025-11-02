"use client";

import { useState, useEffect, useRef } from "react";
import SaveButton from "@/app/(dashboard)/dashboard/components/buttons/Save";
import DeleteButton from "@/app/(dashboard)/dashboard/components/buttons/Delete";
import { useNotification } from "@/app/context/NotificationContext";
import { useGuild } from "@/app/context/GuildContext";
import InfoTooltip from "@/app/(dashboard)/dashboard/components/ui/InfoToolTip";
import SelectInput from "@/app/(dashboard)/dashboard/components/inputs/Select";
import PageLoader from "@/app/(dashboard)/dashboard/components/PageLoader";
import { addDashboardLog } from "@/app/lib/addDashboardLog";

type PictureContest = {
  id: string;
  name: string;
  contestChannel: string;
  announceChannel: string;
  voteEmoji: string;
  voteType: "highest" | "fixed";
  requiredVotes: number;
  schedule: "start_month" | "end_month" | "weekly";
  enabled: boolean;
};

export default function PictureContestPage() {
  const [loading, setLoading] = useState(false);
  const [contests, setContests] = useState<PictureContest[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const { selectedGuild, channels } = useGuild();
  const { notify } = useNotification();

  useEffect(() => {
    document.title = "Picture Contest Settings";
    if (!selectedGuild) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/picture-contest?guildId=${selectedGuild}`);
        if (res.ok) {
          const data = await res.json();
          setContests(data?.contests ?? []);
        } else {
          setContests([]);
        }
      } catch (err) {
        console.error("Failed to fetch picture contest data:", err);
        setContests([]);
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, [selectedGuild]);

  const addContest = () => {
    setContests((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "New Contest",
        contestChannel: "",
        announceChannel: "",
        voteEmoji: "👍",
        voteType: "highest",
        requiredVotes: 5,
        schedule: "end_month",
        enabled: true,
      },
    ]);
  };

  const updateContest = (id: string, field: keyof PictureContest, value: any) => {
    setContests((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const removeContest = (id: string) => {
    setContests((prev) => prev.filter((c) => c.id !== id));
  };

  const triggerAutoSave = () => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      void handleSave(true);
    }, 1500);
  };

  useEffect(() => {
    if (!selectedGuild) return;
    triggerAutoSave();
  }, [contests, selectedGuild]);

  const handleSave = async (auto = false) => {
    if (!selectedGuild) return;
    setIsSaving(true);

    try {
      const res = await fetch("/api/picture-contest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guildId: selectedGuild, contests }),
      });

      if (!res.ok) throw new Error(res.statusText);

      void addDashboardLog(selectedGuild, "INFO", "Updated Picture Contest settings");

      if (!auto) notify("Saved!", "", "success");
    } catch (err) {
      if (!auto) notify("Error saving settings", String(err), "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="relative bg-[#181b25] p-6 rounded-lg max-w-3xl mx-auto mt-6">
      {loading && <PageLoader />}

      <h1 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
        Picture Contest Settings
        <InfoTooltip text="Set up automated picture contests and voting" />
      </h1>

      {contests.map((contest, i) => (
        <div key={contest.id} className="mb-6 border border-gray-700 rounded p-4 bg-[#1f2330]">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Contest #{i + 1}</span>
            {contests.length > 1 && (
              <DeleteButton onClick={() => removeContest(contest.id)} />
            )}
          </div>

          {/* Contest Name */}
          <div className="mb-2">
            <label className="block text-gray-400 mb-1">Contest Name</label>
            <input
              type="text"
              value={contest.name}
              onChange={(e) => updateContest(contest.id, "name", e.target.value)}
              placeholder="Enter contest name"
              className="w-full bg-[#0f1117] border border-gray-700 rounded p-2 text-white"
            />
          </div>

          {/* Contest Channel */}
          <div className="mb-2">
            <label className="block text-gray-400 mb-1">Contest Channel</label>
            <SelectInput
              label=""
              value={contest.contestChannel}
              onChange={(v) => updateContest(contest.id, "contestChannel", v)}
              options={channels
                .filter((c) => c.type === 0) // Filter non text channels out
                .sort((a, b) => a.name.localeCompare(b.name)) // Sort from a to Z
                .map((ch) => ({ value: ch.id, label: ch.name }))
              }
            />
          </div>

          {/* Announcement Channel */}
          <div className="mb-2">
            <label className="block text-gray-400 mb-1">Announcement Channel</label>
            <SelectInput
              label=""
              value={contest.announceChannel}
              onChange={(v) => updateContest(contest.id, "announceChannel", v)}
              options={channels
                .filter((c) => c.type === 0) // Filter non text channels out
                .sort((a, b) => a.name.localeCompare(b.name)) // Sort from a to Z
                .map((ch) => ({ value: ch.id, label: ch.name }))
              }
            />
          </div>

          {/* Vote Emoji */}
          <div className="mb-2">
            <label className="block text-gray-400 mb-1">Vote Emoji</label>
            <input
              type="text"
              value={contest.voteEmoji}
              onChange={(e) => updateContest(contest.id, "voteEmoji", e.target.value)}
              placeholder="Example: 👍 or ❤️"
              className="w-full bg-[#0f1117] border border-gray-700 rounded p-2 text-white"
            />
          </div>

          {/* Voting Method */}
          <div className="mb-3">
            <label className="block text-gray-400 mb-1">Voting Method</label>
            <SelectInput
              label=""
              value={contest.voteType}
              onChange={(v) => updateContest(contest.id, "voteType", v)}
              options={[
                { value: "highest", label: "Highest Votes (Winner after period)" },
                { value: "fixed", label: "Fixed Vote Count (Ends when reached)" },
              ]}
            />
          </div>

          {contest.voteType === "fixed" && (
            <div className="mb-2">
              <label className="block text-gray-400 mb-1">Required Votes</label>
              <input
                type="number"
                min={1}
                value={contest.requiredVotes}
                onChange={(e) =>
                  updateContest(contest.id, "requiredVotes", Number(e.target.value))
                }
                className="w-full bg-[#0f1117] border border-gray-700 rounded p-2 text-white"
              />
            </div>
          )}

          {/* Schedule */}
          <div className="mb-3">
            <label className="block text-gray-400 mb-1">Contest Schedule</label>
            <SelectInput
              label=""
              value={contest.schedule}
              onChange={(v) => updateContest(contest.id, "schedule", v)}
              options={[
                { value: "start_month", label: "Start of the month" },
                { value: "end_month", label: "End of the month" },
                { value: "weekly", label: "Weekly" },
              ]}
            />
          </div>

          {/* Enabled Toggle */}
          <div className="flex items-center mt-3">
            <span className="text-gray-400 mr-2">Enabled</span>
            <button
              type="button"
              onClick={() => updateContest(contest.id, "enabled", !contest.enabled)}
              className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-200 focus:outline-none ${
                contest.enabled ? "bg-[var(--primary-color)]" : "bg-gray-700"
              }`}
            >
              <span
                className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${
                  contest.enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      ))}

      {/* Add new contest */}
      {/* @ts-ignore */}
      <button
        onClick={addContest}
        className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg"
      >
        Add Picture Contest
      </button>

      <div className="text-right text-gray-400 text-sm mt-3">
        {isSaving ? "Saving..." : "Auto saved!"}
      </div>

      <SaveButton onClick={() => void handleSave(false)} />
    </section>
  );
}
