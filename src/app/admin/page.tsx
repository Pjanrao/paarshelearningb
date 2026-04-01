"use client";

import { useEffect, useState } from "react";
import StatsCard from "@/components/dashboard/StatsCard";
import {
    Users,
    BookOpen,
    DollarSign,
    ShoppingCart,
    UserPlus,
    FileText,
    CreditCard,
} from "lucide-react";
import SalesChart from "@/components/dashboard/SalesChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCourses: 0,
        totalSales: 0,
        totalRevenue: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/dashboard/stats");
                const data = await res.json();
                setStats(data.stats);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="p-6 text-gray-500">Loading dashboard...</div>
        );
    }

    return (
        <div className="space-y-8">

            {/* 🔥 HEADER */}
            <h2 className="text-2xl font-bold text-gray-800">
                Admin Dashboard
            </h2>

            {/* 🔥 STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <StatsCard
                    title="Total Users"
                    value={stats.totalStudents}
                    subtitle="All registered users"
                    icon={<Users size={20} />}
                />

                <StatsCard
                    title="Total Courses"
                    value={stats.totalCourses}
                    subtitle="Available courses"
                    icon={<BookOpen size={20} />}
                />

                <StatsCard
                    title="Sales"
                    value={stats.totalSales}
                    subtitle="Students with payments"
                    icon={<ShoppingCart size={20} />}
                />

                <StatsCard
                    title="Revenue"
                    value={`₹${stats.totalRevenue}`}
                    subtitle="Total collected amount"
                    icon={<DollarSign size={20} />}
                />

            </div>

            {/* 🔥 ACTIVITY + COURSES */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* ✅ Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition"
                >
                    <h2 className="text-lg font-semibold mb-6 text-gray-800">
                        Recent Activity
                    </h2>

                    <div className="space-y-5">
                        {[
                            {
                                text: "New student registered",
                                icon: <UserPlus size={16} className="text-green-500" />,
                            },
                            {
                                text: "Course enrollment ongoing",
                                icon: <BookOpen size={16} className="text-blue-500" />,
                            },
                            {
                                text: "New blog published",
                                icon: <FileText size={16} className="text-purple-500" />,
                            },
                            {
                                text: "Payment received",
                                icon: <CreditCard size={16} className="text-yellow-500" />,
                            },
                        ].map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    {item.icon}
                                </div>
                                <p className="text-gray-600 text-sm">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* ✅ Popular Courses */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition"
                >
                    <h2 className="text-lg font-semibold mb-6 text-gray-800">
                        Popular Courses
                    </h2>

                    <div className="space-y-4">
                        {[
                            "Full Stack Development",
                            "Data Science",
                            "UI/UX Design",
                        ].map((course, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-4 rounded-xl transition"
                            >
                                <span className="text-gray-700 text-sm font-medium">
                                    {course}
                                </span>

                                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-600">
                                    Trending
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

            </div>

            {/* 🔥 CHARTS */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">
                        Sales Distribution
                    </h2>
                    <SalesChart />
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">
                        Revenue Trends
                    </h2>
                    <RevenueChart />
                </div>

            </div>

        </div>
    );
}