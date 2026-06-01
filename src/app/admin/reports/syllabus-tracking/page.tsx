"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, Users, BarChart3, Clock, Calendar, CheckCircle2, Circle, PlayCircle, Search, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSyllabusTracking() {
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [batchSummaries, setBatchSummaries] = useState<any[]>([]);
  const [teacherProductivity, setTeacherProductivity] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/reports/syllabus-tracking");
        const data = await res.json();
        setBatchSummaries(data.batchSummaries || []);
        setTeacherProductivity(data.teacherProductivity || []);
        setRecentActivity(data.recentActivity || []);

       const courseOptions = (
  Array.from(
    new Set(
      (data.batchSummaries || []).map(
        (batch: any) => batch.course as string
      )
    )
  ) as string[]
).map((name) => ({
  id: name,
  name,
}));

const teacherOptions = (
  Array.from(
    new Set(
      (data.batchSummaries || []).map(
        (batch: any) => batch.teacher as string
      )
    )
  ) as string[]
).map((name) => ({
  id: name,
  name,
}));

        setCourses(courseOptions);
        setTeachers(teacherOptions);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredBatches = useMemo(
    () => batchSummaries.filter((batch) => {
      const matchesCourse = selectedCourse === "all" || batch.course === selectedCourse;
      const matchesTeacher = selectedTeacher === "all" || batch.teacher === selectedTeacher;
      const matchesSearch = batch.name.toLowerCase().includes(searchQuery.toLowerCase()) || batch.course.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCourse && matchesTeacher && matchesSearch;
    }),
    [batchSummaries, selectedCourse, selectedTeacher, searchQuery]
  );

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading syllabus tracking data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4276] mb-1">
          Reports &raquo; Syllabus Tracking
        </h1>
        <p className="text-gray-500 text-sm">
          Comprehensive real-time tracking of syllabus progress, teacher performance, and batch activity.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex flex-col md:flex-row flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search batch or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] text-xs font-semibold text-gray-700 transition"
          />
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Course Filter */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">Course:</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full sm:w-auto pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] text-xs font-bold text-gray-700 transition appearance-none cursor-pointer"
            >
              <option value="all">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Teacher Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">Teacher:</label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full sm:w-auto pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] text-xs font-bold text-gray-700 transition appearance-none cursor-pointer"
            >
              <option value="all">All Instructors</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Batches Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBatches.map((batch) => (
          <motion.div
            key={batch.id}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="bg-blue-50 text-[#2C4276] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {batch.course}
                  </span>
                  <h3 className="font-bold text-[#1e293b] text-base sm:text-lg mt-2">
                    {batch.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Instructor: {batch.teacher}</p>
                </div>
                <span className="bg-green-50 text-green-700 border border-green-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {batch.status}
                </span>
              </div>

              {/* Syllabus Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-gray-500">Syllabus Completion</span>
                  <span className="text-[#2C4276] font-bold">{batch.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2C4276] h-full rounded-full transition-all duration-500"
                    style={{ width: `${batch.progress}%` }}
                  />
                </div>
              </div>

              {/* Progress Counters */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-50 text-center">
                <div>
                  <p className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">Completed</p>
                  <p className="font-black text-[#1e293b] text-sm mt-0.5 flex items-center justify-center gap-1">
                    <CheckCircle2 size={12} className="text-green-600" />
                    {batch.completedTopics}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">Pending</p>
                  <p className="font-black text-[#1e293b] text-sm mt-0.5 flex items-center justify-center gap-1">
                    <Circle size={12} className="text-gray-300" />
                    {batch.pendingTopics}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">Lectures</p>
                  <p className="font-black text-[#1e293b] text-sm mt-0.5 flex items-center justify-center gap-1">
                    <PlayCircle size={12} className="text-[#2C4276]" />
                    {batch.lecturesTaken}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-50/50">
              <span className="flex items-center gap-1">
                <Calendar size={12} className="text-gray-400" />
                Started: {batch.startDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-gray-400" />
                Duration: {batch.duration}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Lecture Activity Log */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gray-50/50 p-4 border-b border-gray-100">
            <h3 className="text-[#1e293b] font-bold text-base flex items-center gap-2">
              <Clock size={18} className="text-[#2C4276]" />
              Recent Lecture Activity
            </h3>
          </div>

          <div className="p-4 space-y-4">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex gap-3.5 items-start p-3 rounded-xl border border-gray-50 hover:bg-gray-50/30 transition">
                <div className="bg-blue-50 text-[#2C4276] p-2.5 rounded-xl flex-shrink-0">
                  <UserCheck size={18} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-[#1e293b] text-xs sm:text-sm">
                      {activity.teacher}
                    </h4>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap font-medium">{activity.time}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {activity.action} for <strong className="text-gray-800">{activity.batch}</strong>
                  </p>
                  <span className="inline-block text-[9px] font-bold bg-gray-100 py-0.5 px-2 rounded-full mt-1 text-gray-500">
                    Duration: {activity.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Productivity Rankings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-gray-50/50 p-4 border-b border-gray-100">
            <h3 className="text-[#1e293b] font-bold text-base flex items-center gap-2">
              <BarChart3 size={18} className="text-[#2C4276]" />
              Instructor Performance & Syllabus Completion Rates
            </h3>
          </div>

          <div className="p-4 flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-2">Instructor Name</th>
                  <th className="py-3 px-2 text-center">Active Batches</th>
                  <th className="py-3 px-2 text-center">Hours Taught</th>
                  <th className="py-3 px-2 text-right">Avg Syllabus Comp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {teacherProductivity.map((tp, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition">
                    <td className="py-3.5 px-2 font-semibold text-[#1e293b]">{tp.name}</td>
                    <td className="py-3.5 px-2 text-center font-bold text-gray-600">{tp.activeBatches}</td>
                    <td className="py-3.5 px-2 text-center font-bold text-gray-600">{tp.totalHours}</td>
                    <td className="py-3.5 px-2 text-right font-black text-[#2C4276]">{tp.completedSyllabusRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
