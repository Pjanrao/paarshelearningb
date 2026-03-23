"use client";

import { useState } from "react";
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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function MyCoursesPage() {
    const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

    // Mock data based on the screenshot
    const myCourses = [
        {
            id: 1,
            title: "Full Stack Internship Program",
            instructor: "Mr. Manish Sonawane",
            duration: "180 months",
            lectures: "72 Lectures",
            purchasedDate: "Dec 30, 2025",
            expiryDate: "Jun 28, 2028",
            thumbnail: "/images/course/javafull.jpeg",
            bannerText: "Learn Full-Stack Development from Beginner to Advanced levels.",
            level: "beginner",
            status: "Not Started"
        }
    ];

    return (
        <div className="pb-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-[#1e293b] tracking-tight">My Courses</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Browse all your purchased courses ({myCourses.length} courses)
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search courses..."
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
            </div>

            {/* Courses View */}
            <div className={viewType === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8"
                : "flex flex-col gap-6"
            }>
                <AnimatePresence mode="popLayout">
                    {myCourses.map((course) => (
                        <motion.div
                            key={course.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-black/5 border border-white/5 group transition-all duration-300 ${viewType === 'list' ? 'flex flex-row h-72' : ''
                                }`}
                        >
                            {/* Grid View Content */}
                            {viewType === 'grid' ? (
                                <>
                                    {/* Course Card Header (White Banner) */}
                                    <div className="relative h-52 bg-white flex overflow-hidden border-b border-gray-100 italic">
                                        {/* Beginner Badge */}
                                        <div className="absolute top-4 right-4 z-20">
                                            <span className="bg-[#0f172a] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-md flex items-center gap-1.5 border border-white/10">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                beginner
                                            </span>
                                        </div>

                                        <div className="flex-1 p-8 flex flex-col justify-center items-center z-10 text-center">
                                            <div className="space-y-1">
                                                <h2 className="text-[#0f172a] font-extrabold text-[24px] leading-[1.1] tracking-tight not-italic">
                                                    Learn <span className="text-[#2563eb]">Full-Stack</span> <br />
                                                    Development
                                                </h2>
                                                <p className="text-[#ef4444] text-xs font-bold tracking-wide not-italic">
                                                    from Beginner to Advanced levels.
                                                </p>
                                            </div>
                                            <div className="mt-5">
                                                <button className="bg-[#10b981] hover:bg-[#059669] text-white text-[10px] font-black px-5 py-2 rounded-lg shadow-md shadow-green-500/20 transition-all border border-green-400/20 not-italic uppercase tracking-wider">
                                                    More Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Section (Dark Blue) */}
                                    <div className="p-5 sm:p-6 bg-[#2C4276] text-white">
                                        <h3 className="font-bold text-xl mb-4 tracking-tight line-clamp-1">{course.title}</h3>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6">
                                            <div className="flex items-center gap-2 text-[11px] text-blue-100/70 uppercase font-bold tracking-wider">
                                                <User size={14} className="text-blue-400/80" />
                                                <span>{course.instructor}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] text-blue-100/70 uppercase font-bold tracking-wider">
                                                <Clock size={14} className="text-blue-400/80" />
                                                <span>{course.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] text-blue-100/70 uppercase font-bold tracking-wider">
                                                <PlayCircle size={14} className="text-blue-400/80" />
                                                <span>{course.lectures}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] text-blue-100/70 uppercase font-bold tracking-wider">
                                                <Calendar size={14} className="text-blue-400/80" />
                                                <span className="whitespace-nowrap">Purchased: {course.purchasedDate}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-white/10 pt-5">
                                            <div className="flex flex-col">
                                                <p className="text-[10px] text-blue-200/40 uppercase font-black tracking-widest mb-1.5">Current Status</p>
                                                <div className="flex items-center gap-2 text-white text-[11px] font-black bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                                    <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]"></div>
                                                    {course.status}
                                                </div>
                                            </div>
                                            <Link
                                                href={`/student/courses/${course.id}/view`}
                                                className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-black py-3 px-8 rounded-2xl transition-all shadow-xl shadow-blue-900/40 uppercase tracking-[0.2em] group"
                                            >
                                                Start <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                /* List View Content */
                                <>
                                    <div className="w-[450px] bg-white flex overflow-hidden italic relative flex-shrink-0">
                                        {/* Logo */}
                                        <div className="absolute top-2 left-6 z-20">
                                            <Image
                                                src="/images/logo/logo-wide.webp"
                                                alt="Logo"
                                                width={120}
                                                height={32}
                                                className="object-contain"
                                            />
                                        </div>

                                        {/* Beginner Badge */}
                                        <div className="absolute top-4 right-4 z-20">
                                            <span className="bg-[#0f172a] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-md flex items-center gap-1.5 border border-white/10">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                beginner
                                            </span>
                                        </div>

                                        <div className="flex-1 p-8 flex flex-col justify-center items-center z-10 text-center">
                                            <div className="space-y-2">
                                                <h2 className="text-[#0f172a] font-extrabold text-[36px] leading-[1.05] tracking-tight not-italic">
                                                    Learn <span className="text-[#2563eb]">Full-Stack</span> <br />
                                                    Development
                                                </h2>
                                                <p className="text-[#ef4444] text-xl font-bold tracking-wide not-italic">
                                                    from Beginner to Advanced levels.
                                                </p>
                                            </div>
                                            <div className="mt-8">
                                                <button className="bg-[#10b981] hover:bg-[#059669] text-white text-[11px] font-black px-8 py-3 rounded-lg shadow-md shadow-green-500/20 transition-all border border-green-400/20 not-italic uppercase tracking-widest">
                                                    More Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 p-8 bg-[#2C4276] text-white flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-2xl mb-4 tracking-tight">{course.title}</h3>
                                            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-6">
                                                <div className="flex items-center gap-2.5 text-[12px] text-blue-100/70 uppercase font-bold tracking-wider">
                                                    <User size={16} className="text-blue-400/80" />
                                                    <span>{course.instructor}</span>
                                                </div>
                                                <div className="flex items-center gap-2.5 text-[12px] text-blue-100/70 uppercase font-bold tracking-wider">
                                                    <Clock size={16} className="text-blue-400/80" />
                                                    <span>{course.duration}</span>
                                                </div>
                                                <div className="flex items-center gap-2.5 text-[12px] text-blue-100/70 uppercase font-bold tracking-wider">
                                                    <PlayCircle size={16} className="text-blue-400/80" />
                                                    <span>{course.lectures}</span>
                                                </div>
                                                <div className="flex items-center gap-2.5 text-[12px] text-blue-100/70 uppercase font-bold tracking-wider">
                                                    <Calendar size={16} className="text-blue-400/80" />
                                                    <span className="whitespace-nowrap">Purchased: {course.purchasedDate}</span>
                                                </div>
                                            </div>
                                            <p className="text-blue-200/40 text-sm mb-6">Expires: {course.expiryDate}</p>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-white/10 pt-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <p className="text-[10px] text-blue-200/40 uppercase font-black tracking-widest mb-1.5">Status</p>
                                                    <div className="flex items-center gap-2 text-white text-[12px] font-black bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                                                        <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]"></div>
                                                        {course.status}
                                                    </div>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/student/courses/${course.id}/view`}
                                                className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-black py-3.5 px-10 rounded-2xl transition-all shadow-xl shadow-blue-900/40 uppercase tracking-[0.2em] group"
                                            >
                                                Start <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}