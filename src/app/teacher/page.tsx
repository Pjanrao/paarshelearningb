"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  ClipboardCheck,
  BarChart3,
  Calendar,
  Clock,
  ArrowRight,
  PlusCircle,
  Play
} from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function TeacherDashboard() {
  const user = useSelector((state: RootState) => state.auth.user || state.auth.studentUser);

  // Static Mock Data
  const stats = [
    {
      title: "Assigned Courses",
      value: "3",
      desc: "MERN, React, UI/UX",
      icon: BookOpen,
      color: "bg-blue-500",
      link: "/teacher/courses",
      action: "View Courses"
    },
    {
      title: "Active Batches",
      value: "5",
      desc: "140+ active students",
      icon: Users,
      color: "bg-green-500",
      link: "/teacher/batches",
      action: "View Batches"
    },
    {
      title: "Lectures Taken",
      value: "84",
      desc: "Total hours: 168h",
      icon: ClipboardCheck,
      color: "bg-orange-500",
      link: "/teacher/take-lecture",
      action: "Take Lecture"
    },
    {
      title: "Syllabus Progress",
      value: "76%",
      desc: "Avg progress across batches",
      icon: BarChart3,
      color: "bg-purple-500",
      link: "/teacher/syllabus-progress",
      action: "Track Syllabus"
    }
  ];

  const recentLectures = [
    {
      id: "lec-1",
      course: "MERN Stack Development",
      batch: "Batch A - Morning",
      topic: "Introduction to Next.js App Router & Layouts",
      date: "Today at 10:00 AM",
      duration: "2 hours",
      homework: "Create an active navigation sidebar with Next.js Link components.",
      recording: "https://zoom.us/rec/play/xyz123"
    },
    {
      id: "lec-2",
      course: "React & Redux Advanced",
      batch: "Batch C - Afternoon",
      topic: "Redux Toolkit State Slices and Hydration",
      date: "Yesterday at 2:30 PM",
      duration: "1.5 hours",
      homework: "Implement product wishlist slice in your ecommerce project.",
      recording: "https://zoom.us/rec/play/abc987"
    },
    {
      id: "lec-3",
      course: "MERN Stack Development",
      batch: "Batch B - Evening",
      topic: "REST APIs with Express and Mongoose Models",
      date: "May 26, 2026",
      duration: "2 hours",
      homework: "Build course and teacher MongoDB schema matching our project structures.",
      recording: "https://zoom.us/rec/play/mern456"
    }
  ];

  const schedule = [
    { time: "09:00 AM - 11:00 AM", batch: "Batch A (MERN Stack)", room: "Online Zoom Room A", status: "Completed" },
    { time: "02:00 PM - 03:30 PM", batch: "Batch C (React & Redux)", room: "Lab 2 - Offline", status: "Upcoming" },
    { time: "06:00 PM - 08:00 PM", batch: "Batch B (MERN Stack)", room: "Online Zoom Room B", status: "Upcoming" }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1e293b] mb-1">
            Welcome Back, {user?.name || "Instructor"}!
          </h1>
          <p className="text-gray-500 text-sm">
            Monitor syllabus progress, assign lectures, and manage your batches.
          </p>
        </div>
        <Link
          href="/teacher/take-lecture"
          className="flex items-center gap-2 bg-[#2C4276] hover:bg-[#1e2e54] text-white px-5 py-2.5 rounded-full shadow-md font-semibold transition active:scale-95 text-sm"
        >
          <PlusCircle size={18} />
          Take a Lecture
        </Link>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5 flex items-start justify-between">
              <div>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">{stat.title}</p>
                <h3 className="text-2xl font-black text-[#1e293b]">{stat.value}</h3>
                <p className="text-xs text-gray-500 mt-1">{stat.desc}</p>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-xl shadow-sm`}>
                <stat.icon size={22} />
              </div>
            </div>
            <Link
              href={stat.link}
              className="bg-gray-50 hover:bg-gray-100 text-xs font-semibold py-2.5 px-5 flex items-center justify-between text-gray-600 transition border-t border-gray-100 group"
            >
              <span>{stat.action}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Main Grid Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Lecture Submissions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden lg:col-span-2">
          <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-[#1e293b] font-bold text-base flex items-center gap-2">
              <ClipboardCheck size={20} className="text-[#2C4276]" />
              Recent Lecture Activity
            </h3>
            <Link href="/teacher/syllabus-progress" className="text-xs text-[#2C4276] hover:underline font-bold">
              View All Progress
            </Link>
          </div>

          <div className="p-4 space-y-4">
            {recentLectures.map((lec) => (
              <div key={lec.id} className="p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/10 transition space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="inline-block bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                      {lec.batch}
                    </span>
                    <h4 className="font-bold text-[#1e293b] text-sm sm:text-base">
                      {lec.topic}
                    </h4>
                    <p className="text-xs text-gray-400 font-medium">{lec.course}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 font-semibold flex items-center justify-end gap-1">
                      <Clock size={12} />
                      {lec.duration}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1">{lec.date}</p>
                  </div>
                </div>

                <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg space-y-1">
                  <p><strong className="text-gray-700">Homework:</strong> {lec.homework}</p>
                  {lec.recording && (
                    <p className="flex items-center gap-1.5 text-blue-600 font-medium mt-1">
                      <Play size={10} className="fill-current" />
                      <a href={lec.recording} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Class Recording Link
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Schedule & Quick Nav */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-gray-50/50 p-4 border-b border-gray-100">
            <h3 className="text-[#1e293b] font-bold text-base flex items-center gap-2">
              <Calendar size={20} className="text-[#2C4276]" />
              Today's Lectures
            </h3>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3.5">
              {schedule.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-gray-50 hover:border-gray-100 hover:bg-gray-50/30 transition">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 font-medium">{item.time}</p>
                    <p className="font-bold text-sm text-[#1e293b]">{item.batch}</p>
                    <p className="text-[10px] text-gray-500">{item.room}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.status === "Completed" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800 animate-pulse"
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-[#2C4276]/5 p-4 rounded-xl border border-[#2C4276]/10 text-center">
              <h4 className="font-bold text-[#2C4276] text-sm mb-1">Track Lecture Progress</h4>
              <p className="text-xs text-gray-500 mb-3">Keep batches updated with syllabus checklists</p>
              <Link
                href="/teacher/take-lecture"
                className="inline-block bg-[#2C4276] hover:bg-[#1e2e54] text-white text-xs font-bold py-2 px-4 rounded-full transition w-full"
              >
                Launch Lecture Tracker
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
