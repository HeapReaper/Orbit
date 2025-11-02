"use client";

import { useEffect, useState } from "react";
import MessageFlowChart from "@/app/(dashboard)/dashboard/components/charts/MessageFlowOverTime";
import TopChannelsChart from "@/app/(dashboard)/dashboard/components/charts/MostActiveChannels";
import MostActiveUsersChart from "@/app/(dashboard)/dashboard/components/charts/MostActiveUsers";
import JoinsOverTimeChart from "@/app/(dashboard)/dashboard/components/charts/JoinsOverTime";
import ActiveVsInactiveChart from "@/app/(dashboard)/dashboard/components/charts/ActiveVsInactiveMembers";
import PageLoader from "@/app/(dashboard)/dashboard/components/PageLoader";
import { useGuild } from "@/app/context/GuildContext";
import PremiumLabel from "@/app/(dashboard)/dashboard/components/labels/Premium";
import InfoTooltip from "@/app/(dashboard)/dashboard/components/ui/InfoToolTip";
import TotalMessagesChart from "@/app/(dashboard)/dashboard/components/charts/TotalMessagesOverTime";

const TIME_RANGES = ["last_week", "last_month", "last_year", "last_5_years"] as const;

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<typeof TIME_RANGES[number]>("last_week");
  const [messageFlow, setMessageFlow] = useState<any[]>([]);
  const [totalMessages, setTotalMessages] = useState<any[]>([]);
  const [mostPopulairChannels, setMostPopulairChannels] = useState<any[]>([]);
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const {selectedGuild} = useGuild();
  const [memberCount, setMemberCount] = useState<any[]>([]);
  const [memberChartData, setMemberChartData] = useState<any[]>([]);
  const [activeInactiveMembers, setActiveInactiveMembers] = useState<{ active: number; inactive: number }>({ active: 0, inactive: 0 });

  useEffect(() => {
    document.title = "Analytics";
    setLoading(true);

    if (!selectedGuild) return;

    const fetchData = async () => {
      if (!selectedGuild) return;

      const res = await fetch(`/api/premium?guildId=${selectedGuild}`);
      const dataPremium = await res.json();
      setIsPremium(dataPremium?.premium ?? false);


      const resp = await fetch(`/api/fetch-analytics?guildId=${selectedGuild}&range=${timeRange}`);
      const data = await resp.json();

      const chartData = (data.messageFlowHourly ?? []).map((item: any) => ({
        hour: item.hour_of_day.toString(),
        messages: item.avg_messages,
      }));

      const memberChartData = (data.memberCounts ?? []).map((row: any) => ({
        date: row.period_start,
        count: row.member_count,
        change: row.member_change ?? 0,
      }));

      setMessageFlow(chartData);
      setTotalMessages(data.totalMessages ?? []);
      setMostPopulairChannels(data.topChannels ?? []);
      setMemberCount(data.memberCounts ?? []);
      setMemberChartData(memberChartData);
      setTopUsers(data.topUsers ?? []);
      setActiveInactiveMembers({
        active: data.activeVsInactive?.active || 0,
        inactive: data.activeVsInactive?.inactive || 0,
      });

      setLoading(false);
    };

    void fetchData();
  }, [selectedGuild, timeRange]);

  if (!isPremium) {
    return (
      <section className="relative bg-[#181b25] p-6 rounded-lg max-w-3xl mx-auto mt-6 text-center text-gray-400">
        <p className="text-lg font-semibold mb-2 text-white">Premium Required</p>
        <p>This feature is only available for premium guilds.</p>
      </section>
    );
  }

  return (
    <section className="relative bg-[#181b25] p-6 rounded-lg max-w-3xl mx-auto mt-6">
      {loading && <PageLoader />}

      <h1 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
        Analytics
        <PremiumLabel />
      </h1>

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
            {range.replace("_", " ").replace(/_/g, " ").toUpperCase()}
          </button>
        ))}
      </div>

      {/* Charts */}
      {/*<div className="mb-8">*/}
      {/*  <h3 className="text-xl font-semibold mb-2">Commands Usage</h3>*/}
      {/*  <CommandUsageChart data={commandData} />*/}
      {/*</div>*/}

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-1">Message flow hourly</h3>
        <p className="text-gray-400 mb-3">Shows the average messages send for each our of the day</p>
        <MessageFlowChart data={messageFlow} />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-1">Message flow total</h3>
        <p className="text-gray-400 mb-3">Shows the total messages send for each period over time</p>
        <TotalMessagesChart data={totalMessages} />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-1">Top channels</h3>
        <p className="text-gray-400 mb-3">Shows the top 5 channels where the most messages where send</p>
        <TopChannelsChart data={mostPopulairChannels} />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-1">Most active users</h3>
        <p className="text-gray-400 mb-2">Shows the top 4 users who have send the most messages</p>
        <MostActiveUsersChart data={topUsers} />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-1">Member count over time</h3>
        <p className="text-gray-400 mb-2">Shows how many total members in the server are at a given time</p>
        <JoinsOverTimeChart data={memberChartData} />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-1">Active vs inactive members</h3>
        <p className="text-gray-400 mb-1">Count people inactive if they didnt send a message in the last X time</p>
        <ActiveVsInactiveChart
          active={activeInactiveMembers.active}
          inactive={activeInactiveMembers.inactive}
        />
      </div>
    </section>
  );
}
