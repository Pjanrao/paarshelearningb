"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Users, CheckCircle2, Circle, PlayCircle, ChevronDown, ChevronUp, Clock, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TeacherSyllabusProgress() {
  const batches = [
    { id: "batch-a", name: "Batch A - Morning", course: "MERN Stack Development", progress: 88 },
    { id: "batch-b", name: "Batch B - Evening", course: "MERN Stack Development", progress: 74 },
    { id: "batch-c", name: "Batch C - Afternoon", course: "React & Redux Advanced", progress: 68 },
    { id: "batch-d", name: "Batch D - Weekend Fasttrack", course: "MERN Stack Development", progress: 42 },
    { id: "batch-e", name: "Batch E - Morning Studio", course: "UI/UX Design Masterclass", progress: 45 }
  ];

  const syllabusDetails: Record<string, Array<{
    moduleName: string;
    topics: Array<{ title: string; status: "Completed" | "In-Progress" | "Pending"; lastUpdated?: string; duration?: string }>;
  }>> = {
    "batch-a": [
      {
        moduleName: "Module 1: Next.js Fundamentals",
        topics: [
          { title: "Next.js App Router Structure & Layouts", status: "Completed", lastUpdated: "Today", duration: "2h" },
          { title: "Client vs Server Components", status: "Completed", lastUpdated: "Yesterday", duration: "2h" },
          { title: "Data Fetching & Server Actions", status: "Completed", lastUpdated: "May 25, 2026", duration: "2h" }
        ]
      },
      {
        moduleName: "Module 2: Route Protection & Middleware",
        topics: [
          { title: "Authentication Context & JWT Verification", status: "Completed", lastUpdated: "May 22, 2026", duration: "2h" },
          { title: "Next.js Middleware & Role Guards", status: "Completed", lastUpdated: "May 20, 2026", duration: "2h" },
          { title: "Local Storage & Session Synchronization", status: "In-Progress", lastUpdated: "Active", duration: "1h done" }
        ]
      },
      {
        moduleName: "Module 3: Project Deployment & Production",
        topics: [
          { title: "Environment Variables & Next Config", status: "Pending" },
          { title: "Vercel Deployments & Server-Side Hydration", status: "Pending" }
        ]
      }
    ],
    "batch-b": [
      {
        moduleName: "Module 1: Node.js & Express Basics",
        topics: [
          { title: "Node.js Core Modules & Event Loop", status: "Completed", lastUpdated: "May 24, 2026", duration: "2h" },
          { title: "Express Router & Middleware Pipelines", status: "Completed", lastUpdated: "May 22, 2026", duration: "2h" }
        ]
      },
      {
        moduleName: "Module 2: Mongoose Schemas & Controllers",
        topics: [
          { title: "Mongoose Connections & Schema Validations", status: "Completed", lastUpdated: "Yesterday", duration: "2h" },
          { title: "Mongoose Populate & DB Relationships", status: "In-Progress", lastUpdated: "Active", duration: "1.5h done" }
        ]
      },
      {
        moduleName: "Module 3: REST API Integrations",
        topics: [
          { title: "CORS Setup & Axios HTTP Requests", status: "Pending" },
          { title: "Error Handling Middleware", status: "Pending" }
        ]
      }
    ],
    "batch-c": [
      {
        moduleName: "Module 1: Redux Fundamentals",
        topics: [
          { title: "Redux Actions, Reducers & Store", status: "Completed", lastUpdated: "May 24, 2026", duration: "2.5h" },
          { title: "Redux Toolkit createSlice API", status: "Completed", lastUpdated: "May 22, 2026", duration: "2h" }
        ]
      },
      {
        moduleName: "Module 2: Advanced RTK Query",
        topics: [
          { title: "RTK Query API Slices & Fetching Helpers", status: "Completed", lastUpdated: "Yesterday", duration: "2h" },
          { title: "Query Mutations & Cache Invalidation", status: "In-Progress", lastUpdated: "Active", duration: "1.5h done" }
        ]
      },
      {
        moduleName: "Module 3: State Hydration",
        topics: [
          { title: "Next.js Redux Wrapper & SSR State Sync", status: "Pending" }
        ]
      }
    ]
  };

  const [selectedBatchId, setSelectedBatchId] = useState("batch-a");
  const [openModules, setOpenModules] = useState<Record<number, boolean>>({ 0: true, 1: true });

  const activeBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];
  const syllabus = syllabusDetails[selectedBatchId] || syllabusDetails["batch-a"];

  const toggleModule = (index: number) => {
    setOpenModules((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1e293b] mb-1">
            Syllabus Progress Tracker
          </h1>
          <p className="text-gray-500 text-sm">
            Interactive syllabus checksheets. View completed, current, and pending topics per batch.
          </p>
        </div>

        {/* Batch Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">Active Batch:</label>
          <div className="relative">
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] text-xs font-bold text-gray-700 transition appearance-none shadow-sm cursor-pointer"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <Users size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Batch Overview Header Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-[#2C4276]" />
            <span className="text-sm font-semibold text-gray-500">{activeBatch.course}</span>
          </div>
          <h2 className="font-bold text-xl sm:text-2xl text-[#1e293b]">{activeBatch.name}</h2>
        </div>

        {/* Big Progress bar */}
        <div className="md:w-96 flex flex-col justify-center border-t md:border-t-0 pt-4 md:pt-0 border-gray-50">
          <div className="flex justify-between items-center text-sm font-bold mb-2">
            <span className="text-gray-500">Syllabus Completion</span>
            <span className="text-[#2C4276] text-lg font-black">{activeBatch.progress}%</span>
          </div>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden shadow-inner">
            <div
              className="bg-[#2C4276] h-full rounded-full transition-all duration-500"
              style={{ width: `${activeBatch.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Syllabus Modules Accordion */}
      <div className="space-y-4">
        {syllabus.map((mod, modIdx) => {
          const isOpen = !!openModules[modIdx];
          return (
            <div key={modIdx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Accordion Trigger */}
              <button
                onClick={() => toggleModule(modIdx)}
                className="w-full p-5 flex items-center justify-between bg-gray-50/50 hover:bg-gray-50 transition border-b border-gray-100 text-left"
              >
                <span className="font-bold text-base text-[#1e293b]">{mod.moduleName}</span>
                {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
              </button>

              {/* Accordion Content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 divide-y divide-gray-50">
                      {mod.topics.map((topic, topicIdx) => (
                        <div key={topicIdx} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            {/* Checkmark Indicator */}
                            {topic.status === "Completed" ? (
                              <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
                            ) : topic.status === "In-Progress" ? (
                              <PlayCircle className="text-[#2C4276] flex-shrink-0 animate-pulse" size={20} />
                            ) : (
                              <Circle className="text-gray-300 flex-shrink-0" size={20} />
                            )}
                            <div>
                              <p className={`font-semibold text-sm sm:text-base ${topic.status === "Completed"
                                  ? "text-gray-500 line-through"
                                  : "text-gray-800"
                                }`}>
                                {topic.title}
                              </p>
                              {topic.lastUpdated && (
                                <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                                  Last tracked: {topic.lastUpdated}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Stats Badge */}
                          <div className="flex items-center gap-2">
                            {topic.duration && (
                              <span className="text-[10px] text-gray-500 font-bold bg-gray-100 py-1 px-2.5 rounded-full flex items-center gap-1">
                                <Clock size={10} />
                                {topic.duration}
                              </span>
                            )}
                            <span className={`text-[10px] font-bold py-1 px-2.5 rounded-full uppercase tracking-wider ${topic.status === "Completed"
                                ? "bg-green-50 text-green-700 border border-green-100"
                                : topic.status === "In-Progress"
                                  ? "bg-blue-50 text-blue-700 border border-blue-100"
                                  : "bg-gray-100 text-gray-600 border border-gray-200"
                              }`}>
                              {topic.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Instructions Tip */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-2.5 text-xs text-[#2C4276] font-medium leading-relaxed max-w-3xl">
        <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-blue-600" />
        <p>
          Need to mark a pending topic as completed or in progress? Go to the <Link href="/teacher/take-lecture" className="underline font-bold">Take Lecture</Link> tab, submit your class report, and the progress checklist will automatically adapt.
        </p>
      </div>
    </div>
  );
}
