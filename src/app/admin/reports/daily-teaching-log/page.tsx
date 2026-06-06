"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Users,
  BarChart3,
  Clock,
  Search,
  RotateCw,
  Layers,
  Eye,
  X,
} from "lucide-react";

const tabs = [
  { id: "batch", label: "Batch-wise", icon: BookOpen },
  { id: "course", label: "Course-wise", icon: Layers },
  { id: "teacher", label: "Teacher-wise", icon: Users },
] as const;

export default function AdminDailyTeachingLog() {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]["id"]>("batch");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState("all");

  const [batchReport, setBatchReport] = useState<any[]>([]);
  const [courseReport, setCourseReport] = useState<any[]>([]);
  const [teacherReport, setTeacherReport] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [selectedBatchLogs, setSelectedBatchLogs] = useState<any>(null);
  const [loadingBatchLogs, setLoadingBatchLogs] = useState(false);

  const loadData = async (forceRefresh = false) => {
    if (forceRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await fetch(`/api/admin/reports/daily-teaching-log?t=${Date.now()}`, {
        cache: "no-store",
        credentials: "include",
      });
      const data = await res.json();

      setBatchReport(data.batchWise || []);
      setCourseReport(data.courseWise || []);
      setTeacherReport(data.teacherWise || []);
      setRecentLogs(data.recentLogs || []);
      setSummary(data.summary || {});

      setCourses(
        (Array.from(new Set((data.courseWise || []).map((item: any) => item.courseName))) as string[]).map((name) => ({ id: name, name }))
      );
      setTeachers(
        (Array.from(new Set((data.teacherWise || []).map((item: any) => item.teacherName))) as string[]).map((name) => ({ id: name, name }))
      );

      setLastRefresh(new Date());
    } catch (error) {
      console.error("Failed to load daily teaching log report:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const onFocus = () => loadData(true);
    const interval = window.setInterval(() => loadData(true), 60000);
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const filterItem = (item: any) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesCourse = selectedCourse === "all" || item.course === selectedCourse || item.courseName === selectedCourse;
    const matchesTeacher = selectedTeacher === "all" || item.teacher === selectedTeacher || item.teacherName === selectedTeacher;
    const matchesSearch =
      query === "" ||
      (item.batch && item.batch.toLowerCase().includes(query)) ||
      (item.batchName && item.batchName.toLowerCase().includes(query)) ||
      (item.course && item.course.toLowerCase().includes(query)) ||
      (item.courseName && item.courseName.toLowerCase().includes(query)) ||
      (item.teacher && item.teacher.toLowerCase().includes(query)) ||
      (item.teacherName && item.teacherName.toLowerCase().includes(query)) ||
      (item.latestNote && item.latestNote.toLowerCase().includes(query)) ||
      (item.notes && item.notes.toLowerCase().includes(query));

    return matchesCourse && matchesTeacher && matchesSearch;
  };

  const filteredBatchReport = useMemo(
    () => batchReport.filter(filterItem),
    [batchReport, selectedCourse, selectedTeacher, searchQuery]
  );

  const filteredCourseReport = useMemo(
    () => courseReport.filter(filterItem),
    [courseReport, selectedCourse, selectedTeacher, searchQuery]
  );

  const filteredTeacherReport = useMemo(
    () => teacherReport.filter(filterItem),
    [teacherReport, selectedCourse, selectedTeacher, searchQuery]
  );
  const viewCourseLogs = async (
    courseId: string,
    courseName: string
  ) => {
    setLoadingBatchLogs(true);

    try {
      const res = await fetch(
        `/api/admin/reports/daily-teaching-log/course/${courseId}`
      );

      const data = await res.json();

      setSelectedBatchLogs({
        batchName: courseName,
        logs: data.logs || [],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingBatchLogs(false);
    }
  };

  const viewTeacherLogs = async (
    teacherId: string,
    teacherName: string
  ) => {
    setLoadingBatchLogs(true);

    try {
      const res = await fetch(
        `/api/admin/reports/daily-teaching-log/teacher/${teacherId}`
      );

      const data = await res.json();

      setSelectedBatchLogs({
        batchName: teacherName,
        logs: data.logs || [],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingBatchLogs(false);
    }
  };


  const viewBatchLogs = async (batchId: string, batchName: string) => {
    setLoadingBatchLogs(true);
    try {
      const res = await fetch(`/api/admin/reports/daily-teaching-log/batch/${batchId}`, {
        credentials: "include",
      });
      const data = await res.json();
      setSelectedBatchLogs({
        batchId,
        batchName,
        logs: data.logs || [],
      });
    } catch (error) {
      console.error("Failed to load batch logs:", error);
    } finally {
      setLoadingBatchLogs(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4276]">Reports &raquo; Daily Teaching Log</h1>
          <p className="text-sm text-gray-500 mt-1">Batch-wise, course-wise, and teacher-wise daily teaching log reporting for admins.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[#2C4276] hover:bg-gray-50 disabled:opacity-50"
          >
            <RotateCw size={14} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing" : "Refresh"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs uppercase tracking-wider text-gray-400">Total Logs</p>
          <p className="text-3xl font-black text-[#2C4276] mt-3">{summary?.totalLogs || 0}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs uppercase tracking-wider text-gray-400">Active Batches</p>
          <p className="text-3xl font-black text-[#2C4276] mt-3">{summary?.totalBatches || 0}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs uppercase tracking-wider text-gray-400">Active Courses</p>
          <p className="text-3xl font-black text-[#2C4276] mt-3">{summary?.totalCourses || 0}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs uppercase tracking-wider text-gray-400">Instructors</p>
          <p className="text-3xl font-black text-[#2C4276] mt-3">{summary?.totalTeachers || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex flex-col gap-4 md:flex-row md:items-center md:flex-wrap md:justify-between">
        <div className="relative w-full md:w-80">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search batch, course, teacher, or note..."
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-10 py-2.5 text-sm text-gray-700 focus:border-[#2C4276] focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20"
          />
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">
            <span className="font-bold uppercase tracking-wider text-gray-400">Course:</span>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-transparent outline-none"
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">
            <span className="font-bold uppercase tracking-wider text-gray-400">Instructor:</span>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="bg-transparent outline-none"
            >
              <option value="all">All Instructors</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold transition ${activeTab === tab.id ? "bg-[#2C4276] text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {activeTab === "batch" && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-4">Batch</th>
                  <th className="px-5 py-4">Course</th>
                  <th className="px-5 py-4">Instructor</th>
                  <th className="px-5 py-4 text-center">Logs</th>
                  <th className="px-5 py-4">Last Log</th>
                  <th className="px-5 py-4">Latest Note</th>
                  <th className="px-5 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={7} className="px-5 py-6 text-center text-gray-500">Loading batch report...</td></tr>
                ) : filteredBatchReport.length === 0 ? (
                  <tr><td colSpan={7} className="px-5 py-6 text-center text-gray-500">No batch logs found.</td></tr>
                ) : (
                  filteredBatchReport.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4 font-semibold text-[#1e293b]">{item.batchName}</td>
                      <td className="px-5 py-4 text-sm text-[#2C4276]">{item.courseName}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{item.teacherName}</td>
                      <td className="px-5 py-4 text-center font-bold text-gray-700">{item.totalLogs}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{item.lastLogDate}</td>
                      <td className="px-5 py-4 text-sm text-gray-600 truncate max-w-[240px]" title={item.latestNote}>{item.latestNote || "-"}</td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => viewBatchLogs(item.batchId, item.batchName)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#2C4276] hover:bg-blue-100 transition text-xs font-bold"
                          title="View all logs"
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "course" && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-4">Course</th>
                  <th className="px-5 py-4 text-center">Logs</th>
                  <th className="px-5 py-4 text-center">Batches</th>
                  <th className="px-5 py-4 text-center">Instructors</th>
                  <th className="px-5 py-4">Last Log</th>
                  <th className="px-5 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={5} className="px-5 py-6 text-center text-gray-500">Loading course report...</td></tr>
                ) : filteredCourseReport.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-6 text-center text-gray-500">No course logs found.</td></tr>
                ) : (
                  filteredCourseReport.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4 font-semibold text-[#1e293b]">{item.courseName}</td>
                      <td className="px-5 py-4 text-center font-bold text-gray-700">{item.totalLogs}</td>
                      <td className="px-5 py-4 text-center text-gray-600">{item.batchCount}</td>
                      <td className="px-5 py-4 text-center text-gray-600">{item.teacherCount}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{item.lastLogDate}</td>
                      <td colSpan={6} className="px-5 py-6 text-center text-gray-500">
                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => viewCourseLogs(item.courseId, item.courseName)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#2C4276] hover:bg-blue-100 transition text-xs font-bold"
                          >
                            <Eye size={14} />
                            View
                          </button>
                        </td>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "teacher" && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-4">Instructor</th>
                  <th className="px-5 py-4 text-center">Logs</th>
                  <th className="px-5 py-4 text-center">Batches</th>
                  <th className="px-5 py-4">Last Log</th>
                  <th className="px-5 py-4">Recent Batch</th>
                  <th className="px-5 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={5} className="px-5 py-6 text-center text-gray-500">Loading teacher report...</td></tr>
                ) : filteredTeacherReport.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-6 text-center text-gray-500">No teacher logs found.</td></tr>
                ) : (
                  filteredTeacherReport.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4 font-semibold text-[#1e293b]">{item.teacherName}</td>
                      <td className="px-5 py-4 text-center font-bold text-gray-700">{item.totalLogs}</td>
                      <td className="px-5 py-4 text-center text-gray-600">{item.batchCount}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{item.lastLogDate}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{item.lastBatchName || "-"}</td>
                      <td colSpan={6} className="px-5 py-6 text-center text-gray-500"><td className="px-5 py-4 text-center">
                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => viewTeacherLogs(item.teacherId, item.teacherName)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#2C4276] hover:bg-blue-100 transition text-xs font-bold"
                          >
                            <Eye size={14} />
                            View
                          </button>
                        </td>
                      </td></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gray-50/50 border-b border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-[#1e293b] font-bold text-base flex items-center gap-2">
                <Clock size={18} className="text-[#2C4276]" />
                Recent Daily Logs
              </h3>
              <p className="text-sm text-gray-500 mt-1">Most recent teaching notes recorded by instructors.</p>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-3 max-h-[330px] overflow-y-auto">
          {loading ? (
            <p className="text-sm text-gray-500 text-center">Loading recent logs...</p>
          ) : recentLogs.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-4">No recent daily teaching logs available.</p>
          ) : (
            recentLogs.map((log, idx) => (
              <div key={idx} className="rounded-2xl border border-gray-100 p-4 hover:bg-gray-50 transition">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-[#1e293b]">{log.teacher}</p>
                    <p className="text-xs text-gray-500">{log.batch} • {log.course}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400">{log.logDate}</span>
                </div>
                <p className="mt-3 text-sm text-gray-600 whitespace-pre-line">{log.notes}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedBatchLogs && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-[#2C4276] to-blue-600 text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedBatchLogs.batchName}</h2>
                <p className="text-blue-100 text-sm mt-1">All Daily Teaching Logs</p>
              </div>
              <button
                onClick={() => setSelectedBatchLogs(null)}
                className="p-2 rounded-full hover:bg-white/20 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loadingBatchLogs ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C4276]"></div>
                </div>
              ) : selectedBatchLogs.logs.length === 0 ? (
                <div className="text-center py-12">
                  <Clock size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-semibold">No daily logs found for this batch</p>
                </div>
              ) : (
                selectedBatchLogs.logs.map((log: any, idx: number) => (
                  <div key={idx} className="rounded-2xl border border-gray-200 p-5 hover:shadow-md transition">
                    <div className="flex items-start justify-between gap-4 mb-3 pb-3 border-b border-gray-100">
                      <div>
                        <p className="text-sm font-bold text-[#1e293b]">
                          <Clock size={14} className="inline mr-2 text-[#2C4276]" />
                          {log.logDate}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Logged by <span className="font-semibold">{log.teacher}</span></p>
                      </div>
                      <span className="inline-block text-xs font-bold bg-blue-50 text-[#2C4276] px-3 py-1 rounded-full">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{log.notes}</p>
                  </div>
                ))
              )}
            </div>

            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Total Logs: <span className="font-bold text-[#2C4276]">{selectedBatchLogs.logs.length}</span>
              </p>
              <button
                onClick={() => setSelectedBatchLogs(null)}
                className="px-4 py-2 rounded-lg bg-[#2C4276] text-white font-semibold hover:bg-opacity-90 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
