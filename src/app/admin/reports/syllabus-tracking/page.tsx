"use client";

import React, { useEffect, useMemo, useState } from "react";
import { BookOpen, Users, BarChart3, Clock, Calendar, CheckCircle2, Circle, PlayCircle, Search, UserCheck, RotateCw, ChevronDown, ChevronUp, Layers, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSyllabusTracking() {
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [batchSummaries, setBatchSummaries] = useState<any[]>([]);
  const [teacherProductivity, setTeacherProductivity] = useState<any[]>([]);
  const [courseSummaries, setCourseSummaries] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState("batches");
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);
  const [expandedTeacher, setExpandedTeacher] = useState<string | null>(null);

  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const loadData = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    if (isRefresh) setRefreshing(true);

    try {
      const res = await fetch(`/api/admin/reports/syllabus-tracking/?t=${Date.now()}`, { cache: "no-store", credentials: "include" });
      const data = await res.json();
      setBatchSummaries(data.batchSummaries || []);
      setTeacherProductivity(data.teacherProductivity || []);
      setCourseSummaries(data.courseSummaries || []);
      setRecentActivity(data.recentActivity || []);
      setSummary(data.summary || {});

      const courseOptions = (
        Array.from(
          new Set(
            (data.batchSummaries || []).map((batch: any) => batch.course as string)
          )
        ) as string[]
      ).map((name) => ({ id: name, name }));

      const teacherOptions = (
        Array.from(
          new Set(
            (data.batchSummaries || []).map((batch: any) => batch.teacher as string)
          )
        ) as string[]
      ).map((name) => ({ id: name, name }));

      setCourses(courseOptions);
      setTeachers(teacherOptions);
      setLastRefresh(new Date());

      if (isRefresh) {
        console.log("Data refreshed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadData(true);
    }, 60000);

    const handleFocus = () => {
      loadData(true);
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const filteredBatches = useMemo(
    () => batchSummaries.filter((batch) => {
      const matchesCourse = selectedCourse === "all" || batch.course === selectedCourse;
      const matchesTeacher = selectedTeacher === "all" || batch.teacher === selectedTeacher;
      const matchesSearch =
        batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.teacher.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCourse && matchesTeacher && matchesSearch;
    }),
    [batchSummaries, selectedCourse, selectedTeacher, searchQuery]
  );

  const toggleBatchDetails = (batchId: string) => {
    if (expandedBatch === batchId) {
      setExpandedBatch(null);
    } else {
      setExpandedBatch(batchId);
    }
  };

  const toggleTeacherDetails = (teacherId: string) => {
    if (expandedTeacher === teacherId) {
      setExpandedTeacher(null);
    } else {
      setExpandedTeacher(teacherId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4276] mb-1">
            Reports &raquo; Syllabus Tracking
          </h1>
          <p className="text-gray-500 text-sm">
            Comprehensive real-time tracking of syllabus progress, teacher performance, and batch activity.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 mb-1">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2C4276]/10 text-[#2C4276] hover:bg-[#2C4276]/20 disabled:opacity-50 transition text-xs font-bold"
          >
            <RotateCw size={12} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Batches</p>
                <p className="text-3xl font-black text-[#2C4276] mt-2">{summary.totalBatches || 0}</p>
              </div>
              <BookOpen size={32} className="text-[#2C4276]/20" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Active Instructors</p>
                <p className="text-3xl font-black text-[#2C4276] mt-2">{summary.totalTeachers || 0}</p>
              </div>
              <Users size={32} className="text-[#2C4276]/20" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Avg Completion</p>
                <p className="text-3xl font-black text-green-600 mt-2">{summary.averageCompletion || 0}%</p>
              </div>
              <CheckCircle2 size={32} className="text-green-600/20" />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 space-x-8">
        <button
          onClick={() => setActiveTab("batches")}
          className={`pb-4 flex items-center gap-2 text-sm font-bold border-b-2 transition ${activeTab === "batches" ? "border-[#2C4276] text-[#2C4276]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
        >
          <List size={16} /> Batch-wise Report
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`pb-4 flex items-center gap-2 text-sm font-bold border-b-2 transition ${activeTab === "courses" ? "border-[#2C4276] text-[#2C4276]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
        >
          <BookOpen size={16} /> Course-wise Report
        </button>
        <button
          onClick={() => setActiveTab("teachers")}
          className={`pb-4 flex items-center gap-2 text-sm font-bold border-b-2 transition ${activeTab === "teachers" ? "border-[#2C4276] text-[#2C4276]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
        >
          <Users size={16} /> Teacher-wise Report
        </button>
      </div>

      {activeTab === "batches" && (
        <div className="space-y-4">
          {/* Filter Toolbar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex flex-col md:flex-row flex-wrap items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search batch, course, or instructor..."
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
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">Instructor:</label>
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

          {/* Batch-wise Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-4 px-6">Batch Name</th>
                    <th className="py-4 px-6">Course</th>
                    <th className="py-4 px-6">Instructor</th>
                    <th className="py-4 px-6 text-center">Topics Done</th>
                    <th className="py-4 px-6">Progress</th>
                    <th className="py-4 px-6 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredBatches.length === 0 ? (
                    <tr><td colSpan={6} className="py-8 text-center text-gray-400 font-semibold">No batches found matching criteria.</td></tr>
                  ) : (
                    filteredBatches.map((batch) => (
                      <React.Fragment key={batch.id}>
                        <tr className="hover:bg-gray-50/50 transition">
                          <td className="py-4 px-6 font-bold text-[#1e293b]">{batch.name}</td>
                          <td className="py-4 px-6 text-[#2C4276] text-xs font-bold">{batch.course}</td>
                          <td className="py-4 px-6 text-gray-600 text-xs font-medium flex items-center gap-2">
                            <UserCheck size={14} className="text-gray-400" /> {batch.teacher}
                          </td>
                          <td className="py-4 px-6 text-center font-bold text-gray-600">{batch.completedTopics} / {batch.totalTopics}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden w-20">
                                <div className="bg-[#2C4276] h-full rounded-full transition-all duration-500" style={{ width: `${batch.progress}%` }} />
                              </div>
                              <span className="text-xs font-black text-[#2C4276] w-8">{batch.progress}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button onClick={() => toggleBatchDetails(batch.id)} className="p-1.5 bg-gray-50 text-gray-400 hover:text-[#2C4276] hover:bg-blue-50 rounded-lg transition border border-gray-100">
                              {expandedBatch === batch.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                          </td>
                        </tr>
                        <AnimatePresence>
                          {expandedBatch === batch.id && (
                            <motion.tr
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <td colSpan={6} className="bg-[#f8faff] p-0 border-b border-blue-100">
                                <div className="px-8 py-6">
                                  <h4 className="text-xs font-bold text-[#2C4276] uppercase tracking-wider mb-4 border-b border-blue-100 pb-2 flex items-center gap-2">
                                    <List size={14} /> Completed Topics Log
                                  </h4>
                                  {batch.topicDetails && batch.topicDetails.filter((t: any) => t.completed || (t.completedSubtopics && t.completedSubtopics.length > 0)).length > 0 ? (
                                    <div className="space-y-4">
                                      {batch.topicDetails
                                        .filter((t: any) => t.completed || (t.completedSubtopics && t.completedSubtopics.length > 0))
                                        .map((topic: any, idx: number) => (
                                          <div key={idx} className="flex gap-3 bg-white p-4 rounded-xl border border-blue-50 shadow-sm">
                                            <CheckCircle2 size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                              <p className="text-sm font-bold text-gray-800">{topic.topicTitle}</p>
                                              {topic.subtopicTitles && topic.subtopicTitles.length > 0 && (
                                                <div className="mt-2 pl-2 border-l-2 border-green-100 space-y-1.5">
                                                  {topic.subtopicTitles.map((sub: string, sIdx: number) => (
                                                    <p key={sIdx} className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                                                      <CheckCircle2 size={10} className="text-green-400" />
                                                      {sub}
                                                    </p>
                                                  ))}
                                                </div>
                                              )}
                                              <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wider flex items-center gap-1">
                                                <Clock size={10} /> {new Date(topic.updatedAt).toLocaleString()}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                    </div>
                                  ) : (
                                    <div className="bg-white p-6 rounded-xl border border-blue-50 text-center">
                                      <BookOpen size={24} className="text-gray-300 mx-auto mb-2" />
                                      <p className="text-sm text-gray-400 font-semibold">No topics have been logged as completed for this batch yet.</p>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "courses" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-[#1e293b] font-bold text-base flex items-center gap-2">
              <BookOpen size={18} className="text-[#2C4276]" />
              Course-wise Progress Summary
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-6">Course Name</th>
                  <th className="py-4 px-6 text-center">Total Batches</th>
                  <th className="py-4 px-6 text-center">Active Instructors</th>
                  <th className="py-4 px-6">Average Completion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {courseSummaries.length === 0 ? (
                  <tr><td colSpan={4} className="py-8 text-center text-gray-400 font-semibold">No courses found.</td></tr>
                ) : (
                  courseSummaries.map((cs, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition">
                      <td className="py-4 px-6 font-bold text-[#1e293b]">{cs.courseName}</td>
                      <td className="py-4 px-6 text-center font-bold text-gray-600">
                        <span className="bg-blue-50 text-[#2C4276] px-3 py-1 rounded-full text-xs">{cs.totalBatches}</span>
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-gray-600">{cs.activeInstructors}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden w-24">
                            <div className="bg-green-500 h-full rounded-full transition-all duration-500" style={{ width: `${cs.averageCompletion}%` }} />
                          </div>
                          <span className="text-xs font-black text-green-600 w-8">{cs.averageCompletion}%</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "teachers" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-[#1e293b] font-bold text-base flex items-center gap-2">
              <BarChart3 size={18} className="text-[#2C4276]" />
              Instructor Performance Summary
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6 text-center">Batches Handled</th>
                  <th className="py-4 px-6 text-center">Topics Done</th>
                  <th className="py-4 px-6 text-right">Completion Rate</th>
                  <th className="py-4 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {teacherProductivity.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-400 font-semibold">No instructors found.</td></tr>
                ) : (
                  teacherProductivity.map((tp, idx) => (
                    <React.Fragment key={tp.teacherId || idx}>
                      <tr className="hover:bg-gray-50/50 transition">
                        <td className="py-4 px-6 font-bold text-[#1e293b] flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-[#2C4276] flex items-center justify-center text-xs">
                            {tp.name.charAt(0)}
                          </div>
                          {tp.name}
                        </td>
                        <td className="py-4 px-6 text-center font-bold text-gray-600">{tp.activeBatches}</td>
                        <td className="py-4 px-6 text-center font-bold text-gray-600">{tp.completedTopics} / {tp.totalTopics}</td>
                        <td className="py-4 px-6 text-right font-black text-[#2C4276]">{tp.completionRate}%</td>
                        <td className="py-4 px-6 text-right">
                          <button onClick={() => toggleTeacherDetails(tp.teacherId)} className="p-1.5 bg-gray-50 text-gray-400 hover:text-[#2C4276] hover:bg-blue-50 rounded-lg transition border border-gray-100">
                            {expandedTeacher === tp.teacherId ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </td>
                      </tr>
                      <AnimatePresence>
                        {expandedTeacher === tp.teacherId && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <td colSpan={5} className="bg-[#f8faff] p-0 border-b border-blue-100">
                              <div className="px-8 py-6 space-y-6">
                                {tp.batchDetails && tp.batchDetails.length > 0 ? (
                                  tp.batchDetails.map((batch: any, bIdx: number) => (
                                    <div key={bIdx} className="bg-white p-5 rounded-2xl border border-blue-50 shadow-sm">
                                      <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-4">
                                        <div>
                                          <h5 className="text-sm font-bold text-[#1e293b]">{batch.batchName}</h5>
                                          <p className="text-xs text-[#2C4276] font-semibold">{batch.courseName}</p>
                                        </div>
                                        <div className="text-right">
                                          <span className="text-xs font-black text-[#2C4276] bg-blue-50 px-2 py-1 rounded-lg">
                                            {batch.progress}% Complete
                                          </span>
                                        </div>
                                      </div>

                                      {batch.topicDetails && batch.topicDetails.filter((t: any) => t.completed || (t.completedSubtopics && t.completedSubtopics.length > 0)).length > 0 ? (
                                        <div className="space-y-3">
                                          {batch.topicDetails
                                            .filter((t: any) => t.completed || (t.completedSubtopics && t.completedSubtopics.length > 0))
                                            .map((topic: any, tIdx: number) => (
                                              <div key={tIdx} className="flex gap-2.5 items-start">
                                                <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                                <div>
                                                  <p className="text-xs font-bold text-gray-700">{topic.topicTitle}</p>
                                                  {topic.subtopicTitles && topic.subtopicTitles.length > 0 && (
                                                    <div className="mt-1 space-y-1">
                                                      {topic.subtopicTitles.map((sub: string, sIdx: number) => (
                                                        <p key={sIdx} className="text-[10px] font-medium text-gray-500 flex items-center gap-1">
                                                          <Circle size={4} className="text-green-400 fill-green-400" />
                                                          {sub}
                                                        </p>
                                                      ))}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            ))}
                                        </div>
                                      ) : (
                                        <p className="text-xs text-gray-400 italic font-medium">No topics covered in this batch yet.</p>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-400 text-center font-semibold">No assigned batches.</p>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom Panels - Recent Activity */}
      <div className="grid grid-cols-1 gap-6">
        {/* Recent Lecture Activity Log */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gray-50/50 p-4 border-b border-gray-100">
            <h3 className="text-[#1e293b] font-bold text-base flex items-center gap-2">
              <Clock size={18} className="text-[#2C4276]" />
              Recent Lecture Activity Log
            </h3>
          </div>

          <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-gray-400 italic text-center py-4">No recent activity logged.</p>
            ) : (
              recentActivity.map((activity, idx) => (
                <div key={idx} className="flex gap-3.5 items-start p-3 rounded-xl border border-gray-50 hover:bg-gray-50/30 transition">
                  <div className="bg-blue-50 text-[#2C4276] p-2.5 rounded-xl flex-shrink-0">
                    <UserCheck size={18} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-[#1e293b] text-sm">
                        {activity.teacher}
                      </h4>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap font-bold uppercase tracking-wider">{activity.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">
                      {activity.action} for <strong className="text-[#2C4276]">{activity.batch}</strong>
                    </p>
                    <span className="inline-block text-[10px] font-bold bg-gray-100 py-0.5 px-2 rounded-full mt-1 text-gray-500">
                      Duration: {activity.duration}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
