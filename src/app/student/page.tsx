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
    User as UserIcon,
    Monitor,
    MapPin,
    HelpCircle,
    CheckCircle2,
    Percent,
    Home
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function StudentDashboard() {
    return (
        <>
            {/* Welcome Text Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1e293b] mb-1">
                        Welcome to Your Dashboard
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Manage your courses and track your progress
                    </p>
                </div>
                <div className="bg-blue-50 text-[#2C4276] px-4 py-2 rounded-lg text-xs font-semibold border border-blue-100 shadow-sm">
                    Pro Tip: Click on any card to explore more
                </div>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                {/* Card 1: Total Courses */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#3B82F6] rounded-2xl overflow-hidden text-white flex flex-col shadow-lg transition-all"
                >
                    <div className="p-5 flex-1 flex flex-col items-center justify-center text-center">
                        <div className="mb-2 bg-white/20 p-3 rounded-full">
                            <Monitor size={30} />
                        </div>
                        <h3 className="font-bold text-lg mb-1">My Courses</h3>
                        <p className="text-xs text-blue-50/80 font-medium">Continue your learning journey</p>
                    </div>
                    <Link
                        href="/student/my-courses"
                        className="bg-black/10 py-2 text-sm font-bold hover:bg-black/20 transition-colors border-t border-white/10 uppercase tracking-wider text-center"
                    >
                        Explore &rarr;
                    </Link>
                </motion.div>

                {/* Card 2: Available Courses */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#22C55E] rounded-2xl overflow-hidden text-white flex flex-col shadow-lg transition-all"
                >
                    <div className="p-5 flex-1 flex flex-col items-center justify-center text-center">
                        <div className="mb-2 bg-white/20 p-3 rounded-full">
                            <MapPin size={30} />
                        </div>
                        <h3 className="font-bold text-lg mb-1">Available Courses</h3>
                        <p className="text-xs text-green-50/80 font-medium">Browse all available courses</p>
                    </div>
                    <Link
                        href="/student/courses"
                        className="bg-black/10 py-2 text-sm font-bold hover:bg-black/20 transition-colors border-t border-white/10 uppercase tracking-wider text-center"
                    >
                        Explore &rarr;
                    </Link>
                </motion.div>

                {/* Card 3: Certificates */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#A855F7] rounded-2xl overflow-hidden text-white flex flex-col shadow-lg transition-all"
                >
                    <div className="p-5 flex-1 flex flex-col items-center justify-center text-center">
                        <div className="mb-2 bg-white/20 p-3 rounded-full">
                            <Award size={30} />
                        </div>
                        <h3 className="font-bold text-lg mb-1">Certificates</h3>
                        <p className="text-xs text-purple-50/80 font-medium">View your achievements</p>
                    </div>
                    <button className="bg-black/10 py-2 text-sm font-bold hover:bg-black/20 transition-colors border-t border-white/10 uppercase tracking-wider">
                        Explore &rarr;
                    </button>
                </motion.div>

                {/* Card 4: Practice Tests */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#F97316] rounded-2xl overflow-hidden text-white flex flex-col shadow-lg transition-all"
                >
                    <div className="p-5 flex-1 flex flex-col items-center justify-center text-center">
                        <div className="mb-2 bg-white/20 p-3 rounded-full">
                            <HelpCircle size={30} />
                        </div>
                        <h3 className="font-bold text-lg mb-1">Practice Tests</h3>
                        <p className="text-xs text-orange-50/80 font-medium">Practice with sample tests</p>
                    </div>
                    <button className="bg-black/10 py-2 text-sm font-bold hover:bg-black/20 transition-colors border-t border-white/10 uppercase tracking-wider">
                        Explore &rarr;
                    </button>
                </motion.div>
            </div>

            {/* Panels Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                {/* Recent Activities */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
                    <div className="bg-gray-50/50 p-4 border-b border-gray-100">
                        <h3 className="text-[#1e293b] font-bold text-lg flex items-center gap-2">
                            Recent Activities
                        </h3>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex items-center gap-4 p-3 rounded-xl bg-blue-50/30 border border-blue-100 transition-all hover:shadow-sm">
                            <div className="bg-blue-100 p-2.5 rounded-lg text-blue-600 border border-blue-200">
                                <Monitor size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#1e293b] text-sm">No new course available.</h4>
                                <p className="text-gray-500 text-xs mt-0.5 font-medium">Purchase new course</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50/30 border border-green-100 transition-all hover:shadow-sm">
                            <div className="bg-green-100 p-2.5 rounded-lg text-green-600 border border-green-200">
                                <CheckCircle2 size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#1e293b] text-sm">1 Total Ongoing Courses.</h4>
                                <p className="text-gray-500 text-xs mt-0.5 font-medium">No Courses are About to Complete</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Downloadables */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
                    <div className="bg-gray-50/50 p-4 border-b border-gray-100">
                        <h3 className="text-[#1e293b] font-bold text-lg flex items-center gap-2">
                            Downloadables and Practice Tests
                        </h3>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex items-center gap-4 p-3 rounded-xl bg-purple-50/30 border border-purple-100 transition-all hover:shadow-sm">
                            <div className="bg-purple-100 p-2.5 rounded-lg text-purple-600 border border-purple-200">
                                <Award size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#1e293b] text-sm">No Certificates available for download.</h4>
                                <p className="text-gray-500 text-xs mt-0.5 font-medium">No certificates available</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-50/30 border border-orange-100 transition-all hover:shadow-sm">
                            <div className="bg-orange-100 p-2.5 rounded-lg text-orange-600 border border-orange-200">
                                <Percent size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#1e293b] text-sm">No Practice Tests are available.</h4>
                                <p className="text-gray-500 text-xs mt-0.5 font-medium">No practice tests available</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}