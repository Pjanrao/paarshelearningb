"use client";

import { motion } from "framer-motion";
import {
    Wallet,
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
    Home,
    ClipboardCheck
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useGetStudentTestsQuery } from "@/redux/api/practiceTestApi";
import { useGetMyCoursesQuery, useGetCoursesQuery } from "@/redux/api/courseApi";
import { useGetWalletStatsQuery } from "@/redux/api/referralApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";

export default function StudentDashboard() {
    const user = useSelector((state: RootState) => state.auth.user || state.auth.studentUser);
    const userId = user?._id || user?.id;

    // Data Fetching
    const { data: tests, isLoading: isLoadingTests } = useGetStudentTestsQuery();
    const { data: myCourses, isLoading: isLoadingMyCourses } = useGetMyCoursesQuery();
    const { data: availableCoursesData, isLoading: isLoadingAvailable } = useGetCoursesQuery({ status: "active" as any });
    const { data: walletStats } = useGetWalletStatsQuery();

    const [certificatesCount, setCertificatesCount] = useState(0);
    const [isLoadingCerts, setIsLoadingCerts] = useState(false);

    useEffect(() => {
        if (userId) {
            setIsLoadingCerts(true);
            fetch(`/api/certificates?studentId=${userId}&limit=1`)
                .then(res => res.json())
                .then(data => {
                    setCertificatesCount(data.total || data.certificates?.length || 0);
                })
                .catch(err => console.error("Error fetching certs:", err))
                .finally(() => setIsLoadingCerts(false));
        }
    }, [userId]);

    const activeTestsCount = tests?.length || 0;
    const purchasedCoursesCount = myCourses?.length || 0;
    const availableCoursesCount = availableCoursesData?.total || 0;
    const walletBalance = walletStats?.balance || 0;

    // Recent Activities Logic
    const recentActivities = [
        ...(myCourses || []).slice(0, 2).map((c: any) => ({
            id: `course-${c.id}`,
            title: c.title,
            subtitle: "Newly Enrolled",
            icon: <Monitor size={20} />,
            color: "blue"
        })),
        ...(tests || []).filter((t: any) => t.status === "completed").slice(0, 1).map((t: any) => ({
            id: `test-${t._id}`,
            title: t.name,
            subtitle: "Test Attempted",
            icon: <CheckCircle2 size={20} />,
            color: "green"
        }))
    ].slice(0, 2);

    // Fallback if no activities
    const displayActivities = recentActivities.length > 0 ? recentActivities : [
        {
            id: "default-1",
            title: "No new course available.",
            subtitle: "Purchase new course",
            icon: <Monitor size={20} />,
            color: "blue"
        },
        {
            id: "default-2",
            title: "Ongoing Learning.",
            subtitle: "Stay consistent with your goals",
            icon: <CheckCircle2 size={20} />,
            color: "green"
        }
    ];

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
                        <p className="text-xs text-blue-50/80 font-medium">
                            {isLoadingMyCourses ? "Loading..." : `${purchasedCoursesCount} Enrolled Courses`}
                        </p>
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
                        <p className="text-xs text-green-50/80 font-medium">
                            {isLoadingAvailable ? "Loading..." : `${availableCoursesCount} Courses for You`}
                        </p>
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
                        <h3 className="font-bold text-lg mb-1">My Certificates</h3>
                        <p className="text-xs text-purple-50/80 font-medium">
                            {isLoadingCerts ? "Loading..." : `${certificatesCount} Certificates Earned`}
                        </p>
                    </div>
                    <Link
                        href="/student/certificates"
                        className="bg-black/10 py-2 text-sm font-bold hover:bg-black/20 transition-colors border-t border-white/10 uppercase tracking-wider text-center"
                    >
                        View &rarr;
                    </Link>
                </motion.div>

                {/* Card 4: Practice Tests */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#F97316] rounded-2xl overflow-hidden text-white flex flex-col shadow-lg transition-all"
                >
                    <div className="p-5 flex-1 flex flex-col items-center justify-center text-center">
                        <div className="mb-2 bg-white/20 p-3 rounded-full">
                            <ClipboardCheck size={30} />
                        </div>
                        <h3 className="font-bold text-lg mb-1">Practice Tests</h3>
                        <p className="text-xs text-orange-50/80 font-medium">
                            {isLoadingTests ? "Checking tests..." : `${activeTestsCount} Active Tests Available`}
                        </p>
                    </div>
                    <Link
                        href="/student/tests"
                        className="bg-black/10 py-2 text-sm font-bold hover:bg-black/20 transition-colors border-t border-white/10 uppercase tracking-wider text-center"
                    >
                        Take Test &rarr;
                    </Link>
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
                        {displayActivities.map((activity) => (
                            <div key={activity.id} className={`flex items-center gap-4 p-3 rounded-xl bg-${activity.color}-50/30 border border-${activity.color}-100 transition-all hover:shadow-sm`}>
                                <div className={`bg-${activity.color}-100 p-2.5 rounded-lg text-${activity.color}-600 border border-${activity.color}-200`}>
                                    {activity.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1e293b] text-sm">{activity.title}</h4>
                                    <p className="text-gray-500 text-xs mt-0.5 font-medium">{activity.subtitle}</p>
                                </div>
                            </div>
                        ))}
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
                                <Wallet size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#1e293b] text-sm">
                                    {walletBalance > 0 ? `₹${walletBalance} Rewards Available` : "No wallet activities found."}
                                </h4>
                                <p className="text-gray-500 text-xs mt-0.5 font-medium">
                                    {walletBalance > 0 ? "Withdraw your earnings" : "Start learning to earn rewards"}
                                </p>
                            </div>
                        </div>
                        <Link href="/student/tests" className="flex items-center gap-4 p-4 rounded-xl bg-orange-50/30 border border-orange-100 transition-all hover:shadow-sm hover:translate-x-1 cursor-pointer">
                            <div className="bg-orange-100 p-2.5 rounded-lg text-orange-600 border border-orange-200">
                                <Percent size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#1e293b] text-sm">
                                    {activeTestsCount > 0 ? `${activeTestsCount} Practice Tests Ready` : "No Practice Tests available."}
                                </h4>
                                <p className="text-gray-500 text-xs mt-0.5 font-medium">
                                    {activeTestsCount > 0 ? "Click to start practicing" : "Check back later for tests"}
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}