"use client";

import { motion } from "framer-motion";
import { Users, Calendar, Clock, BookOpen, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function TeacherBatches() {
  const batches = [
    {
      id: "batch-a",
      name: "Batch A - Morning",
      course: "MERN Stack Development",
      studentsCount: 26,
      schedule: "Mon, Wed, Fri",
      time: "09:00 AM - 11:00 AM",
      progress: 88,
      status: "Active",
      nextTopic: "Next.js Authentication Middleware & Route Protection"
    },
    {
      id: "batch-b",
      name: "Batch B - Evening",
      course: "MERN Stack Development",
      studentsCount: 24,
      schedule: "Tue, Thu, Sat",
      time: "06:00 PM - 08:00 PM",
      progress: 74,
      status: "Active",
      nextTopic: "Mongoose Joins & Populate with Course/Category Models"
    },
    {
      id: "batch-c",
      name: "Batch C - Afternoon",
      course: "React & Redux Advanced",
      studentsCount: 28,
      schedule: "Mon, Wed, Fri",
      time: "02:00 PM - 03:30 PM",
      progress: 68,
      status: "Active",
      nextTopic: "Custom Hooks & High-Order Components in React Layouts"
    },
    {
      id: "batch-d",
      name: "Batch D - Weekend Fasttrack",
      course: "MERN Stack Development",
      studentsCount: 28,
      schedule: "Sat, Sun",
      time: "10:00 AM - 01:00 PM",
      progress: 42,
      status: "Active",
      nextTopic: "Express Routing & Form Validation using express-validator"
    },
    {
      id: "batch-e",
      name: "Batch E - Morning Studio",
      course: "UI/UX Design Masterclass",
      studentsCount: 35,
      schedule: "Tue, Thu",
      time: "09:30 AM - 11:30 AM",
      progress: 45,
      status: "Active",
      nextTopic: "Component Libraries, Tokens and Figma Variables Setup"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1e293b] mb-1">
          My Active Batches
        </h1>
        <p className="text-gray-500 text-sm">
          Track schedules, upcoming lecture plans, student capacity, and class progress.
        </p>
      </div>

      {/* Batches Table / Cards */}
      <div className="space-y-4">
        {batches.map((batch) => (
          <motion.div
            key={batch.id}
            whileHover={{ scale: 1.005 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 hover:shadow-md transition flex flex-col lg:flex-row justify-between lg:items-center gap-6"
          >
            {/* Left: Info */}
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {batch.status}
                </span>
                <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                  <BookOpen size={12} />
                  {batch.course}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-[#1e293b] text-lg sm:text-xl">
                  {batch.name}
                </h3>
                <p className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                  <CheckCircle2 size={13} className="text-[#2C4276] flex-shrink-0" />
                  <span className="truncate"><strong>Next Lecture Topic:</strong> {batch.nextTopic}</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-gray-400" />
                  {batch.schedule}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} className="text-gray-400" />
                  {batch.time}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} className="text-gray-400" />
                  {batch.studentsCount} Students Registered
                </span>
              </div>
            </div>

            {/* Right: Progress & Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-4 lg:w-72 flex-shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-50">
              {/* Progress */}
              <div className="space-y-1 w-full">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-gray-500">Syllabus Progress</span>
                  <span className="text-[#2C4276]">{batch.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2C4276] h-full rounded-full transition-all duration-500"
                    style={{ width: `${batch.progress}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 w-full mt-2">
                <Link
                  href="/teacher/take-lecture"
                  className="flex-1 text-center bg-[#2C4276] hover:bg-[#1e2e54] text-white py-2 rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Take Lecture
                </Link>
                <Link
                  href="/teacher/syllabus-progress"
                  className="flex-1 text-center border border-gray-200 hover:border-gray-300 text-gray-700 bg-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                >
                  Syllabus
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
