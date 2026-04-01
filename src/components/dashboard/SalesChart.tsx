"use client";

import { useId } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { useGetDashboardStatsQuery } from "@/redux/api/dashboardApi";

// ✅ Type (best practice)
type SalesDataType = {
  salesDay: string;
  sales: number;
};

export default function SalesChart() {
  const chartId = useId();

  const { data, isLoading, isError } = useGetDashboardStatsQuery();

  // ✅ Loading
  if (isLoading) {
    return (
      <div className="w-full h-[300px] animate-pulse bg-gray-50 rounded-xl" />
    );
  }

  // ❗ Error handling
  if (isError) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-red-500">
        Failed to load sales data
      </div>
    );
  }

  // ✅ Typed data
  const chartData: SalesDataType[] = data?.salesData || [];

  // ❗ Empty data handling
  if (chartData.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-gray-400">
        No sales data available
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%" id={`${chartId}-resp`}>
        <BarChart data={chartData} id={`${chartId}-bar`}>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />

          <XAxis
            dataKey="salesDay"
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
            cursor={{ fill: "#F3F4F6" }}
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
            }}
          />

          <Bar
            dataKey="sales"
            name="Sales"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
            animationDuration={1200}
          >
            {chartData.map((_, index: number) => (
              <Cell key={`cell-${index}`} />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}