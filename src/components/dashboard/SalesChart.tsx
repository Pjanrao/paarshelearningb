"use client";

import { useEffect, useState, useId } from "react";
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

const data = [
  { salesDay: "D1", sales: 2 },
  { salesDay: "D5", sales: 1 },
  { salesDay: "D10", sales: 3 },
  { salesDay: "D15", sales: 2 },
  { salesDay: "D20", sales: 4 },
];

export default function SalesChart() {
  const [mounted, setMounted] = useState(false);
  const chartId = useId();

  useEffect(() => {
    setMounted(true);
  }, []); 

  if (!mounted) return <div className="w-full h-[300px] animate-pulse bg-gray-50 rounded-xl" />;

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%" id={`${chartId}-resp`}>
        <BarChart data={data} id={`${chartId}-bar`}>
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
            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
          />
          <Bar
            dataKey="sales"
            name="Sales"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-sales-${index}`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}