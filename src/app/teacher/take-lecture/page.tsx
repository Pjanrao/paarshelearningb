"use client";

import { useState } from "react";
import { BookOpen, Users, ClipboardCheck, Video, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TeacherTakeLecture() {
  // Form State
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [duration, setDuration] = useState("2.0");
  const [notes, setNotes] = useState("");
  const [homework, setHomework] = useState("");
  const [recordingLink, setRecordingLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock course syllabus
  const courseSyllabus: Record<string, string[]> = {
    "course-1": [
      "Next.js App Router & Client vs Server Components",
      "Next.js Authentication Middleware & JWT Protection",
      "Mongoose Joins & Populate course schemas",
      "Redux Toolkit State Slices and Hydration",
      "REST APIs with Express and Mongoose Models",
      "Tailwind Responsive Design Principles"
    ],
    "course-2": [
      "RTK Query Mutation & Cache Revalidation",
      "React Server Components & Suspense Boundaries",
      "React Context API vs Redux Toolkit State Management",
      "Custom Hook patterns for fetching local storage tokens"
    ],
    "course-3": [
      "Design systems & Component Libraries",
      "Typography guidelines and HSL color tailoring",
      "Micro-animations & Interactive Figma prototypes"
    ]
  };

  const batches = [
    { id: "batch-a", name: "Batch A - Morning", courseId: "course-1" },
    { id: "batch-b", name: "Batch B - Evening", courseId: "course-1" },
    { id: "batch-c", name: "Batch C - Afternoon", courseId: "course-2" },
    { id: "batch-d", name: "Batch D - Weekend Fasttrack", courseId: "course-1" },
    { id: "batch-e", name: "Batch E - Morning Studio", courseId: "course-3" }
  ];

  const courses = [
    { id: "course-1", name: "MERN Stack Development" },
    { id: "course-2", name: "React & Redux Advanced" },
    { id: "course-3", name: "UI/UX Design Masterclass" }
  ];

  // Filter batches based on selected course
  const filteredBatches = selectedCourse
    ? batches.filter((b) => b.courseId === selectedCourse)
    : [];

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(e.target.value);
    setSelectedBatch("");
    setSelectedTopic("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !selectedBatch || (!selectedTopic && !customTopic)) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    // Mock submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form
      setSelectedCourse("");
      setSelectedBatch("");
      setSelectedTopic("");
      setCustomTopic("");
      setDuration("2.0");
      setNotes("");
      setHomework("");
      setRecordingLink("");

      // Hide success banner after 4 seconds
      setTimeout(() => setShowSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1e293b] mb-1">
          Log Lecture Progress
        </h1>
        <p className="text-gray-500 text-sm">
          Submit daily syllabus updates, recording links, notes, and homework logs.
        </p>
      </div>

      {/* Success Notification */}
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
                The syllabus checklist has been updated, and students have been notified of their notes/recording.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Form Panel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Course Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Select Course <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedCourse}
                  onChange={handleCourseChange}
                  required
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] text-sm text-gray-700 transition appearance-none"
                >
                  <option value="">-- Select Assigned Course --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
                <BookOpen size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Batch Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Select Batch <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  disabled={!selectedCourse}
                  required
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] text-sm text-gray-700 transition appearance-none disabled:opacity-50"
                >
                  <option value="">
                    {selectedCourse ? "-- Select Active Batch --" : "Select course first"}
                  </option>
                  {filteredBatches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
                <Users size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Topic Section */}
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
                disabled={!selectedCourse}
                required={!customTopic}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] text-sm text-gray-700 transition disabled:opacity-50"
              >
                <option value="">-- Choose Syllabus Topic --</option>
                {selectedCourse &&
                  courseSyllabus[selectedCourse]?.map((topic, idx) => (
                    <option key={idx} value={topic}>
                      {topic}
                    </option>
                  ))}
                <option value="custom">Other / Custom Topic...</option>
              </select>
            </div>

            {/* Custom Topic Input */}
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
            {/* Lecture Duration */}
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

            {/* Recording Link */}
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

          {/* Notes & Topics Covered */}
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

          {/* Homework / Assignments */}
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

          {/* Alert Tip */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-2.5 text-xs text-[#2C4276] font-medium leading-relaxed">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-blue-600" />
            <p>
              <strong>Tip:</strong> Submitting this report automatically updates the batch's syllabus tracking progress in the Admin Panel and shares the recording, homework, and lecture notes with all students in the batch!
            </p>
          </div>

          {/* Submit button */}
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
