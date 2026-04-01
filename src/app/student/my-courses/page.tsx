"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    LayoutGrid,
    List,
    User,
    Clock,
    BookOpen,
    Calendar,
    PlayCircle,
    ChevronRight,
    Loader2,
    ShoppingBag
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import CourseCard from "@/components/SharedComponent/Course/CourseCard";
import { useGetCoursesQuery } from "@/redux/api/courseApi";

export default function MyCoursesPage() {
    const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
    const [myCourses, setMyCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch suggested courses if no purchased courses
    const { data: suggestedData } = useGetCoursesQuery({
        limit: 4,
        status: "active" as any,
    });

    const suggestedCourses = suggestedData?.courses || [];

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get("/api/student/my-courses");
                setMyCourses(res.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = myCourses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-[#2C4276] animate-spin mb-4" />
                <p className="text-gray-500 font-medium font-sans">Loading your courses...</p>
            </div>
        );
    }

    return (
        <div className="pb-8 font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-[#1e293b] tracking-tight">My Courses</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {myCourses.length > 0
                            ? `Browse all your purchased courses (${myCourses.length} courses)`
                            : "Manage your learning journey"}
                    </p>
                </div>

                {myCourses.length > 0 && (
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-72">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] transition-all text-sm shadow-sm text-gray-900 placeholder:text-gray-400"
                            />
                        </div>
                        <div className="flex bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm">
                            <button
                                onClick={() => setViewType('grid')}
                                className={`p-2 rounded-xl transition-all ${viewType === 'grid' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <LayoutGrid size={20} />
                            </button>
                            <button
                                onClick={() => setViewType('list')}
                                className={`p-2 rounded-xl transition-all ${viewType === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <List size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Courses View or Empty State */}
            {myCourses.length > 0 ? (
                <div className={viewType === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
                    : "flex flex-col gap-6 max-w-5xl mx-auto md:mx-0"
                }>
                    <AnimatePresence mode="popLayout">
                        {filteredCourses.map((course) => (
                            <motion.div
                                key={course.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-900/10 border border-slate-100 group transition-all duration-300 hover:-translate-y-1.5 flex ${viewType === 'list' ? 'flex-col md:flex-row h-auto md:h-52' : 'flex-col'}`}
                            >
                                {viewType === 'grid' ? (
                                    <>
                                        {/* Course Image Header - Grid View */}
                                        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                                            <img
                                                src={course.thumbnail || "/images/course/default.jpeg"}
                                                alt={course.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {/* Gradient Overlay for better badge contrast */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                                            <div className="absolute top-3 left-3 z-20">
                                                <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 border border-white/50 shadow-sm">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                                                    {course.level || "ADVANCED"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Unified Body */}
                                        <div className="p-2 flex-1 flex flex-col bg-white">
                                            <h2 className="text-slate-800 font-bold text-base leading-snug tracking-tight line-clamp-2 mb-1.5 group-hover:text-blue-600 transition-colors">
                                                {course.title}
                                            </h2>

                                            <div className="space-y-1  mt-auto">
                                                <div className="flex items-center gap-3 text-slate-500 text-[13px] font-medium">
                                                    <div className="w-8 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                                        <User size={14} />
                                                    </div>
                                                    <span className="line-clamp-1">{course.instructor}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-slate-500 text-[13px] font-medium">
                                                    <div className="w-8 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                                        <Clock size={14} />
                                                    </div>
                                                    <span>{course.duration}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-slate-500 text-[13px] font-medium">
                                                    <div className="w-8 h-5 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                                                        <Calendar size={14} />
                                                    </div>
                                                    <span>Purchased: {course.purchasedDate}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Separated Footer */}
                                        <div className="px-3 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between mt-auto">
                                            <div className="flex flex-col">
                                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1.5">Status</p>
                                                <div className="flex items-center gap-1.5 text-slate-700 text-[11px] font-bold bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                                                    {course.status}
                                                </div>
                                            </div>
                                            <Link
                                                href={`/student/courses/${course.id}/view`}
                                                className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-black py-2.5 px-6 rounded-xl transition-all shadow-md hover:shadow-blue-500/20 hover:-translate-y-0.5 uppercase tracking-wide group"
                                            >
                                                Start <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Course Image Header - List View */}
                                        <div className="w-full md:w-64 relative flex-shrink-0 h-40 md:h-auto overflow-hidden bg-slate-100">
                                            <img
                                                src={course.thumbnail || "/images/course/default.jpeg"}
                                                alt={course.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:bg-gradient-to-r"></div>

                                            <div className="absolute top-3 left-3 z-20">
                                                <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 border border-white/50 shadow-sm">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                                                    {course.level || "ADVANCED"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Unified Body and Footer - List View */}
                                        <div className="flex-1 p-3 md:p-4 bg-white flex flex-col justify-between">
                                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                                                <div className="flex-1">
                                                    <h2 className="text-slate-800 font-extrabold text-xl md:text-2xl leading-tight tracking-tight line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
                                                        {course.title}
                                                    </h2>
                                                    <div className="flex flex-wrap items-center gap-2.5 text-slate-500 text-[12px] font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                                                <User size={14} />
                                                            </div>
                                                            <span>{course.instructor}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                                                <Clock size={14} />
                                                            </div>
                                                            <span>{course.duration}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                                                                <Calendar size={14} />
                                                            </div>
                                                            <span>{course.purchasedDate}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-100">
                                                <div className="flex flex-col">
                                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1.5">Current Status</p>
                                                    <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                                                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                                                        {course.status}
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/student/courses/${course.id}/view`}
                                                    className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-black py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-blue-500/20 hover:-translate-y-0.5 uppercase tracking-wide group"
                                                >
                                                    Start Course <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                /* Empty State Design */
                <div className="space-y-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[2.5rem] p-12 text-center shadow-2xl shadow-black/5 border border-gray-100 max-w-3xl mx-auto"
                    >
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-100 shadow-inner">
                            <BookOpen className="text-[#2C4276]" size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-[#1e293b] mb-4">No courses assigned yet!</h2>
                        <p className="text-gray-500 max-w-md mx-auto mb-10 leading-relaxed font-medium">
                            It looks like you haven&apos;t been assigned any courses by the admin. Start your learning journey today by exploring our latest professional courses.
                        </p>
                        <Link
                            href="/student/courses"
                            className="inline-flex items-center gap-3 bg-[#2C4276] hover:bg-[#1e2e54] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-900/20 active:scale-95 group"
                        >
                            <ShoppingBag size={20} />
                            Browse All Courses
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                    {/* Suggestions Section */}
                    {suggestedCourses.length > 0 && (
                        <div className="mt-20">
                            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
                                <div>
                                    <h3 className="text-3xl font-black text-[#1e293b] tracking-tight">Suggested for You</h3>
                                    <p className="text-gray-500 text-sm mt-1 font-medium">Trending professional courses to jumpstart your career</p>
                                </div>
                                <Link href="/student/courses" className="text-[#2C4276] font-bold text-sm hover:underline flex items-center gap-1 group">
                                    View all courses <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {suggestedCourses.map((course: any, index: number) => (
                                    <motion.div
                                        key={course._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <CourseCard course={course} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}