"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br 
                 from-white to-gray-50 shadow-md border border-gray-200 p-6"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm text-gray-500 font-medium">
          {title}
        </h3>
        <div className="text-blue-800">{icon}</div>
      </div>

      <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
        {value}
      </h2>

      <p className="text-sm text-blue-800 mt-2 font-medium">
        {subtitle}
      </p>
    </motion.div>
  );
}