"use client";

import { useEffect, useState } from "react";
// import { useNotification } from "@/app/context/NotificationContext";
// import { useGuild } from "@/app/context/GuildContext";
import CommandUsageChart from "@/app/(dashboard)/dashboard/components/charts/CommandUsageChart";
import MessageFlowChart from "@/app/(dashboard)/dashboard/components/charts/MessageFlowOverTime";
import TopChannelsChart from "@/app/(dashboard)/dashboard/components/charts/MostActiveChannels";
import MostActiveUsersChart from "@/app/(dashboard)/dashboard/components/charts/MostActiveUsers";
import JoinsOverTimeChart from "@/app/(dashboard)/dashboard/components/charts/JoinsOverTime";
import ActiveVsInactiveChart from "@/app/(dashboard)/dashboard/components/charts/ActiveVsInactiveMembers";
import PageLoader from "@/app/(dashboard)/dashboard/components/PageLoader";
import {addDashboardLog} from "@/app/lib/addDashboardLog";

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

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<typeof TIME_RANGES[number]>("today");

  const [commandData] = useState(fakeCommandData);
  const [hourlyData] = useState(fakeHourlyData);
  const [channelsData] = useState(topChannels);

  useEffect(() => {
    document.title = "Analytics";
  }, []);

  return (
    <section className="relative bg-[#181b25] p-6 rounded-lg max-w-4xl mx-auto mt-6">
      {loading && <PageLoader />}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-white">Analytics</h1>
        <PremiumLabel />
      </div>

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
