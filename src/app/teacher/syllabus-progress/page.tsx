"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Users,
  CheckCircle2,
  Circle,
  Loader2,
  ChevronDown,
  ChevronRight,
  RotateCw,
  Layers,
  Trophy,
  Clock,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function TeacherTakeLecture() {
  const [batches, setBatches] = useState<any[]>([]);
  const [batchDetails, setBatchDetails] = useState<any>(null);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [loadingSyllabus, setLoadingSyllabus] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [savingTopicId, setSavingTopicId] = useState<string | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, any>>({});
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const BATCH_STORAGE_KEY = "teacherSyllabusSelectedBatch";

  useEffect(() => {
    const storedBatch = typeof window !== "undefined" ? window.localStorage.getItem(BATCH_STORAGE_KEY) : null;
    if (storedBatch) setSelectedBatch(storedBatch);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (selectedBatch) {
        window.localStorage.setItem(BATCH_STORAGE_KEY, selectedBatch);
      } else {
        window.localStorage.removeItem(BATCH_STORAGE_KEY);
      }
    }
  }, [selectedBatch]);

  // Load batches
  useEffect(() => {
    const loadBatches = async () => {
      setLoadingBatches(true);
      try {
        const res = await fetch("/api/teacher/batches/", { cache: "no-store", credentials: "include" });
        const data = await res.json();
        setBatches(data.batches || []);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load batches");
      } finally {
        setLoadingBatches(false);
      }
    };
    loadBatches();
  }, []);

  // Load syllabus for selected batch
  const loadSyllabus = async (batchId: string, isRefresh = false) => {
    if (!isRefresh) setLoadingSyllabus(true);
    if (isRefresh) setRefreshing(true);

    try {
      const res = await fetch(`/api/teacher/batches/${batchId}/syllabus/?t=${Date.now()}`, { cache: "no-store", credentials: "include" });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to load syllabus");
        setBatchDetails(null);
        return;
      }

      setBatchDetails(data);
      const pm = data.progressMap || {};
      setProgressMap(pm);

      const expanded: Record<string, boolean> = {};
      (data.modules || []).forEach((m: any) => { expanded[m._id] = true; });
      setExpandedModules(expanded);

      setLastRefresh(new Date());
      if (isRefresh) toast.success("Syllabus refreshed");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Something went wrong fetching syllabus");
      setBatchDetails(null);
    } finally {
      setLoadingSyllabus(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!selectedBatch) {
      setBatchDetails(null);
      setProgressMap({});
      setExpandedModules({});
      return;
    }
    loadSyllabus(selectedBatch);
  }, [selectedBatch]);

  // Auto-refresh every 30 seconds when a batch is selected
  useEffect(() => {
    if (!selectedBatch) return;
    const interval = setInterval(() => {
      loadSyllabus(selectedBatch, true);
    }, 30000);
    return () => clearInterval(interval);
  }, [selectedBatch]);

  const courseName = batchDetails?.batch?.courseId?.name || "";
  const batchName = batchDetails?.batch?.name || "";

  const modulesWithTopics = useMemo(() => {
    if (!batchDetails?.modules) return [];
    return batchDetails.modules.map((mod: any) => ({
      ...mod,
      topics: (batchDetails.topics || []).filter(
        (t: any) => t.moduleId?.toString() === mod._id?.toString()
      ),
    }));
  }, [batchDetails]);

  const { totalUnits, completedUnits } = useMemo(() => {
    let total = 0;
    let completed = 0;

    modulesWithTopics.forEach((mod: any) => {
      mod.topics.forEach((topic: any) => {
        const subtopics = topic.subtopics || [];
        if (subtopics.length > 0) {
          total += subtopics.length;
          const completedArr = progressMap[topic._id]?.completedSubtopics || [];
          completed += completedArr.length;
        } else {
          total += 1;
          if (progressMap[topic._id]?.completed) completed += 1;
        }
      });
    });

    return { totalUnits: total, completedUnits: completed };
  }, [modulesWithTopics, progressMap]);

  const percent = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;
  const totalModules = modulesWithTopics.length;
  const completedModules = modulesWithTopics.filter((mod: any) => {
    const modTopics: any[] = mod.topics;
    return modTopics.length > 0 && modTopics.every((t) => progressMap[t._id]?.completed);
  }).length;

  const handleToggle = async (topicId: string, currentlyCompleted: boolean, subtopicId?: string, currentlySubCompleted?: boolean) => {
    const isSub = !!subtopicId;
    setSavingTopicId(isSub ? subtopicId : topicId);

    const previousTopicState = progressMap[topicId]
      ? {
        ...progressMap[topicId],
        completedSubtopics: [...(progressMap[topicId]?.completedSubtopics || [])],
      }
      : undefined;

    let newValue = !currentlyCompleted;
    if (isSub) {
      newValue = !currentlySubCompleted;
    }

    let targetTopic: any = null;
    for (const mod of modulesWithTopics) {
      const found = mod.topics.find((t: any) => t._id === topicId);
      if (found) {
        targetTopic = found;
        break;
      }
    }
    const allSubIds = targetTopic?.subtopics ? targetTopic.subtopics.map((s: any) => s._id) : [];

    const payload: any = { batchId: selectedBatch, topicId };

    if (isSub) {
      payload.subtopicId = subtopicId;
      payload.subtopicCompleted = newValue;
    } else {
      payload.completed = newValue;
    }

    setProgressMap((prev) => {
      const prevTopic = prev[topicId] || {};
      const nextTopic = { ...prevTopic };

      if (isSub) {
        let subArr = [...(nextTopic.completedSubtopics || [])];
        if (newValue) {
          if (!subArr.some((id: any) => id?.toString() === subtopicId?.toString())) {
            subArr.push(subtopicId);
          }
        } else {
          subArr = subArr.filter((id: any) => id?.toString() !== subtopicId?.toString());
        }
        nextTopic.completedSubtopics = subArr;

        const allCompleted = allSubIds.length > 0 && allSubIds.every((id: any) => subArr.some((sid: any) => sid?.toString() === id?.toString()));
        nextTopic.completed = allCompleted;
        nextTopic.completedAt = allCompleted ? new Date().toISOString() : undefined;
      } else {
        nextTopic.completed = newValue;
        nextTopic.completedAt = newValue ? new Date().toISOString() : undefined;
        nextTopic.completedSubtopics = newValue ? [...allSubIds] : [];
      }
      return { ...prev, [topicId]: nextTopic };
    });

    try {
      const res = await fetch(`/api/teacher/batches/${selectedBatch}/syllabus/?t=${Date.now()}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update");
      }

      const responseData = await res.json();
      if (responseData.progressMap) {
        setProgressMap((prev) => ({ ...prev, ...responseData.progressMap }));
      }

      toast.success(
        newValue
          ? isSub ? "Subtopic completed!" : "Topic marked as completed!"
          : isSub ? "Subtopic marked incomplete" : "Topic marked as incomplete"
      );
    } catch (e: any) {
      setProgressMap((prev) => {
        const next = { ...prev };
        if (previousTopicState) {
          next[topicId] = previousTopicState;
        } else {
          delete next[topicId];
        }
        return next;
      });
      toast.error(e.message || "Something went wrong");
    } finally {
      setSavingTopicId(null);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const handleManualRefresh = () => {
    if (selectedBatch && !refreshing) {
      loadSyllabus(selectedBatch, true);
    }
  };

  /* ─── Circular progress ring SVG helpers ─── */
  const RING_SIZE = 120;
  const RING_STROKE = 10;
  const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
  const RING_CIRC = 2 * Math.PI * RING_RADIUS;
  const ringOffset = RING_CIRC - (percent / 100) * RING_CIRC;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ═══════════ HEADER ═══════════ */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1e293b] mb-1">Syllabus Progress</h1>
          <p className="text-gray-500 text-sm">Select a batch and tick off the topics you covered today.</p>
        </div>

        {/* ═══════════ BATCH SELECTOR ═══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-lg rounded-[1.5rem] border border-white shadow-lg shadow-gray-200/50 p-6"
        >
          <label htmlFor="batch-select" className="block text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 mb-3">
            <Users size={12} className="inline mr-1.5 -mt-0.5" />
            Select Batch
          </label>
          <div className="relative">
            <select
              id="batch-select"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              disabled={loadingBatches}
              className="w-full pl-5 pr-12 py-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]/30 focus:border-[#2C4276] text-sm text-gray-700 font-medium transition appearance-none disabled:opacity-50 cursor-pointer"
            >
              <option value="">— Choose an active batch —</option>
              {batches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.name} {batch.courseId?.name ? `• ${batch.courseId.name}` : ""}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </motion.div>

        {/* ═══════════ SYLLABUS CONTENT ═══════════ */}
        <AnimatePresence>
          {selectedBatch && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-6"
            >
              {/* ── Stats Row ── */}
              {courseName && !loadingSyllabus && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Circular Progress */}
                  <div className="col-span-2 sm:col-span-1 bg-white/80 backdrop-blur-lg rounded-[1.5rem] border border-white shadow-lg shadow-gray-200/50 p-6 flex flex-col items-center justify-center">
                    <div className="relative" style={{ width: RING_SIZE, height: RING_SIZE }}>
                      <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90">
                        <circle
                          cx={RING_SIZE / 2}
                          cy={RING_SIZE / 2}
                          r={RING_RADIUS}
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth={RING_STROKE}
                        />
                        <motion.circle
                          cx={RING_SIZE / 2}
                          cy={RING_SIZE / 2}
                          r={RING_RADIUS}
                          fill="none"
                          stroke={percent === 100 ? "#22c55e" : "#2C4276"}
                          strokeWidth={RING_STROKE}
                          strokeLinecap="round"
                          strokeDasharray={RING_CIRC}
                          initial={{ strokeDashoffset: RING_CIRC }}
                          animate={{ strokeDashoffset: ringOffset }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-gray-800">{percent}%</span>
                        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Done</span>
                      </div>
                    </div>
                  </div>

                  {/* Course Card */}
                  <div className="bg-white/80 backdrop-blur-lg rounded-[1.5rem] border border-white shadow-lg shadow-gray-200/50 p-5 flex flex-col justify-between">
                    <BookOpen size={20} className="text-[#2C4276] mb-2" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Course</p>
                      <p className="text-sm font-bold text-gray-800 leading-snug line-clamp-2">{courseName}</p>
                    </div>
                  </div>

                  {/* Modules Card */}
                  <div className="bg-white/80 backdrop-blur-lg rounded-[1.5rem] border border-white shadow-lg shadow-gray-200/50 p-5 flex flex-col justify-between">
                    <Layers size={20} className="text-indigo-500 mb-2" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Modules</p>
                      <p className="text-xl font-black text-gray-800">
                        {completedModules}<span className="text-gray-300 font-medium text-sm">/{totalModules}</span>
                      </p>
                    </div>
                  </div>

                  {/* Topics Card */}
                  <div className="bg-white/80 backdrop-blur-lg rounded-[1.5rem] border border-white shadow-lg shadow-gray-200/50 p-5 flex flex-col justify-between">
                    <Trophy size={20} className="text-amber-500 mb-2" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Topics</p>
                      <p className="text-xl font-black text-gray-800">
                        {completedUnits}<span className="text-gray-300 font-medium text-sm">/{totalUnits}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Overall Progress Bar ── */}
              {courseName && !loadingSyllabus && (
                <div className="bg-white/80 backdrop-blur-lg rounded-[1.5rem] border border-white shadow-lg shadow-gray-200/50 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-[#2C4276]" />
                      Overall Progress
                    </span>
                    <span className="text-xs font-black text-[#2C4276]">
                      {completedUnits} / {totalUnits} items
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${percent === 100 ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-[#2C4276] to-[#3b5998]"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}

              {/* ── Loading State ── */}
              {loadingSyllabus ? (
                <div className="bg-white/80 backdrop-blur-lg rounded-[1.5rem] border border-white shadow-lg shadow-gray-200/50 flex flex-col items-center justify-center py-20 gap-4" role="status">
                  <div className="w-16 h-16 rounded-2xl bg-[#2C4276]/10 flex items-center justify-center">
                    <Loader2 className="animate-spin text-[#2C4276]" size={32} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-600">Loading syllabus…</p>
                    <p className="text-xs text-gray-400 mt-1">Fetching modules and progress data</p>
                  </div>
                </div>
              ) : modulesWithTopics.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-lg rounded-[1.5rem] border border-white shadow-lg shadow-gray-200/50 flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center">
                    <BookOpen size={36} className="text-gray-300" />
                  </div>
                  <div className="text-center max-w-sm">
                    <p className="text-sm font-bold text-gray-600">No syllabus modules found</p>
                    <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                      The admin has not added any modules or topics for this course yet. Please contact the administrator to set up the syllabus.
                    </p>
                  </div>
                </div>
              ) : (
                /* ── Module Cards ── */
                <div className="space-y-4">
                  {modulesWithTopics.map((mod: any, mi: number) => {
                    const modTopics: any[] = mod.topics;
                    const modCompleted = modTopics.filter((t) => progressMap[t._id]?.completed).length;
                    const isExpanded = expandedModules[mod._id] ?? true;
                    const modPercent = modTopics.length > 0 ? Math.round((modCompleted / modTopics.length) * 100) : 0;
                    const isModuleDone = modCompleted === modTopics.length && modTopics.length > 0;

                    return (
                      <motion.div
                        key={mod._id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: mi * 0.05 }}
                        className={`bg-white/80 backdrop-blur-lg rounded-[1.5rem] border shadow-lg overflow-hidden transition-all ${isModuleDone ? "border-green-200 shadow-green-100/50" : "border-white shadow-gray-200/50"
                          }`}
                      >
                        {/* Module Header */}
                        <button
                          onClick={() => toggleModule(mod._id)}
                          className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50/50 transition text-left group"
                          aria-label={`Toggle module ${mod.title}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 transition-colors ${isModuleDone
                              ? "bg-green-100 text-green-600"
                              : "bg-[#2C4276]/10 text-[#2C4276]"
                              }`}>
                              {isModuleDone ? <CheckCircle2 size={20} /> : mi + 1}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-gray-800 text-sm sm:text-base truncate">{mod.title}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-[11px] font-semibold text-gray-400">
                                  {modCompleted}/{modTopics.length} topics
                                </span>
                                {/* mini progress */}
                                <div className="hidden sm:block w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <motion.div
                                    className={`h-full rounded-full ${isModuleDone ? "bg-green-500" : "bg-[#2C4276]"}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${modPercent}%` }}
                                    transition={{ duration: 0.5 }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {isModuleDone && (
                              <span className="text-[10px] font-black text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100 uppercase tracking-widest">
                                Complete
                              </span>
                            )}
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${isExpanded ? "bg-gray-100" : "bg-transparent group-hover:bg-gray-100"
                              }`}>
                              {isExpanded
                                ? <ChevronDown size={16} className="text-gray-500" />
                                : <ChevronRight size={16} className="text-gray-400" />}
                            </div>
                          </div>
                        </button>

                        {/* Topics */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-gray-100 mx-4" />
                              <div className="px-2 py-3">
                                {modTopics.length === 0 ? (
                                  <p className="px-6 py-4 text-xs text-gray-400 italic text-center">No topics in this module.</p>
                                ) : (
                                  modTopics.map((topic: any, ti: number) => {
                                    const isCompleted = !!progressMap[topic._id]?.completed;
                                    const isSaving = savingTopicId === topic._id;
                                    const subtopics = topic.subtopics || [];
                                    const completedSubtopics = progressMap[topic._id]?.completedSubtopics || [];

                                    return (
                                      <div key={topic._id}>
                                        <button
                                          onClick={() => !isSaving && handleToggle(topic._id, isCompleted)}
                                          disabled={isSaving}
                                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition group disabled:opacity-75 ${isCompleted
                                            ? "bg-green-50/60 hover:bg-green-50"
                                            : "hover:bg-gray-50"
                                            }`}
                                        >
                                          <div className="flex-shrink-0">
                                            {isSaving ? (
                                              <Loader2 size={18} className="animate-spin text-[#2C4276]" />
                                            ) : isCompleted ? (
                                              <CheckCircle2 size={18} className="text-green-500" />
                                            ) : (
                                              <Circle size={18} className="text-gray-300 group-hover:text-[#2C4276] transition" />
                                            )}
                                          </div>
                                          <span
                                            className={`text-sm font-semibold transition text-left ${isCompleted
                                              ? "text-gray-400 line-through"
                                              : "text-gray-700 group-hover:text-[#2C4276]"
                                              }`}
                                          >
                                            {topic.title}
                                          </span>
                                          {isCompleted && progressMap[topic._id]?.completedAt && (
                                            <span className="ml-auto text-[10px] font-semibold text-gray-400 flex-shrink-0 flex items-center gap-1">
                                              <Clock size={10} />
                                              {new Date(progressMap[topic._id].completedAt).toLocaleDateString("en-IN", {
                                                day: "numeric", month: "short",
                                              })}
                                            </span>
                                          )}
                                        </button>

                                        {/* Subtopics Checklist */}
                                        {subtopics.length > 0 && (
                                          <div className="ml-10 mr-4 mb-1 pl-4 border-l-2 border-gray-100 space-y-0.5">
                                            {subtopics.map((st: any) => {
                                              const isSubCompleted = completedSubtopics.includes(st._id);
                                              const isSubSaving = savingTopicId === st._id;

                                              return (
                                                <button
                                                  key={st._id}
                                                  onClick={() => !isSubSaving && handleToggle(topic._id, isCompleted, st._id, isSubCompleted)}
                                                  disabled={isSubSaving}
                                                  className="w-full flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50/80 transition group text-left disabled:opacity-75"
                                                >
                                                  <div className="flex-shrink-0">
                                                    {isSubSaving ? (
                                                      <Loader2 size={14} className="animate-spin text-gray-400" />
                                                    ) : isSubCompleted ? (
                                                      <CheckCircle2 size={14} className="text-[#2C4276]" />
                                                    ) : (
                                                      <Circle size={14} className="text-gray-200 group-hover:text-gray-400 transition" />
                                                    )}
                                                  </div>
                                                  <span
                                                    className={`text-xs font-medium transition ${isSubCompleted ? "text-gray-400 line-through" : "text-gray-600 group-hover:text-gray-900"
                                                      }`}
                                                  >
                                                    {st.title}
                                                  </span>
                                                </button>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Empty state when no batch selected ── */}
        {!selectedBatch && !loadingBatches && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/80 backdrop-blur-lg rounded-[1.5rem] border border-white shadow-lg shadow-gray-200/50 flex flex-col items-center justify-center py-20 gap-4"
          >
            <div className="w-20 h-20 rounded-2xl bg-[#2C4276]/5 flex items-center justify-center">
              <Users size={36} className="text-[#2C4276]/30" />
            </div>
            <div className="text-center max-w-xs">
              <p className="text-sm font-bold text-gray-500">No batch selected</p>
              <p className="text-xs text-gray-400 mt-1.5">Choose a batch above to view and track your syllabus progress.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
