"use client";

import { useEffect, useState } from "react";
import { useNotification } from "@/app/context/NotificationContext";
import { useGuild } from "@/app/context/GuildContext";
import CommandUsageChart from "@/app/(dashboard)/dashboard/components/charts/CommandUsageChart";
import MessageFlowChart from "@/app/(dashboard)/dashboard/components/charts/MessageFlowOverTime";
import TopChannelsChart from "@/app/(dashboard)/dashboard/components/charts/MostActiveChannels";
import MostActiveUsersChart from "@/app/(dashboard)/dashboard/components/charts/MostActiveUsers";
import JoinsOverTimeChart from "@/app/(dashboard)/dashboard/components/charts/JoinsOverTime";
import ActiveVsInactiveChart from "@/app/(dashboard)/dashboard/components/charts/ActiveVsInactiveMembers";

import {
  fakeCommandData,
  fakeHourlyData,
  topChannels,
  topUsers,
  joinsData,
  activeMembers,
  inactiveMembers,
} from "@/app/(dashboard)/dashboard/data/analytics";
import PremiumLabel from "@/app/(dashboard)/dashboard/components/labels/Premium";


const TIME_RANGES = ["today", "last_week", "last_month", "last_year"] as const;

export default function BumpReminderPage() {
  const { selectedGuild } = useGuild();
  const { notify } = useNotification();
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [timeRange, setTimeRange] = useState<typeof TIME_RANGES[number]>("today");

  const [commandData, setCommandData] = useState(fakeCommandData);
  const [hourlyData, setHourlyData] = useState(fakeHourlyData);
  const [channelsData, setChannelsData] = useState(topChannels);



  // // Fetch analyics based on time range
  // useEffect(() => {
  //   if (!selectedGuild) return;
  //
  //   const fetchAnalytics = async () => {
  //     try {
  //       const res = await fetch(
  //         `/api/analytics?guild_id=${selectedGuild}&range=${timeRange}`
  //       );
  //       const data = await res.json();
  //
  //       // Replace with your real data from API
  //       setCommandData(data.commandUsage ?? fakeCommandData);
  //       setHourlyData(data.hourlyMessages ?? fakeHourlyData);
  //       setChannelsData(data.topChannels ?? topChannels);
  //     } catch (err) {
  //       console.error(err);
  //       notify("Failed to fetch analytics");
  //     }
  //   };
  //
  //   void fetchAnalytics();
  // }, [selectedGuild, timeRange, notify]);

  return (
    <section className="bg-[#181b25] p-6 rounded-lg max-w-4xl mx-auto mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-white">Analytics</h1>
        <PremiumLabel />
      </div>

      {/* Time Range Switcher */}
      <div className="flex gap-2 mb-6">
        {TIME_RANGES.map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className="px-3 py-1 rounded text-white transition-colors"
            style={{
              backgroundColor: timeRange === range ? "var(--primary-color)" : undefined,
            }}
            onMouseEnter={(e) => {
              if (timeRange !== range) (e.currentTarget.style.backgroundColor = "var(--hover-color)");
            }}
            onMouseLeave={(e) => {
              if (timeRange !== range) e.currentTarget.style.backgroundColor = "";
            }}
          >
            {range.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Commands Usage</h3>
        <CommandUsageChart data={commandData} />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Message Flow Hourly</h3>
        <MessageFlowChart data={hourlyData} />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Top Channels</h3>
        <TopChannelsChart data={channelsData} />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Most Active Users</h3>
        <MostActiveUsersChart data={topUsers} />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Joins Over Time</h3>
        <JoinsOverTimeChart data={joinsData} />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Active vs Inactive Members</h3>
        <ActiveVsInactiveChart active={activeMembers} inactive={inactiveMembers} />
      </div>
    </section>
  );
}
