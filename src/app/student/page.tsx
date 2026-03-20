"use client";

import { motion } from "framer-motion";
import {
    BookOpen,
    GraduationCap,
    Clock,
    Award,
    Search,
    LayoutDashboard,
    Bell,
    Settings,
    User as UserIcon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const mockCourses = [
    {
        id: 1,
        title: "Full Stack Web Development",
        progress: 65,
        instructor: "Dr. Arvind Pawar",
        image: "/images/blog/blog-1.jpg",
        lessons: 24,
    },
    {
        id: 2,
        title: "Advanced React Patterns",
        progress: 30,
        instructor: "Sameer Shaikh",
        image: "/images/blog/blog-2.jpg",
        lessons: 12,
    },
];

export default function StudentDashboard() {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#2C4276] text-white hidden lg:flex flex-col">
                <div className="p-6">
                    <Image
                        src="/images/logo/logo-wide.webp"
                        alt="Logo"
                        width={180}
                        height={50}
                        className="brightness-0 invert"
                    />
                </div>
                <nav className="flex-1 mt-10 px-4 space-y-2">
                    <Link href="#" className="flex items-center gap-3 bg-white/10 p-3 rounded-xl">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link href="#" className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition-colors">
                        <BookOpen size={20} /> My Courses
                    </Link>
                    <Link href="#" className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition-colors">
                        <Award size={20} /> Certificates
                    </Link>
                    <Link href="/admin/meetings" className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition-colors">
                        <BookOpen size={20} /> Meetings
                    </Link>
                    <Link href="#" className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition-colors">
                        <Settings size={20} /> Settings
                    </Link>
                </nav>
                <div className="p-6 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center">
                            <UserIcon size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Student Account</p>
                            <Link href="/signin" className="text-xs text-blue-300 hover:text-white">Sign Out</Link>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="bg-white border-b border-gray-100 p-4 sm:p-6 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-2 text-gray-400 lg:hidden">
                        <Image src="/favicon.png" alt="Logo" width={32} height={32} priority />
                    </div>
                    <div className="relative max-w-md w-full hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search your courses..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-blue-600 relative">
                            <Bell size={22} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-gray-100 mx-2"></div>
                        <span className="text-gray-900 font-bold hidden sm:inline">Welcome back, Student!</span>
                    </div>
                </header>

                <div className="p-6 sm:p-8 max-w-6xl mx-auto">
                    {/* Welcome Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-blue-600 to-[#2C4276] rounded-3xl p-8 text-white relative overflow-hidden mb-10 shadow-xl"
                    >
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-2">Advance your skills today!</h2>
                            <p className="text-blue-100 max-w-md">You've completed 65% of your current course. Keep up the great work and earn your certificate!</p>
                            <button className="mt-6 bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg">
                                Continue Learning
                            </button>
                        </div>
                        <GraduationCap className="absolute right-[-20px] bottom-[-20px] text-white/10 w-64 h-64 -rotate-12" />
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {[
                            { label: "Courses In Progress", value: "2", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
                            { label: "Completed Lessons", value: "36", icon: Clock, color: "text-purple-600", bg: "bg-purple-50" },
                            { label: "Certificates Earned", value: "0", icon: Award, color: "text-amber-600", bg: "bg-amber-50" }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className={`${stat.bg} ${stat.color} p-4 rounded-xl`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* My Courses */}
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <BookOpen className="text-blue-600" /> My Current Courses
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mockCourses.map((course, i) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                            >
                                <div className="flex flex-col sm:flex-row">
                                    <div className="sm:w-32 h-32 relative">
                                        <Image src={course.image} alt={course.title} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 p-5">
                                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{course.title}</h4>
                                        <p className="text-xs text-gray-500 mt-1">Instructor: {course.instructor}</p>

                                        <div className="mt-4">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-bold text-gray-700">{course.progress}% Completed</span>
                                                <span className="text-xs text-gray-400">{course.lessons} Lessons</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5 focus:text-black">
                                                <div
                                                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000"
                                                    style={{ width: `${course.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
