"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Users, CheckCircle2, Circle, PlayCircle, ChevronDown, ChevronUp, Clock, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TeacherSyllabusProgress() {
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [batchDetails, setBatchDetails] = useState<any>(null);
  const [openModules, setOpenModules] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const loadBatches = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/teacher/batches");
        const data = await res.json();
        const batchList = data.batches || [];
        setBatches(batchList);
        setSelectedBatchId(batchList[0]?._id || "");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadBatches();
  }, []);

  useEffect(() => {
    if (!selectedBatchId) {
      setBatchDetails(null);
      return;
    }

    const loadBatchDetails = async () => {
      setLoadingDetails(true);
      try {
        const res = await fetch(`/api/teacher/batches/${selectedBatchId}/syllabus`);
        const data = await res.json();
        setBatchDetails(data);
        const moduleOpenState: Record<number, boolean> = {};
        (data.modules || []).forEach((_: any, idx: number) => {
          moduleOpenState[idx] = true;
        });
        setOpenModules(moduleOpenState);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingDetails(false);
      }
    };

    loadBatchDetails();
  }, [selectedBatchId]);

  const activeBatch = useMemo(
    () => batches.find((b) => b._id === selectedBatchId) || null,
    [batches, selectedBatchId]
  );

  const syllabus = useMemo(() => {
    if (!batchDetails?.modules || !Array.isArray(batchDetails.modules)) {
      return [];
    }

    return batchDetails.modules.map((module: any) => {
      const topics = (batchDetails.topics || [])
        .filter((topic: any) => topic.moduleId === module._id)
        .map((topic: any) => {
          const progress = batchDetails.progressMap?.[topic._id]?.completed;
          return {
            title: topic.title,
            status: progress ? "Completed" : "Pending",
            lastUpdated: batchDetails.progressMap?.[topic._id]?.completedAt
              ? new Date(batchDetails.progressMap[topic._id].completedAt).toLocaleDateString()
              : undefined,
            duration: topic.estimatedDuration || undefined,
          };
        });

      return {
        moduleName: module.title,
        topics,
      };
    });
  }, [batchDetails]);

  const toggleModule = (index: number) => {
    setOpenModules((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading syllabus progress...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4276] mb-1">
            Syllabus Progress Tracker
          </h1>
          <p className="text-gray-500 text-sm">
            Interactive syllabus checksheets. View completed, current, and pending topics per batch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">Active Batch:</label>
          <div className="relative">
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] text-xs font-bold text-gray-700 transition appearance-none shadow-sm cursor-pointer"
            >
              {batches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
            <Users size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-[#2C4276]" />
            <span className="text-sm font-semibold text-gray-500">{activeBatch?.courseId?.name || "Course"}</span>
          </div>
          <h2 className="font-bold text-xl sm:text-2xl text-[#1e293b]">{activeBatch?.name || "Select a batch"}</h2>
        </div>

        <div className="md:w-96 flex flex-col justify-center border-t md:border-t-0 pt-4 md:pt-0 border-gray-50">
          <div className="flex justify-between items-center text-sm font-bold mb-2">
            <span className="text-gray-500">Syllabus Completion</span>
            <span className="text-[#2C4276] text-lg font-black">{activeBatch?.progress || 0}%</span>
          </div>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden shadow-inner">
            <div
              className="bg-[#2C4276] h-full rounded-full transition-all duration-500"
              style={{ width: `${activeBatch?.progress || 0}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loadingDetails ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center text-gray-500">Loading batch modules...</div>
        ) : syllabus.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-gray-500">
            No syllabus modules were found for this batch. Go to <Link href="/teacher/take-lecture" className="underline font-bold">Take Lecture</Link> to submit an update after a syllabus item has been created.
          </div>
        ) : (
          syllabus.map((mod, modIdx) => {
            const isOpen = !!openModules[modIdx];
            return (
              <div key={modIdx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleModule(modIdx)}
                  className="w-full p-5 flex items-center justify-between bg-gray-50/50 hover:bg-gray-50 transition border-b border-gray-100 text-left"
                >
                  <span className="font-bold text-base text-[#1e293b]">{mod.moduleName}</span>
                  {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </button>

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
          })
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-2.5 text-xs text-[#2C4276] font-medium leading-relaxed max-w-3xl">
        <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-blue-600" />
        <p>
          Need to mark a pending topic as completed or in progress? Go to the <Link href="/teacher/take-lecture" className="underline font-bold">Take Lecture</Link> tab, submit your class report, and the progress checklist will automatically adapt.
        </p>
      </div>
    </div>
  );
}
