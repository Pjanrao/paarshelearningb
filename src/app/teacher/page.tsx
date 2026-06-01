"use client";

import { useEffect, useState } from "react";
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
  const [teacherProfile, setTeacherProfile] = useState<any>(null);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [profileRes, batchesRes] = await Promise.all([
        fetch("/api/teacher/profile"),
        fetch("/api/teacher/batches"),
      ]);

      if (!profileRes.ok) {
        const errorData = await profileRes.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to load teacher profile");
      }

      if (!batchesRes.ok) {
        const errorData = await batchesRes.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to load batches");
      }

      const profileData = await profileRes.json();
      const batchesData = await batchesRes.json();

      setTeacherProfile(profileData.teacher || null);
      setBatches(Array.isArray(batchesData.batches) ? batchesData.batches : []);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const assignedCourses = teacherProfile?.assignedCourses?.length
    ? teacherProfile.assignedCourses
    : Array.from(new Set(batches.map((batch) => batch.courseId?.name).filter(Boolean)));

  const totalLectures = batches.reduce((sum, batch) => sum + (batch.lecturesTaken || 0), 0);
  const averageProgress = batches.length
    ? Math.round(batches.reduce((sum, batch) => sum + (batch.progress || 0), 0) / batches.length)
    : 0;

  const stats = [
    {
      title: "Assigned Courses",
      value: assignedCourses.length.toString(),
      desc: assignedCourses.length ? assignedCourses.slice(0, 3).join(", ") : "No assigned courses",
      icon: BookOpen,
      color: "bg-blue-500",
      link: "/teacher/courses",
      action: "View Courses",
    },
    {
      title: "Active Batches",
      value: batches.length.toString(),
      desc: `${batches.length} assigned batch${batches.length === 1 ? "" : "es"}`,
      icon: Users,
      color: "bg-green-500",
      link: "/teacher/batches",
      action: "View Batches",
    },
    {
      title: "Lectures Logged",
      value: totalLectures.toString(),
      desc: "Total tracked lectures",
      icon: ClipboardCheck,
      color: "bg-orange-500",
      link: "/teacher/take-lecture",
      action: "Log Lecture",
    },
    {
      title: "Syllabus Progress",
      value: `${averageProgress}%`,
      desc: batches.length ? "Avg completion across batches" : "No syllabus data yet",
      icon: BarChart3,
      color: "bg-purple-500",
      link: "/teacher/syllabus-progress",
      action: "Track Progress",
    },
  ];

  const recentActivities = batches
    .slice()
    .sort((a, b) => new Date(b.lastLectureAt || 0).getTime() - new Date(a.lastLectureAt || 0).getTime())
    .slice(0, 3)
    .map((batch) => ({
      id: batch._id,
      course: batch.courseId?.name || "Unnamed Course",
      batch: batch.name,
      topic: batch.courseId?.name ? `${batch.courseId.name} progress update` : "Batch update",
      date: batch.lastLectureAt ? new Date(batch.lastLectureAt).toLocaleString() : "No lectures yet",
      duration: `${batch.lecturesTaken || 0} lecture${batch.lecturesTaken === 1 ? "" : "s"}`,
      homework: batch.status ? `Status: ${batch.status}` : "Pending batch updates",
      recording: "",
    }));

  const schedule = batches
    .slice()
    .sort((a, b) => new Date(a.startDate || a.lastLectureAt || 0).getTime() - new Date(b.startDate || b.lastLectureAt || 0).getTime())
    .slice(0, 3)
    .map((batch) => ({
      time: batch.startDate
        ? new Date(batch.startDate).toLocaleString([], { hour: "2-digit", minute: "2-digit" })
        : batch.lastLectureAt
        ? new Date(batch.lastLectureAt).toLocaleString([], { hour: "2-digit", minute: "2-digit" })
        : "TBD",
      batch: `${batch.name} (${batch.courseId?.name || "Course"})`,
      room: batch.status === "Active" ? "Live batch" : batch.status === "Upcoming" ? "Planned session" : "Completed",
      status: batch.status || "Unknown",
    }));

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1e293b] mb-1">
            Welcome Back, {user?.name || teacherProfile?.name || "Instructor"}!
          </h1>
          <p className="text-gray-500 text-sm">
            Monitor syllabus progress, assign lectures, and manage your batches.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {assignedCourses.length > 0
              ? `Assigned courses: ${assignedCourses.join(", ")}`
              : "No courses assigned yet."}
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

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
          {error}
        </div>
      )}

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden lg:col-span-2">
          <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-[#1e293b] font-bold text-base flex items-center gap-2">
              <ClipboardCheck size={20} className="text-[#2C4276]" />
              Recent Batch Activity
            </h3>
            <Link href="/teacher/syllabus-progress" className="text-xs text-[#2C4276] hover:underline font-bold">
              View All Progress
            </Link>
          </div>

          <div className="p-4 space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/10 transition space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="inline-block bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                        {activity.batch}
                      </span>
                      <h4 className="font-bold text-[#1e293b] text-sm sm:text-base">{activity.topic}</h4>
                      <p className="text-xs text-gray-400 font-medium">{activity.course}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 font-semibold flex items-center justify-end gap-1">
                        <Clock size={12} />
                        {activity.duration}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-1">{activity.date}</p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg space-y-1">
                    <p><strong className="text-gray-700">Batch update:</strong> {activity.homework}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent batch activity found. Start by logging a lecture.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-gray-50/50 p-4 border-b border-gray-100">
            <h3 className="text-[#1e293b] font-bold text-base flex items-center gap-2">
              <Calendar size={20} className="text-[#2C4276]" />
              Today's Lectures
            </h3>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3.5">
              {schedule.length > 0 ? (
                schedule.map((item, idx) => (
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
                ))
              ) : (
                <p className="text-sm text-gray-500">No scheduled lectures found for your assigned batches.</p>
              )}
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
