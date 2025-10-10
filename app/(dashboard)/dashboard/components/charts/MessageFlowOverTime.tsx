"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HourlyData {
  hour: string;
  messages: number;
}

interface MessageFlowChartProps {
  data: HourlyData[];
}

export default function MessageFlowChart({ data }: MessageFlowChartProps) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="messages" stroke="var(--primary-color)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
