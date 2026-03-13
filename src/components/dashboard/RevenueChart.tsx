"use client";

import { useEffect, useState, useId } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { revenueDay: "D1", revenue: 50 },
  { revenueDay: "D5", revenue: 120 },
  { revenueDay: "D10", revenue: 80 },
  { revenueDay: "D15", revenue: 150 },
  { revenueDay: "D20", revenue: 200 },
];

export default function RevenueChart() {
  const [mounted, setMounted] = useState(false);
  const chartId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full h-[300px] animate-pulse bg-gray-50 rounded-xl" />;

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%" id={`${chartId}-resp`}>
        <LineChart data={data} id={`${chartId}-line`}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis
            dataKey="revenueDay"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 6, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 8, strokeWidth: 0 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}