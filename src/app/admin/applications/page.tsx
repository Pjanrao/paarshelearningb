"use client";

import { useGetApplicationsQuery } from "@/redux/api/jobApi";
import { useState, useMemo } from "react";
import {
    Eye,
    Download,
    FileText,
    Trash2,
    X,
    Search,
    User,
    Mail,
    Phone,
    Briefcase,
} from "lucide-react";

/**
 * ResumePreviewModal Component
 * Displays a professional header with candidate details and an iframe for resume preview.
 */
function ResumePreviewModal({ data, onClose }: { data: any; onClose: () => void }) {
    const resumeUrl = data.resumeUrl || data.resume;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-gray-100">

                {/* 1. Header Area - Screenshot Exact Match */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-5 min-w-max">
                        {/* Avatar / File Icon */}
                        <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 shadow-inner">
                            <FileText className="w-7 h-7 text-[#2C4276]/80" />
                        </div>

                        {/* Candidate Info Details */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2.5">
                                <User size={20} className="text-gray-400" />
                                <h2 className="text-2xl font-bold text-[#2C4276] tracking-tight capitalize leading-none">
                                    {data.name}
                                </h2>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                                    <Mail size={15} className="text-gray-400" />
                                    {data.email}
                                </div>
                                <div className="w-1 h-1 rounded-full bg-gray-300 mx-1 hidden sm:block"></div>
                                <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium border-l border-gray-200 pl-4 sm:border-0 sm:pl-0">
                                    <Phone size={15} className="text-gray-400" />
                                    {data.phone}
                                </div>
                                <div className="w-1 h-1 rounded-full bg-gray-300 mx-1 hidden sm:block"></div>
                                <div className="flex items-center gap-1.5 text-[12px] text-blue-600 font-bold border-l border-gray-200 pl-4 sm:border-0 sm:pl-0 uppercase tracking-wider">
                                    <Briefcase size={15} className="text-blue-500" />
                                    {data.jobId?.title || "Staff Candidate"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons Area */}
                    <div className="flex items-center gap-4 ml-8 pr-2">
                        {resumeUrl && (
                            <div className="flex items-center gap-3">
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hidden md:flex items-center px-5 py-2.5 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all text-xs border border-gray-100 whitespace-nowrap"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Preview Full
                                </a>
                                <a
                                    href={resumeUrl}
                                    download
                                    className="flex items-center px-6 py-3 bg-[#2C4276] text-white font-bold rounded-xl hover:bg-opacity-90 transition-all text-sm shadow-lg whitespace-nowrap active:scale-95"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </a>
                            </div>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2.5 hover:bg-red-50 hover:text-red-500 rounded-full transition-all flex-shrink-0 group"
                            title="Close Preview"
                        >
                            <X className="w-7 h-7 text-gray-400 group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>
                </div>

                {/* 2. Document Display Area */}
                <div className="flex-1 bg-gray-100 overflow-hidden relative">
                    {resumeUrl ? (
                        <div className="w-full h-full relative group">
                            {/* Embedded Iframe */}
                            <iframe
                                src={`${resumeUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                                className="w-full h-full border-none shadow-inner relative z-10"
                                title="Resume Viewer"
                            />

                            {/* Fallback Overlay for Mobile / Restricted Browsers */}
                            <div className="absolute inset-0 z-0 bg-white flex flex-col items-center justify-center p-10 text-center sm:hidden">
                                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                                    <FileText size={40} className="text-blue-600 opacity-30" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Resume Preview</h3>
                                <p className="text-gray-500 mb-8 max-w-[280px]">If the preview doesn't load automatically on your device, please use the button below to view the document.</p>
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-extrabold text-sm shadow-2xl w-full max-w-[300px] hover:bg-blue-700 transition-colors uppercase tracking-widest"
                                >
                                    View Resume Now
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <FileText size={48} className="mb-4 opacity-10" />
                            <p className="font-medium text-lg italic">The candidate has not uploaded a resume file.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Applications Page Component
 * Main entry point for the Job Applications management interface.
 */
export default function Applications() {
    const { data: applications, isLoading, refetch } = useGetApplicationsQuery();

    // State for Modal Management
    const [selectedApplication, setSelectedApplication] = useState<any>(null);
    const [isResumeOpen, setIsResumeOpen] = useState(false);

    // Search and Pagination State
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    /**
     * Delete an application
     */
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this application record?")) return;

        try {
            const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
            if (res.ok) refetch();
        } catch (error) {
            console.error("Failed to delete application:", error);
        }
    };

    /**
     * Filter applications by candidate name
     */
    const filteredApps = useMemo(() => {
        return (applications || []).filter((app: any) =>
            app.name?.toLowerCase().includes(search.toLowerCase())
        );
    }, [applications, search]);

    /**
     * Calculate paginated subset
     */
    const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
    const paginatedApps = useMemo(() => {
        return filteredApps.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    }, [filteredApps, currentPage]);

    return (
        <div className="bg-[#F8FAFC] min-h-screen p-4 sm:p-6 lg:p-8">

            {/* Header / Search Area */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#2C4276] tracking-tight">Job Applications</h1>
                        <p className="text-gray-500 text-sm mt-1.5 font-medium">Manage and review all incoming candidate profiles for open roles.</p>
                    </div>

                    <div className="relative w-full lg:w-80 shadow-sm transition-shadow hover:shadow-md rounded-xl overflow-hidden">
                        <input
                            type="text"
                            placeholder="Search by candidate name..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-12 pr-4 py-3.5 border-0 focus:ring-0 w-full bg-white text-gray-700 font-medium placeholder:text-gray-400 outline-none"
                        />
                        <Search className="absolute left-4 top-4 text-gray-400" size={20} />
                    </div>
                </div>
            </div>

            {/* Applications Table Card */}
            <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <div className="w-10 h-10 border-4 border-[#2C4276]/20 border-t-[#2C4276] rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-bold animate-pulse">Syncing Applications...</p>
                    </div>
                ) : filteredApps.length === 0 ? (
                    <div className="text-center py-32 px-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText className="text-gray-300" size={40} />
                        </div>
                        <p className="text-gray-900 text-xl font-bold">No results found</p>
                        <p className="text-gray-500 text-sm mt-2 max-w-[300px] mx-auto font-medium">
                            {search ? `We couldn't find any candidates matching "${search}".` : "You haven't received any applications for your jobs yet."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-gray-100 min-w-[900px]">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">ID</th>
                                        <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Candidate</th>
                                        <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Professional Contact</th>
                                        <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Applied Role</th>
                                        <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Submission Date</th>
                                        <th className="px-6 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 bg-white">
                                    {paginatedApps.map((app: any, index: number) => {
                                        const resumeUrl = app.resumeUrl || app.resume;

                                        return (
                                            <tr key={app._id} className="hover:bg-blue-50/30 transition-all group">
                                                {/* Index Number */}
                                                <td className="px-6 py-6 whitespace-nowrap text-sm font-mono text-gray-400">
                                                    {((currentPage - 1) * itemsPerPage + index + 1).toString().padStart(2, '0')}
                                                </td>

                                                {/* Candidate Identity */}
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-11 h-11 rounded-full bg-[#2C4276] flex items-center justify-center text-white font-black shadow-md uppercase ring-4 ring-blue-50">
                                                            {app.name?.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-md font-extrabold text-gray-900 tracking-tight">{app.name}</span>
                                                            <span className="text-xs text-gray-400 font-medium">Candidate Profile</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Contact Details */}
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm text-gray-700 font-bold">{app.email}</span>
                                                        <span className="text-xs text-gray-400 font-medium">{app.phone}</span>
                                                    </div>
                                                </td>

                                                {/* Role Applied For */}
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <span className="bg-[#2C4276]/5 text-[#2C4276] px-3 py-1.5 rounded-lg text-[11px] font-black border border-[#2C4276]/10 uppercase tracking-widest group-hover:bg-[#2C4276] group-hover:text-white transition-all duration-300">
                                                        {app.jobId?.title || "—"}
                                                    </span>
                                                </td>

                                                {/* Submission Timestamp */}
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <span className="text-sm text-gray-600 font-bold">
                                                        {new Date(app.createdAt).toLocaleDateString("en-US", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric"
                                                        })}
                                                    </span>
                                                </td>

                                                {/* Action Buttons */}
                                                <td className="px-6 py-6 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                                        {resumeUrl && (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedApplication(app);
                                                                    setIsResumeOpen(true);
                                                                }}
                                                                className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl transition-all hover:scale-110 active:scale-90"
                                                                title="Preview Application"
                                                            >
                                                                <Eye size={22} strokeWidth={2.5} />
                                                            </button>
                                                        )}
                                                        {resumeUrl && (
                                                            <a
                                                                href={resumeUrl}
                                                                download
                                                                className="p-2.5 text-gray-400 hover:bg-gray-100 rounded-xl transition-all hover:scale-110 active:scale-90"
                                                                title="Download Original File"
                                                            >
                                                                <Download size={22} strokeWidth={2.5} />
                                                            </a>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(app._id)}
                                                            className="p-2.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all hover:scale-110 active:scale-90"
                                                            title="Delete Permanently"
                                                        >
                                                            <Trash2 size={22} strokeWidth={2.5} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Bar */}
                        <div className="px-8 py-6 border-t border-gray-50 bg-[#F8FAFC]/50 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-sm text-gray-500 font-medium">
                                Showing records <span className="text-[#2C4276] font-black">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                                <span className="text-[#2C4276] font-black">{Math.min(currentPage * itemsPerPage, filteredApps.length)}</span> of{" "}
                                <span className="text-[#2C4276] font-black">{filteredApps.length}</span> candidates
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-6 py-2.5 text-sm font-bold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 transition-all shadow-sm active:scale-95"
                                >
                                    Prev
                                </button>

                                <div className="hidden sm:flex items-center gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(p => Math.abs(p - currentPage) <= 2 || p === 1 || p === totalPages)
                                        .map((pageNum, idx, arr) => (
                                            <div key={pageNum} className="flex items-center gap-2">
                                                {idx > 0 && arr[idx - 1] !== pageNum - 1 && <span className="text-gray-300">...</span>}
                                                <button
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`w-11 h-11 rounded-xl text-sm font-black transition-all active:scale-90 ${currentPage === pageNum ? "bg-[#2C4276] text-white shadow-lg shadow-blue-200" : "bg-white border border-gray-200 text-gray-600 hover:border-[#2C4276] hover:text-[#2C4276]"}`}
                                                >
                                                    {pageNum}
                                                </button>
                                            </div>
                                        ))
                                    }
                                </div>

                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="px-6 py-2.5 text-sm font-bold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 transition-all shadow-sm active:scale-95"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Resume Preview Modal (Overlay) */}
            {isResumeOpen && selectedApplication && (
                <ResumePreviewModal
                    data={selectedApplication}
                    onClose={() => setIsResumeOpen(false)}
                />
            )}
        </div>
    );
}