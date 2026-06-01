"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, Users, CheckCircle2, Circle, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TeacherTakeLecture() {
  const [batches, setBatches] = useState<any[]>([]);
  const [batchDetails, setBatchDetails] = useState<any>(null);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [loadingSyllabus, setLoadingSyllabus] = useState(false);
  const [savingTopicId, setSavingTopicId] = useState<string | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, any>>({});
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const loadBatches = async () => {
      setLoadingBatches(true);
      try {
        const res = await fetch("/api/teacher/batches/");
        const data = await res.json();
        setBatches(data.batches || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingBatches(false);
      }
    };
    loadBatches();
  }, []);

  useEffect(() => {
    if (!selectedBatch) {
      setBatchDetails(null);
      setProgressMap({});
      setExpandedModules({});
      return;
    }
    const load = async () => {
      setLoadingSyllabus(true);
      try {
        const res = await fetch(`/api/teacher/batches/${selectedBatch}/syllabus/`);
        const data = await res.json();

        if (!res.ok) {
          showToast(data.error || "Failed to load syllabus", "error");
          setBatchDetails(null);
          return;
        }

        setBatchDetails(data);
        // Build progressMap from API response
        const pm = (data.progressMap || {});
        setProgressMap(pm);
        // Expand all modules by default
        const expanded: Record<string, boolean> = {};
        (data.modules || []).forEach((m: any) => { expanded[m._id] = true; });
        setExpandedModules(expanded);
      } catch (e: any) {
        console.error(e);
        showToast(e.message || "Something went wrong fetching syllabus", "error");
        setBatchDetails(null);
      } finally {
        setLoadingSyllabus(false);
      }
    };
    load();
  }, [selectedBatch]);

  const courseName = batchDetails?.batch?.courseId?.name || "";

  // Group topics by module
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

  const handleToggle = async (topicId: string, currentlyCompleted: boolean, subtopicId?: string, currentlySubCompleted?: boolean) => {
    const isSub = !!subtopicId;
    setSavingTopicId(isSub ? subtopicId : topicId);

    let newValue = !currentlyCompleted;
    if (isSub) {
      newValue = !currentlySubCompleted;
    }

    // Find the target topic to extract subtopic configuration
    let targetTopic: any = null;
    for (const mod of modulesWithTopics) {
      const found = mod.topics.find((t: any) => t._id === topicId);
      if (found) { targetTopic = found; break; }
    }
    const allSubIds = targetTopic?.subtopics ? targetTopic.subtopics.map((s: any) => s._id) : [];

    let payload: any = { topicId };

    // Optimistic update
    setProgressMap((prev) => {
      const prevTopic = prev[topicId] || {};
      let nextTopic = { ...prevTopic };

      if (isSub) {
        let subArr = nextTopic.completedSubtopics || [];
        if (newValue) {
          if (!subArr.includes(subtopicId)) subArr = [...subArr, subtopicId];
        } else {
          subArr = subArr.filter((id: string) => id !== subtopicId);
        }
        nextTopic.completedSubtopics = subArr;

        // Auto-check Main Topic if all subtopics are completed
        const allCompleted = allSubIds.length > 0 && allSubIds.every((id: string) => subArr.includes(id));
        nextTopic.completed = allCompleted;
        nextTopic.completedAt = allCompleted ? new Date().toISOString() : undefined;

        payload.subtopicId = subtopicId;
        payload.subtopicCompleted = newValue;
        payload.completed = allCompleted; // sync main topic state to backend
      } else {
        nextTopic.completed = newValue;
        nextTopic.completedAt = newValue ? new Date().toISOString() : undefined;

        // Auto-check/uncheck all subtopics when main topic is clicked
        nextTopic.completedSubtopics = newValue ? [...allSubIds] : [];

        payload.completed = newValue;
        payload.completedSubtopicsArr = nextTopic.completedSubtopics;
      }
      return { ...prev, [topicId]: nextTopic };
    });

    try {
      const res = await fetch(`/api/teacher/batches/${selectedBatch}/syllabus/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update");
      }

      showToast(newValue ? (isSub ? "Subtopic completed!" : "Topic marked as completed!") : (isSub ? "Subtopic incomplete" : "Topic marked as incomplete"));
    } catch (e: any) {
      // Simplified rollback approach for brevity (could be improved)
      setProgressMap((prev) => ({
        ...prev,
        [topicId]: { ...(prev[topicId] || {}), completed: currentlyCompleted },
      }));
      showToast(e.message || "Something went wrong", "error");
    } finally {
      setSavingTopicId(null);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1e293b]">Log Lecture Progress</h1>
        <p className="text-gray-500 text-sm mt-1">
          Select a batch and tick off the topics you covered today.
        </p>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium shadow-sm border ${toast.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
              }`}
          >
            <CheckCircle2 size={18} className={toast.type === "success" ? "text-green-600" : "text-red-600"} />
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Batch Selector */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
          Select Batch <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            disabled={loadingBatches}
            className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] text-sm text-gray-700 transition appearance-none disabled:opacity-50"
          >
            <option value="">-- Select Active Batch --</option>
            {batches.map((batch) => (
              <option key={batch._id} value={batch._id}>
                {batch.name} {batch.courseId?.name ? `• ${batch.courseId.name}` : ""}
              </option>
            ))}
          </select>
          <Users size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Syllabus Checklist */}
      <AnimatePresence>
        {selectedBatch && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* Course Info + Progress Bar */}
            {courseName && (
              <div className="px-6 py-4 border-b border-gray-50 bg-[#f8faff]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-[#2C4276] font-bold text-sm">
                    <BookOpen size={16} />
                    {courseName}
                  </div>
                  <span className="text-xs font-semibold text-gray-500">
                    {completedUnits} / {totalUnits} items done
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#2C4276] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">{percent}% complete</p>
              </div>
            )}

            {/* Loading */}
            {loadingSyllabus ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                <Loader2 className="animate-spin" size={32} />
                <p className="text-sm">Loading syllabus...</p>
              </div>
            ) : modulesWithTopics.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                <BookOpen size={32} className="text-gray-300 mb-2" />
                <p className="text-sm font-medium text-gray-500">No syllabus modules found.</p>
                <p className="text-xs text-center max-w-xs">
                  The admin has not added any modules or topics for this course yet. Please contact the administrator to set up the syllabus.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {modulesWithTopics.map((mod: any, mi: number) => {
                  const modTopics: any[] = mod.topics;
                  const modCompleted = modTopics.filter((t) => progressMap[t._id]?.completed).length;
                  const isExpanded = expandedModules[mod._id] ?? true;

                  return (
                    <div key={mod._id}>
                      {/* Module Header */}
                      <button
                        onClick={() => toggleModule(mod._id)}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-[#2C4276]/10 text-[#2C4276] text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {mi + 1}
                          </span>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{mod.title}</p>
                            <p className="text-xs text-gray-400">{modCompleted}/{modTopics.length} completed</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {modCompleted === modTopics.length && modTopics.length > 0 && (
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                              Done
                            </span>
                          )}
                          {isExpanded
                            ? <ChevronDown size={16} className="text-gray-400" />
                            : <ChevronRight size={16} className="text-gray-400" />}
                        </div>
                      </button>

                      {/* Topics */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pb-2">
                              {modTopics.length === 0 ? (
                                <p className="px-6 py-3 text-xs text-gray-400 italic">No topics in this module.</p>
                              ) : (
                                modTopics.map((topic: any) => {
                                  const isCompleted = !!progressMap[topic._id]?.completed;
                                  const isSaving = savingTopicId === topic._id;
                                  const subtopics = topic.subtopics || [];
                                  const completedSubtopics = progressMap[topic._id]?.completedSubtopics || [];

                                  return (
                                    <div key={topic._id} className="border-b border-gray-50 last:border-0 pb-1">
                                      <button
                                        onClick={() => !isSaving && handleToggle(topic._id, isCompleted)}
                                        disabled={isSaving}
                                        className={`w-full flex items-center gap-3 px-6 py-3 transition group hover:bg-gray-50 disabled:opacity-75 ${isCompleted ? "bg-green-50/40" : ""
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
                                          className={`text-sm font-semibold transition ${isCompleted
                                            ? "text-gray-400 line-through"
                                            : "text-gray-800 group-hover:text-[#2C4276]"
                                            }`}
                                        >
                                          {topic.title}
                                        </span>
                                        {isCompleted && progressMap[topic._id]?.completedAt && (
                                          <span className="ml-auto text-xs text-gray-400 flex-shrink-0">
                                            {new Date(progressMap[topic._id].completedAt).toLocaleDateString("en-IN", {
                                              day: "numeric", month: "short",
                                            })}
                                          </span>
                                        )}
                                      </button>

                                      {/* Subtopics Checklist */}
                                      {subtopics.length > 0 && (
                                        <div className="pl-14 pr-6 pb-2 space-y-0.5">
                                          {subtopics.map((st: any) => {
                                            const isSubCompleted = completedSubtopics.includes(st._id);
                                            const isSubSaving = savingTopicId === st._id;

                                            return (
                                              <button
                                                key={st._id}
                                                onClick={() => !isSubSaving && handleToggle(topic._id, isCompleted, st._id, isSubCompleted)}
                                                disabled={isSubSaving}
                                                className="w-full flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-gray-100/50 transition group text-left disabled:opacity-75"
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
                                                  className={`text-xs transition ${isSubCompleted ? "text-gray-400 line-through" : "text-gray-600 group-hover:text-gray-900"
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
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
