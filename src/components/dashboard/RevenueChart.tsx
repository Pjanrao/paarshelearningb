"use client";

import { useId } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { useGetDashboardStatsQuery } from "@/redux/api/dashboardApi";

// ✅ Type
type RevenueDataType = {
  date: string;
  revenue: number;
};

export default function RevenueChart() {
  const chartId = useId();

  const { data, isLoading, isError } = useGetDashboardStatsQuery();

  // ✅ Loading
  if (isLoading) {
    return (
      <div className="w-full h-[300px] animate-pulse bg-gray-50 rounded-xl" />
    );
  }

  // ❗ Error
  if (isError) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-red-500">
        Failed to load revenue data
      </div>
    );
  }

  const chartData: RevenueDataType[] = data?.revenueData || [];

  // ❗ Empty state
  if (chartData.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-gray-400">
        No revenue data available
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%" id={`${chartId}-resp`}>
        <LineChart data={chartData} id={`${chartId}-line`}>

          {/* ✅ Gradient */}
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
          />

          {/* ✅ Better Tooltip */}
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#fff",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            }}
            formatter={(value: number) => [`₹${value}`, "Revenue"]}
          />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{
              r: 4,
              fill: "#3b82f6", // ✅ FIXED (blue)
              strokeWidth: 2,
              stroke: "#fff",
            }}
            activeDot={{
              r: 6,
              fill: "#3b82f6",
            }}
            animationDuration={1200}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}