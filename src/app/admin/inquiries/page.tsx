"use client";

import React, { useState, useEffect } from "react";
import {
    MessageSquare,
    Search,
    Download,
    Loader2,
    Calendar,
    Phone,
    BookOpen,
    Trash2,
    Eye,
    Pencil,
    X,
    Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import DeleteCourseDialog from "@/components/dashboard/courses/DeleteCourseDialog";
import { toast } from "sonner";

interface Inquiry {
    _id: string;
    name: string;
    email: string;
    phone: string;
    course: string;
    type: string;
    message: string;
    college?: string;
    education?: string;
    source?: string;
    country?: string;
    status: "New" | "Contacted" | "Enrolled" | "Cancelled";
    createdAt: string;
}

export default function InquiriesManagementPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [activeTab, setActiveTab] = useState<"All" | "Contact Form" | "Inquiry Form">("All");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const inquiriesPerPage = 10;

    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const typeFilter = activeTab !== "All" ? `&type=${activeTab}` : "";
            const response = await fetch(
                `/api/inquiry?search=${searchQuery}&page=${currentPage}&limit=${inquiriesPerPage}&startDate=${startDate}&endDate=${endDate}${typeFilter}`
            );
            const data = await response.json();

            if (response.ok) {
                setInquiries(data.inquiries || []);
                setTotalPages(data.totalPages || 1);
                setTotal(data.total || 0);
            }
        } catch (error) {
            console.error("Error fetching inquiries:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchInquiries();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, currentPage, startDate, endDate, activeTab]);

    const handleExport = () => {
        if (inquiries.length === 0) return;

        const data = inquiries.map(enq => ({
            "Full Name": enq.name,
            "Email Address": enq.email,
            "Phone Number": enq.phone,
            "Type": enq.type,
            "Course / Source": enq.course,
            "Status": enq.status,
            "Submission Date": new Date(enq.createdAt).toLocaleDateString()
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Inquiries");
        XLSX.writeFile(wb, `Inquiries_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    const openViewModal = (enq: Inquiry) => {
        setSelectedInquiry(enq);
        setIsViewModalOpen(true);
    };

    const openEditModal = (enq: Inquiry) => {
        setSelectedInquiry({ ...enq });
        setIsEditModalOpen(true);
    };

    const handleDeleteInquiry = async (id: string) => {
        const response = await fetch(`/api/inquiry/${id}`, { method: "DELETE" });
        if (response.ok) {
            toast.success("Inquiry deleted successfully");
            fetchInquiries();
        } else {
            throw new Error("Failed to delete");
        }
    };

    const handleUpdateInquiry = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInquiry) return;

        setUpdateLoading(true);
        try {
            const response = await fetch(`/api/inquiry/${selectedInquiry._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedInquiry),
            });

            if (response.ok) {
                setIsEditModalOpen(false);
                fetchInquiries();
            } else {
                alert("Failed to update inquiry");
            }
        } catch (error) {
            console.error("Error updating inquiry:", error);
            alert("Failed to update inquiry");
        } finally {
            setUpdateLoading(false);
        }
    };

    return (
        <div className=" bg-gray-50 h-full">
            <div className="mb-6">
                <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-xl w-fit mb-4">
                    {(["All", "Contact Form", "Inquiry Form"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab
                                ? "bg-white text-[#2C4276] shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {tab === "All" ? "All Leads" : tab}
                        </button>
                    ))}
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#2C4276]">Leads & Inquiries</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage incoming student inquiries and leads</p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto relative">
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm text-gray-700"
                        >
                            <Download size={18} />
                            Export
                        </button>
                        <button
                            onClick={() => setShowDatePicker(!showDatePicker)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md ${showDatePicker ? 'bg-amber-500 text-white' : 'bg-[#2C4276] text-white hover:bg-opacity-90'}`}
                        >
                            <Calendar size={18} />
                            {startDate || endDate ? "Filter Active" : "Filter Date"}
                        </button>

                        <AnimatePresence>
                            {showDatePicker && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 top-12 bg-white p-4 rounded-xl shadow-2xl border border-gray-100 z-50 flex flex-col gap-3 min-w-[260px]"
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-gray-400 uppercase">Select Range</span>
                                        <button onClick={() => setShowDatePicker(false)}><X size={14} className="text-gray-400" /></button>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase">Start Date</label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                                            className="w-full bg-gray-50 border rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase">End Date</label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                                            className="w-full bg-gray-50 border rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            setStartDate("");
                                            setEndDate("");
                                            setCurrentPage(1);
                                            setShowDatePicker(false);
                                        }}
                                        className="w-full mt-2 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
                                    >
                                        Clear All Filters
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden -mt-3">
                <div className="p-3 border-b bg-white flex justify-between items-center">
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Search by name, email or course..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10 pr-4 py-2 w-full bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-[#2C4276]/20 outline-none transition-all placeholder:text-gray-400"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>
                    {(startDate || endDate) && (
                        <div className="hidden md:flex items-center gap-2 text-[10px] text-amber-600 font-bold bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                            <Filter size={12} />
                            Date Filter Active
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                        <p className="text-gray-500 animate-pulse">Fetching inquiries...</p>
                    </div>
                ) : inquiries.length === 0 ? (
                    <div className="text-center py-20 px-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="text-gray-400" size={32} />
                        </div>
                        <p className="text-gray-500 text-lg font-medium">No inquiries found</p>
                        <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
                            {searchQuery || startDate || endDate
                                ? "No inquiries match your current filters. Try adjusting them."
                                : "There are no incoming inquiries at the moment."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="custom-scrollbar-container overflow-y-auto h-[390px] sm:max-h-[600px] border rounded-lg pb-4 sm:pb-0">
                            <table className="w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 border-b sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Course</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {inquiries.map((enq) => (
                                        <tr key={enq._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2C4276] to-blue-500 flex items-center justify-center text-white font-bold shadow-inner uppercase">
                                                        {enq.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-gray-900">{enq.name}</div>
                                                        <div className="text-[10px] text-gray-500 truncate max-w-[150px]">{enq.email}</div>
                                                        {enq.message && (
                                                            <div className="text-[10px] text-blue-600 font-medium truncate max-w-[150px] mt-0.5 italic">
                                                                "{enq.message.substring(0, 30)}..."
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${enq.type === 'Contact Form' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                    enq.type === 'Inquiry Form' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                        'bg-gray-50 text-gray-600 border-gray-100'
                                                    }`}>
                                                    {enq.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-700 flex items-center gap-1.5 font-medium">
                                                    <BookOpen size={14} className="text-gray-400" />
                                                    {enq.course || 'Not Specified'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs text-gray-600 flex items-center gap-1">
                                                    <Phone size={12} className="text-gray-400" />
                                                    {enq.phone}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${enq.status === 'Enrolled' ? 'bg-green-50 text-green-600 border-green-100' :
                                                    enq.status === 'Contacted' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        enq.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                                                            'bg-blue-50 text-blue-600 border-blue-100'
                                                    }`}>
                                                    {enq.status || 'New'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-[10px] text-gray-500 font-medium">{new Date(enq.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => openViewModal(enq)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="View Details"><Eye size={18} /></button>
                                                    <button onClick={() => openEditModal(enq)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Update Status"><Pencil size={18} /></button>
                                                    <button
                                                        onClick={() => setDeleteId(enq._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-medium">{(currentPage - 1) * inquiriesPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * inquiriesPerPage, total)}</span> of <span className="font-medium">{total}</span> leads
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                >
                                    Previous
                                </button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) pageNum = i + 1;
                                        else if (currentPage <= 3) pageNum = i + 1;
                                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                        else pageNum = currentPage - 2 + i;

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-10 h-10 rounded-lg text-sm transition-colors ${currentPage === pageNum ? "bg-[#2C4276] text-white" : "border bg-white hover:bg-gray-50 text-gray-700"
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modals */}
            {isViewModalOpen && selectedInquiry && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-[#2C4276]">Inquiry Details</h2>
                            <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2C4276] to-blue-500 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg border-4 border-white">
                                    {selectedInquiry.name.charAt(0)}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">{selectedInquiry.name}</h3>
                                <span className={`mt-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${selectedInquiry.status === 'New' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                    selectedInquiry.status === 'Contacted' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                        selectedInquiry.status === 'Enrolled' ? 'bg-green-50 text-green-600 border-green-100' :
                                            'bg-red-50 text-red-600 border-red-100'
                                    }`}>
                                    {selectedInquiry.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                                    <p className="text-sm font-semibold text-gray-900 break-all">{selectedInquiry.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedInquiry.phone}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Interested Course</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedInquiry.course}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Education</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedInquiry.education || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">College/School</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedInquiry.college || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Country</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedInquiry.country || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Source</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedInquiry.source || "Direct"}</p>
                                </div>
                            </div>

                            {selectedInquiry.message && (
                                <div className="space-y-2 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Message</p>
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap italic">
                                        "{selectedInquiry.message}"
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => { setIsViewModalOpen(false); setIsEditModalOpen(true); }}
                                    className="flex-1 py-3 bg-[#2C4276] text-white rounded-xl font-bold shadow-md hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
                                >
                                    <Pencil size={18} />
                                    Update Status
                                </button>
                                <button
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="px-8 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isEditModalOpen && selectedInquiry && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-[#2C4276]">Update Status</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateInquiry} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Status</label>
                                <select
                                    value={selectedInquiry.status}
                                    onChange={(e) => setSelectedInquiry({ ...selectedInquiry, status: e.target.value as any })}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#2C4276] rounded-xl p-3 outline-none transition-all font-semibold"
                                >
                                    <option value="New">New Lead</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Enrolled">Enrolled</option>
                                    <option value="Cancelled">Cancelled/Lost</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lead Source</label>
                                <input
                                    type="text"
                                    value={selectedInquiry.source || ""}
                                    onChange={(e) => setSelectedInquiry({ ...selectedInquiry, source: e.target.value })}
                                    className="w-full bg-gray-50 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                                    placeholder="e.g. Website, Social Media, Referral"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateLoading}
                                    className="flex-1 py-3 bg-[#2C4276] text-white rounded-xl font-bold shadow-md hover:bg-opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                                >
                                    {updateLoading && <Loader2 className="animate-spin" size={18} />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteCourseDialog
                deleteId={deleteId}
                setDeleteId={setDeleteId}
                onDelete={handleDeleteInquiry}
            />
        </div>
    );
}
