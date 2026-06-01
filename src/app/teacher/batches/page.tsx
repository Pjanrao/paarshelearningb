"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, Clock, BookOpen, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function TeacherBatches() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/teacher/batches");
        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.error || "Failed to load batches");
        }
        const data = await res.json();
        setBatches(Array.isArray(data.batches) ? data.batches : []);
      } catch (err: any) {
        setError(err.message || "Unable to load assigned batches.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1e293b] mb-1">My Active Batches</h1>
        <p className="text-gray-500 text-sm">Track schedules, upcoming lecture plans, student capacity, and class progress.</p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : batches.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-gray-600">No active batches found. Ask admin to assign you to batches first.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {batches.map((batch) => {
            const courseName = batch.courseId?.name || "Unknown Course";
            const studentsCount = batch.students?.length || 0;
            const schedule = batch.startDate && batch.endDate
              ? `${new Date(batch.startDate).toLocaleDateString()} - ${new Date(batch.endDate).toLocaleDateString()}`
              : batch.status === "Active"
              ? "Currently active"
              : "Schedule not available";
            const time = batch.startDate
              ? new Date(batch.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "TBD";
            const nextTopic = batch.courseId?.syllabus?.[0]?.title || "Syllabus not available";
            const progress = batch.progress || 0;
            const status = batch.status || "Active";

            return (
              <motion.div
                key={batch._id}
                whileHover={{ scale: 1.005 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 hover:shadow-md transition flex flex-col lg:flex-row justify-between lg:items-center gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">{status}</span>
                    <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                      <BookOpen size={12} />
                      {courseName}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-[#1e293b] text-lg sm:text-xl">{batch.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                      <CheckCircle2 size={13} className="text-[#2C4276] shrink-0" />
                      <span className="truncate"><strong>Next Lecture Topic:</strong> {nextTopic}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      {schedule}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} className="text-gray-400" />
                      {time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} className="text-gray-400" />
                      {studentsCount} Students
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-4 lg:w-72 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-50">
                  <div className="space-y-1 w-full">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-500">Syllabus Progress</span>
                      <span className="text-[#2C4276]">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#2C4276] h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <div className="flex gap-3 w-full mt-2">
                    <Link href="/teacher/take-lecture" className="flex-1 text-center bg-[#2C4276] hover:bg-[#1e2e54] text-white py-2 rounded-xl text-xs font-bold transition shadow-sm">
                      Take Lecture
                    </Link>
                    <Link href="/teacher/syllabus-progress" className="flex-1 text-center border border-gray-200 hover:border-gray-300 text-gray-700 bg-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1">
                      Syllabus
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
