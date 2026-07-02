"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
    Search,
    Download,
    Eye,
    FileText,
    Loader2,
    Laptop,
    X,
    MapPin,
    Calendar,
    Phone,
    Mail,
    ChevronLeft,
    ChevronRight,
    Users
} from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CourseRegistrationsAdmin() {
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const limit = 10;

    // View Modal
    const [selectedRegistration, setSelectedRegistration] = useState<any | null>(null);

    useEffect(() => {
        fetchRegistrations();
    }, [page, searchTerm]);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/admin/course-registrations?page=${page}&limit=${limit}&search=${searchTerm}`);
            setRegistrations(res.data.registrations || []);
            setTotalPages(res.data.totalPages || 1);
            setTotalRecords(res.data.total || 0);
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to fetch registrations");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchRegistrations();
    };

    const handleExport = async () => {
        try {
            const toastId = toast.loading("Preparing export...");
            const res = await axios.get("/api/admin/course-registrations?export=true");

            if (res.data && res.data.registrations) {
                const csvData = [
                    ["Sr. No.", "Full Name", "Email", "Contact", "Address", "College Name", "Course", "Attend Mode", "Joining Date", "Laptop?", "Referral Name", "Preferred Location", "Note", "Registration Date"],
                    ...res.data.registrations.map((r: any, index: number) => [
                        index + 1,
                        `"${r.name}"`,
                        `"${r.email}"`,
                        `"${r.contact}"`,
                        `"${r.address}"`,
                        `"${r.collegeName}"`,
                        `"${r.course}"`,
                        `"${r.attendMode}"`,
                        r.preferredJoiningDate ? format(new Date(r.preferredJoiningDate), "yyyy-MM-dd") : "",
                        r.hasLaptop ? "Yes" : "No",
                        `"${r.referralName || ""}"`,
                        `"${r.preferredLocation || ""}"`,
                        `"${(r.note || "").replace(/"/g, '""')}"`,
                        format(new Date(r.createdAt), "yyyy-MM-dd HH:mm:ss")
                    ])
                ];

                const csvContent = csvData.map(row => row.join(",")).join("\n");
                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `course_registrations_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                toast.success("Export successful!", { id: toastId });
            } else {
                toast.error("No data found for export.", { id: toastId });
            }
        } catch (error) {
            console.error("Export error:", error);
            toast.error("Failed to export data.");
        }
    };

    const StatusBadge = ({ attendMode }: { attendMode: string }) => {
        const styles: Record<string, string> = {
            Online: "bg-blue-50 text-blue-700 border-blue-200",
            Offline: "bg-emerald-50 text-emerald-700 border-emerald-200",
            Hybrid: "bg-purple-50 text-purple-700 border-purple-200"
        };
        const activeStyle = styles[attendMode] || "bg-gray-50 text-gray-700 border-gray-200";
        return (
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${activeStyle}`}>
                {attendMode}
            </span>
        );
    };

    return (
        <div className="bg-gray-50 h-full min-h-screen">
            <Toaster position="top-right" />
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#2C4276]">Course Registrations</h1>
                        <p className="text-gray-500 mt-1">Manage and view all course registration inquiries.</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleExport}
                            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition shadow-sm text-sm"
                        >
                            <Download size={16} />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <Card className="border-0 shadow-sm rounded-2xl">
                    <CardContent className="p-4 sm:p-6">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, phone, or course..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#2C4276] focus:ring-1 focus:ring-[#2C4276] outline-none transition text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-6 py-2.5 bg-[#2C4276] hover:bg-[#1f3159] text-white rounded-xl font-medium transition shadow-sm text-sm"
                            >
                                Search
                            </button>
                        </form>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Sr. No</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Applicant Info</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Course &amp; College</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Mode</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Date Registered</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <Loader2 className="animate-spin text-[#2C4276] mx-auto mb-2" size={32} />
                                            <p className="text-gray-500 font-medium">Loading registrations...</p>
                                        </td>
                                    </tr>
                                ) : registrations.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Users className="text-gray-400" size={24} />
                                            </div>
                                            <p className="text-gray-900 font-medium mb-1">No registrations found</p>
                                            <p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
                                        </td>
                                    </tr>
                                ) : (
                                    registrations.map((reg, idx) => (
                                        <tr key={reg._id} className="hover:bg-gray-50/50 transition">
                                            <td className="px-6 py-4 text-gray-500">
                                                {(page - 1) * limit + idx + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900">{reg.name}</span>
                                                    <span className="text-xs text-gray-500">{reg.email}</span>
                                                    <span className="text-xs text-gray-500">{reg.contact}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900 max-w-[200px] truncate" title={reg.course}>
                                                        {reg.course}
                                                    </span>
                                                    <span className="text-xs text-gray-500 max-w-[200px] truncate" title={reg.collegeName}>
                                                        {reg.collegeName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge attendMode={reg.attendMode} />
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {format(new Date(reg.createdAt), "MMM dd, yyyy")}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setSelectedRegistration(reg)}
                                                    className="inline-flex items-center justify-center bg-blue-50 text-[#2C4276] hover:bg-blue-100 p-2 rounded-lg transition"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalRecords)} of {totalRecords} entries
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                    disabled={page === 1}
                                    className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <div className="px-3 py-1.5 rounded-lg bg-gray-100/50 text-sm font-medium text-gray-700 min-w-[3rem] text-center">
                                    {page}
                                </div>
                                <button
                                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={page === totalPages}
                                    className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {/* View Details Modal */}
            {selectedRegistration && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedRegistration(null)}
                    />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">

                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">Registration Details</h2>
                            <button
                                onClick={() => setSelectedRegistration(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="px-6 py-6 overflow-y-auto custom-scrollbar">
                            <div className="grid md:grid-cols-2 gap-8">

                                {/* Left Column: Personal */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Users size={16} /> Personal Information
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Full Name</p>
                                                <p className="font-semibold text-gray-900">{selectedRegistration.name}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Email Address</p>
                                                    <a href={`mailto:${selectedRegistration.email}`} className="font-medium text-[#2C4276] hover:underline flex items-center gap-1.5">
                                                        <Mail size={14} /> {selectedRegistration.email}
                                                    </a>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Contact Number</p>
                                                    <a href={`tel:${selectedRegistration.contact}`} className="font-medium text-[#2C4276] hover:underline flex items-center gap-1.5">
                                                        <Phone size={14} /> {selectedRegistration.contact}
                                                    </a>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Address</p>
                                                <p className="text-sm text-gray-800 flex items-start gap-1.5">
                                                    <MapPin size={14} className="mt-0.5 text-gray-400 shrink-0" />
                                                    {selectedRegistration.address}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <FileText size={16} /> Additional Details
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Referral Name</p>
                                                    <p className="text-sm font-medium text-gray-800">{selectedRegistration.referralName || "-"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Preferred Location</p>
                                                    <p className="text-sm font-medium text-gray-800">{selectedRegistration.preferredLocation || "-"}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Note / Remarks</p>
                                                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap min-h-[60px]">
                                                    {selectedRegistration.note || "No additional remarks provided."}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Course & Docs */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Calendar size={16} /> Course Details
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Selected Course</p>
                                                <p className="font-bold text-[#2C4276] text-lg leading-tight">{selectedRegistration.course}</p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">College Name</p>
                                                <p className="font-medium text-gray-900">{selectedRegistration.collegeName}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-2">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Pref. Joining Date</p>
                                                    <p className="font-medium text-gray-900">
                                                        {selectedRegistration.preferredJoiningDate
                                                            ? format(new Date(selectedRegistration.preferredJoiningDate), "MMM dd, yyyy")
                                                            : "-"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Attend Mode</p>
                                                    <StatusBadge attendMode={selectedRegistration.attendMode} />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 pt-2">
                                                <p className="text-xs text-gray-500">Laptop Availability:</p>
                                                {selectedRegistration.hasLaptop ? (
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1.5 flex items-center px-2 py-0.5"><Laptop size={12} /> Yes</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1.5 flex items-center px-2 py-0.5"><Laptop size={12} /> No</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Download size={16} /> Uploaded Documents
                                        </h3>

                                        <div className="space-y-3">
                                            {selectedRegistration.resumeUrl ? (
                                                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                                            <FileText size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-800">Resume / CV</p>
                                                            <p className="text-xs text-gray-500">Uploaded Document</p>
                                                        </div>
                                                    </div>
                                                    <Link
                                                        href={selectedRegistration.resumeUrl}
                                                        target="_blank"
                                                        download
                                                        className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition"
                                                    >
                                                        View / Download
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="p-3 border border-dashed border-gray-200 rounded-xl text-center">
                                                    <p className="text-sm text-gray-500">No resume uploaded</p>
                                                </div>
                                            )}

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
