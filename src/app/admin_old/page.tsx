"use client";

import { motion } from "framer-motion";
import {
    Users,
    MessageSquare,
    FileText,
    Settings,
    TrendingUp,
    Bell,
    LogOut,
    LayoutDashboard,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AdminDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[60] lg:hidden animate-in fade-in duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-64 bg-[#2C4276] text-white z-[70] transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:flex flex-col`}>
                <div className="p-6 flex items-center justify-between">
                    <Image
                        src="/images/logo/logo-wide.webp"
                        alt="Logo"
                        width={180}
                        height={50}
                        className="brightness-0 invert"
                    />
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>
                <nav className="flex-1 mt-10 px-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 bg-white/10 p-3 rounded-xl">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link href="/admin/blogs" className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition-colors">
                        <FileText size={20} /> Manage Blogs
                    </Link>
                    <Link href="/admin/testimonials" className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition-colors">
                        <MessageSquare size={20} /> Testimonials
                    </Link>
                    <Link href="#" className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition-colors">
                        <Settings size={20} /> Settings
                    </Link>
                </nav>
                <div className="p-6 border-t border-white/10">
                    <Link href="/signin" className="flex items-center gap-3 text-red-300 hover:text-red-100 transition-colors">
                        <LogOut size={20} /> Logout
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="bg-white border-b border-gray-100 p-4 sm:p-6 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-[#2C4276] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Admin Overview</h2>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button className="p-2 text-gray-400 hover:text-blue-600 relative">
                            <Bell size={22} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-gray-100 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                A
                            </div>
                            <span className="text-gray-900 font-bold hidden sm:inline">Admin User</span>
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    {/* Welcome */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10"
                    >
                        <h1 className="text-3xl font-extrabold text-[#2C4276]">Welcome back, Admin!</h1>
                        <p className="text-gray-500 mt-1">Here's what's happening with your platform today.</p>
                    </motion.div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {[
                            { label: "Total Students", value: "1,248", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                            { label: "Pending Testimonials", value: "12", icon: MessageSquare, color: "text-amber-600", bg: "bg-amber-50" },
                            { label: "Blog Posts", value: "48", icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
                            { label: "Active Courses", value: "24", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className={`${stat.bg} ${stat.color} p-4 rounded-xl`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm whitespace-nowrap">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Manage Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Link href="/admin/blogs" className="group">
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group-hover:border-blue-200">
                                <div className="bg-blue-50 text-blue-600 w-14 h-14 flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                                    <FileText size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Blog Content</h3>
                                <p className="text-gray-500 mb-6 font-medium">Create, edit, and publish blogs to keep your students updated with latest trends.</p>
                                <span className="text-blue-600 font-bold inline-flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                    Go to Blogs →
                                </span>
                            </div>
                        </Link>

                        <Link href="/admin/testimonials" className="group">
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group-hover:border-amber-200">
                                <div className="bg-amber-50 text-amber-600 w-14 h-14 flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                                    <MessageSquare size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Moderate Testimonials</h3>
                                <p className="text-gray-500 mb-6 font-medium">Review student success stories and choose which ones to feature on the homepage.</p>
                                <span className="text-amber-600 font-bold inline-flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                    View Testimonials →
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
