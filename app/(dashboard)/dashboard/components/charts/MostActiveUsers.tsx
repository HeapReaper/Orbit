"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UserData {
  user: string;
  messages: number;
}

interface Props {
  data: UserData[];
}

export default function MostActiveUsersChart({ data }: Props) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="user" type="category" />
          <Tooltip />
          <Bar dataKey="messages" fill="var(--primary-color)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
