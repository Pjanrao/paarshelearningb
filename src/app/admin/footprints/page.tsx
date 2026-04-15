"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Loader2, Clock, MapPin, User as UserIcon, Calendar, ChevronDown, ChevronUp, Layers } from "lucide-react";

interface Visit {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        role: string;
    } | null;
    pathname: string;
    title: string;
    entryTime: string;
    exitTime: string;
    duration: number; // in seconds
    createdAt: string;
}

export default function TrackTimePage() {
    const [visits, setVisits] = useState<Visit[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [visitsPerPage, setVisitsPerPage] = useState<number | "all">(10);
    const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});

    const groupedVisits = useMemo(() => {
        const groups: Record<string, { user: Visit['userId'], visits: Visit[] }> = {};
        visits.forEach(visit => {
            const key = visit.userId?._id || `guest-${visit.userId?.name || 'unnamed'}`;
            if (!groups[key]) {
                groups[key] = { user: visit.userId, visits: [] };
            }
            groups[key].visits.push(visit);
        });
        return groups;
    }, [visits]);

    const toggleUser = (key: string) => {
        setExpandedUsers(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const fetchVisits = async () => {
        try {
            setLoading(true);
            const limit = visitsPerPage === "all" ? 10000 : visitsPerPage;
            const response = await fetch(
                `/api/admin/analytics/track-time?search=${searchQuery}&page=${currentPage}&limit=${limit}`
            );

            if (!response.ok) throw new Error("Failed to fetch tracking data");

            const data = await response.json();
            setVisits(data.visits || []);
            setTotalPages(data.pagination?.totalPages || 1);
            setTotal(data.pagination?.total || 0);
        } catch (error: any) {
            console.error("Error fetching visits:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchVisits();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery, currentPage, visitsPerPage]);

    const formatDuration = (seconds: number) => {
        if (seconds < 60) return `${seconds}s`;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="bg-gray-50 h-full">
            <div className="mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#2C4276]">Footprints</h1>
                        <p className="text-gray-500 mt-1">Monitor user engagement and time spent on pages</p>
                    </div>
                    <div className="relative w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search user or URL..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10 pr-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-[#2C4276] w-full md:w-64 shadow-md bg-white text-gray-700"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-[#2C4276]" size={40} />
                        <p className="text-gray-500 animate-pulse font-medium">Loading activity logs...</p>
                    </div>
                ) : visits.length === 0 ? (
                    <div className="text-center py-20 px-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="text-gray-300" size={32} />
                        </div>
                        <p className="text-gray-500 text-lg font-semibold">No activity found</p>
                        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#f8fafc] border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-[#2C4276] uppercase tracking-wider">User</th>
                                        <th className="px-6 py-4 text-xs font-bold text-[#2C4276] uppercase tracking-wider">Pages Visited</th>
                                        <th className="px-6 py-4 text-xs font-bold text-[#2C4276] uppercase tracking-wider">Last Active</th>
                                        <th className="px-6 py-4 text-xs font-bold text-[#2C4276] uppercase tracking-wider text-right">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {Object.entries(groupedVisits).map(([key, group]) => (
                                        <React.Fragment key={key}>
                                            <tr 
                                                className="hover:bg-gray-50/50 transition-colors group cursor-pointer bg-white" 
                                                onClick={() => toggleUser(key)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#2C4276] font-bold group-hover:scale-110 transition-transform">
                                                            <UserIcon size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900 leading-none">
                                                                {group.user?.name || "Guest User"}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {group.user?.email || "No email"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-semibold text-xs border border-blue-100">
                                                        <Layers size={14} />
                                                        {group.visits.length} page{group.visits.length > 1 ? 's' : ''}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={14} className="text-gray-400" />
                                                        {formatDateTime(group.visits[0].exitTime)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                                        {expandedUsers[key] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                    </button>
                                                </td>
                                            </tr>

                                            {expandedUsers[key] && (
                                                <tr>
                                                    <td colSpan={4} className="p-0 border-b border-gray-100">
                                                        <div className="bg-gray-50/50 py-4 px-6 shadow-inner">
                                                            <div className="rounded-lg overflow-hidden border border-gray-200">
                                                                <table className="w-full text-left bg-white">
                                                                    <thead>
                                                                        <tr className="bg-gray-50/80 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                                                            <th className="py-3 px-4">Page Name</th>
                                                                            <th className="py-3 px-4">Entry Time</th>
                                                                            <th className="py-3 px-4">Exit Time</th>
                                                                            <th className="py-3 px-4 text-right">Time Spent</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-gray-100">
                                                                        {group.visits.map((visit) => (
                                                                            <tr key={visit._id} className="hover:bg-gray-50/30 transition-colors">
                                                                                <td className="py-3 px-4">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <div className="p-1 rounded bg-purple-50 text-purple-600">
                                                                                            <MapPin size={12} />
                                                                                        </div>
                                                                                        <span className="text-sm font-medium text-gray-800 truncate max-w-[250px]" title={visit.title}>
                                                                                            {visit.title || "Unknown Page"}
                                                                                        </span>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-600">
                                                                                    {formatDateTime(visit.entryTime)}
                                                                                </td>
                                                                                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-600">
                                                                                    {formatDateTime(visit.exitTime)}
                                                                                </td>
                                                                                <td className="py-3 px-4 whitespace-nowrap text-right">
                                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white text-gray-700 font-semibold text-xs border border-gray-200 shadow-sm">
                                                                                        {formatDuration(visit.duration)}
                                                                                    </span>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500 font-medium">
                                    Showing <span className="text-gray-900">{visits.length}</span> of <span className="text-gray-900">{total}</span> records
                                </span>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <span>Show:</span>
                                    <select
                                        value={visitsPerPage}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setVisitsPerPage(val === "all" ? "all" : Number(val));
                                            setCurrentPage(1);
                                        }}
                                        className="border px-2 py-1 rounded-lg text-sm bg-white"
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                        <option value="all">All</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 text-sm font-semibold rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
                                >
                                    Previous
                                </button>
                                <div className="flex items-center gap-1.5 px-3 font-semibold text-sm text-gray-700">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 text-sm font-semibold rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
