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

interface JoinData {
  date: string;
  joins: number;
}

interface Props {
  data: JoinData[];
}

export default function JoinsOverTimeChart({ data }: Props) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="joins" stroke="var(--primary-color)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}