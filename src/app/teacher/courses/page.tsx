"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, BarChart3, GraduationCap, ArrowRight, Layers } from "lucide-react";
import Link from "next/link";

export default function TeacherCourses() {
  const courses = [
    {
      id: "course-1",
      title: "MERN Stack Development",
      category: "Full Stack Development",
      duration: "6 Months",
      batchesCount: 3,
      studentsCount: 78,
      modulesCount: 24,
      progress: 82,
      description: "Comprehensive program covering MongoDB, Express, React, Node.js, Next.js, and TypeScript, including live server deployments and testing."
    },
    {
      id: "course-2",
      title: "React & Redux Advanced",
      category: "Web Development",
      duration: "3 Months",
      batchesCount: 1,
      studentsCount: 28,
      modulesCount: 12,
      progress: 68,
      description: "Advanced concepts including React Server Components, custom state slices with RTK Query, performance optimizations, and hook patterns."
    },
    {
      id: "course-3",
      title: "UI/UX Design Masterclass",
      category: "Creative Arts & Design",
      duration: "4 Months",
      batchesCount: 1,
      studentsCount: 35,
      modulesCount: 16,
      progress: 45,
      description: "Foundational and advanced design systems, visual hierarchy, responsive layout guidelines (iOS and Material Design), and Figma prototypes."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1e293b] mb-1">
          My Assigned Courses
        </h1>
        <p className="text-gray-500 text-sm">
          Overview of training curriculums, student registrations, and syllabus progress.
        </p>
      </div>

      {/* Course List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
          >
            <div className="p-6 space-y-4">
              {/* Category Badge & Progress */}
              <div className="flex justify-between items-center">
                <span className="bg-blue-50 text-[#2C4276] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {course.category}
                </span>
                <span className="text-xs text-gray-500 font-semibold">{course.duration}</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="font-bold text-[#1e293b] text-lg hover:text-[#2C4276] transition">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                  {course.description}
                </p>
              </div>

              {/* Course Stats Grid */}
              <div className="grid grid-cols-3 gap-3 py-3 border-y border-gray-50 text-center">
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Batches</p>
                  <p className="font-black text-[#1e293b] text-base mt-0.5">{course.batchesCount}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Students</p>
                  <p className="font-black text-[#1e293b] text-base mt-0.5">{course.studentsCount}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Modules</p>
                  <p className="font-black text-[#1e293b] text-base mt-0.5">{course.modulesCount}</p>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Layers size={14} className="text-[#2C4276]" />
                    Syllabus Completed
                  </span>
                  <span className="text-[#2C4276]">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2C4276] h-full rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions Links */}
            <div className="bg-gray-50 px-6 py-4 flex gap-4 border-t border-gray-100">
              <Link
                href="/teacher/take-lecture"
                className="flex-1 text-center bg-[#2C4276] hover:bg-[#1e2e54] text-white py-2 rounded-xl text-xs font-bold transition shadow-sm"
              >
                Log Lecture
              </Link>
              <Link
                href="/teacher/syllabus-progress"
                className="flex-1 text-center border border-gray-200 hover:border-gray-300 text-gray-700 bg-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 group"
              >
                Syllabus
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
