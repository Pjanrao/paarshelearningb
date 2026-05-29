"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, Users, ClipboardCheck, Video, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TeacherTakeLecture() {
  const [batches, setBatches] = useState<any[]>([]);
  const [batchDetails, setBatchDetails] = useState<any>(null);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [duration, setDuration] = useState("2.0");
  const [notes, setNotes] = useState("");
  const [homework, setHomework] = useState("");
  const [recordingLink, setRecordingLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [loadingSyllabus, setLoadingSyllabus] = useState(false);

  useEffect(() => {
    const loadBatches = async () => {
      setLoadingBatches(true);
      try {
        const res = await fetch("/api/teacher/batches");
        const data = await res.json();
        setBatches(data.batches || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingBatches(false);
      }
    };

    loadBatches();
  }, []);

  useEffect(() => {
    if (!selectedBatch) {
      setBatchDetails(null);
      setSelectedTopic("");
      return;
    }

    const loadBatchDetails = async () => {
      setLoadingSyllabus(true);
      try {
        const res = await fetch(`/api/teacher/batches/${selectedBatch}/syllabus`);
        const data = await res.json();
        setBatchDetails(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSyllabus(false);
      }
    };

    loadBatchDetails();
  }, [selectedBatch]);

  const courseName = batchDetails?.batch?.courseId?.name || "";

  const topicOptions = useMemo(() => {
    if (!batchDetails?.modules || !Array.isArray(batchDetails.modules)) {
      return [];
    }

    return batchDetails.modules.flatMap((module: any) => {
      const moduleTopics = batchDetails.topics?.filter((topic: any) => topic.moduleId === module._id) || [];
      return moduleTopics.map((topic: any) => ({
        id: topic._id,
        label: topic.title,
        moduleTitle: module.title,
      }));
    });
  }, [batchDetails]);

  const selectedTopicLabel = useMemo(() => {
    const found = topicOptions.find((topic: any) => topic.id === selectedTopic);
    return found ? found.label : "";
  }, [selectedTopic, topicOptions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!selectedBatch || (!selectedTopic && !customTopic)) {
      setErrorMessage("Please select a batch and topic for the lecture.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        batchId: selectedBatch,
        topicId: selectedTopic || undefined,
        customTopic: selectedTopic === "custom" ? customTopic : undefined,
        lectureTitle: selectedTopicLabel || customTopic || "Lecture update",
        summary: notes,
        homework,
        recordingLink,
        durationHours: Number(duration),
        completed: true,
      };

      const response = await fetch("/api/teacher/lectures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "Unable to submit lecture report.");
      }

      setShowSuccess(true);
      setSelectedTopic("");
      setCustomTopic("");
      setDuration("2.0");
      setNotes("");
      setHomework("");
      setRecordingLink("");
      setErrorMessage("");
      setSelectedBatch("");
      setBatchDetails(null);

      setTimeout(() => setShowSuccess(false), 4000);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "Failed to send lecture update.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1e293b] mb-1">
          Log Lecture Progress
        </h1>
        <p className="text-gray-500 text-sm">
          Submit daily syllabus updates, recording links, notes, and homework logs.
        </p>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl flex items-start gap-3 shadow-sm"
          >
            <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-bold text-sm">Lecture Logged Successfully!</h4>
              <p className="text-xs text-green-700 mt-0.5">
                The syllabus checklist has been updated for {courseName || "your batch"}.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {errorMessage ? (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl">
          {errorMessage}
        </div>
      ) : null}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Select Batch <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedBatch}
                  onChange={(e) => {
                    setSelectedBatch(e.target.value);
                    setSelectedTopic("");
                    setCustomTopic("");
                  }}
                  required
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

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Course
              </label>
              <input
                type="text"
                value={courseName}
                disabled
                className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700"
              />
            </div>
          </div>

          <div className="space-y-3.5 border-t border-gray-50 pt-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Completed Syllabus Topic <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => {
                  setSelectedTopic(e.target.value);
                  if (e.target.value !== "custom") setCustomTopic("");
                }}
                disabled={!selectedBatch || loadingSyllabus}
                required={!customTopic}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] text-sm text-gray-700 transition disabled:opacity-50"
              >
                <option value="">-- Choose Syllabus Topic --</option>
                {topicOptions.length > 0 ? (
                  topicOptions.map((topic: any) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.moduleTitle} › {topic.label}
                    </option>
                  ))
                ) : (
                  <option value="">No topics loaded yet</option>
                )}
                <option value="custom">Other / Custom Topic...</option>
              </select>
            </div>

            {selectedTopic === "custom" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-1.5"
              >
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                  Enter Custom Topic Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Introduction to Git & GitHub basics"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  required={selectedTopic === "custom"}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] text-sm text-gray-700 transition"
                />
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 border-t border-gray-50 pt-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Duration (Hours) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] text-sm text-gray-700 transition appearance-none"
                >
                  <option value="1.0">1.0 Hour</option>
                  <option value="1.5">1.5 Hours</option>
                  <option value="2.0">2.0 Hours</option>
                  <option value="2.5">2.5 Hours</option>
                  <option value="3.0">3.0 Hours</option>
                </select>
                <Clock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Class Recording Link
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://zoom.us/rec/play/xyz..."
                  value={recordingLink}
                  onChange={(e) => setRecordingLink(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] text-sm text-gray-700 transition"
                />
                <Video size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5 border-t border-gray-50 pt-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
              Lecture Notes / Summary
            </label>
            <textarea
              rows={3}
              placeholder="Provide a brief summary of concepts covered in today's class..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] text-sm text-gray-700 transition resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
              Homework / Assignment for Students
            </label>
            <textarea
              rows={3}
              placeholder="Outline self-practice exercises or homework problems for this lecture..."
              value={homework}
              onChange={(e) => setHomework(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] text-sm text-gray-700 transition resize-none"
            />
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-2.5 text-xs text-[#2C4276] font-medium leading-relaxed">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-blue-600" />
            <p>
              <strong>Tip:</strong> Submitting this report automatically updates the batch's syllabus tracking progress in the Admin Panel and shares the recording, homework, and lecture notes with all students in the batch!
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#2C4276] hover:bg-[#1e2e54] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.005] active:scale-[0.99] shadow-md disabled:opacity-75"
          >
            <ClipboardCheck size={20} />
            {isSubmitting ? "Logging Lecture Progress..." : "Submit Lecture Report"}
          </button>
        </form>
      </div>
    </div>
  );
}
