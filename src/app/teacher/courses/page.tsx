"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, BarChart3, Layers, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function TeacherCourses() {
  const [teacherProfile, setTeacherProfile] = useState<any>(null);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [profileRes, batchRes] = await Promise.all([
          fetch("/api/teacher/profile"),
          fetch("/api/teacher/batches"),
        ]);

        if (!profileRes.ok) {
          const errorData = await profileRes.json().catch(() => null);
          throw new Error(errorData?.error || "Failed to load teacher profile");
        }

        if (!batchRes.ok) {
          const errorData = await batchRes.json().catch(() => null);
          throw new Error(errorData?.error || "Failed to load batches");
        }

        const profileData = await profileRes.json();
        const batchData = await batchRes.json();

        setTeacherProfile(profileData.teacher || null);
        setBatches(Array.isArray(batchData.batches) ? batchData.batches : []);
      } catch (err: any) {
        setError(err.message || "Unable to load assigned courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const assignedCourseNames = Array.from(
    new Set([
      ...(teacherProfile?.assignedCourses || []),
      ...batches.map((batch) => batch.courseId?.name).filter(Boolean),
    ])
  );

  const courses = assignedCourseNames.map((courseName) => {
    const relatedBatches = batches.filter((batch) => batch.courseId?.name === courseName);
    const courseInfo = relatedBatches[0]?.courseId || {};
    const batchesCount = relatedBatches.length;
    const studentsCount = relatedBatches.reduce((sum, batch) => sum + (batch.students?.length || 0), 0);
    const modulesCount = courseInfo.modules?.length || courseInfo.syllabus?.length || 0;
    const progress = batchesCount
      ? Math.round(relatedBatches.reduce((sum, batch) => sum + (batch.progress || 0), 0) / batchesCount)
      : 0;

    return {
      id: courseName,
      title: courseName,
      category: courseInfo.category?.name || "Assigned Course",
      duration: courseInfo.duration ? `${courseInfo.duration} Months` : "TBD",
      batchesCount,
      studentsCount,
      modulesCount,
      progress,
      description: courseInfo.shortDescription || "Assigned course details will appear once a batch is active.",
    };
  });

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
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1e293b] mb-1">My Assigned Courses</h1>
        <p className="text-gray-500 text-sm">
          Overview of your assigned curriculum, batches, and syllabus progress.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-gray-600">No assigned courses found. Please ask admin to assign courses first.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="bg-blue-50 text-[#2C4276] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {course.category}
                  </span>
                  <span className="text-xs text-gray-500 font-semibold">{course.duration}</span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-[#1e293b] text-lg hover:text-[#2C4276] transition">{course.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{course.description}</p>
                </div>

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
      )}
    </div>
  );
}
