
"use client";

import { useGetApplicationsQuery } from "@/redux/api/jobApi";
import { useState } from "react";
import {
    Eye,
    Download,
    FileText,
    Trash2,
    X,
    Search,
} from "lucide-react";

export default function Applications() {
    const { data: applications, isLoading, refetch } =
        useGetApplicationsQuery();

    const [selectedResume, setSelectedResume] = useState("");

    // ✅ SEARCH + PAGINATION
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // ✅ DELETE
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this application?"))
            return;

        await fetch(`/api/applications/${id}`, {
            method: "DELETE",
        });

        refetch();
    };

    // ✅ FILTER
    const filteredApps = (applications || []).filter((app: any) =>
        app.name?.toLowerCase().includes(search.toLowerCase())
    );

    // ✅ PAGINATION
    const totalPages = Math.ceil((filteredApps?.length || 0) / itemsPerPage);

    const paginatedApps = filteredApps?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="bg-gray-50 h-full">

            {/* HEADER */}
            <div className="mb-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4276]">Job Applications</h1>
                        <p className="text-gray-500 text-sm mt-1 font-medium">Review and manage incoming candidate applications</p>
                    </div>

                    <div className="relative w-full lg:w-64">
                        <input
                            type="text"
                            placeholder="Search candidates..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10 pr-4 py-2.5 rounded-xl border-0 focus:ring-2 focus:ring-[#2C4276]/20 w-full shadow-sm bg-white text-gray-600 outline-none transition-all"
                        />
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <p className="text-gray-500 animate-pulse">Loading applications...</p>
                    </div>
                ) : (filteredApps?.length || 0) === 0 ? (
                    <div className="text-center py-20 px-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="text-gray-400" size={32} />
                        </div>
                        <p className="text-gray-500 text-lg font-medium">No applications found</p>
                        <p className="text-gray-400 text-sm mt-2">
                            {search ? "No candidates match your search." : "No applications received yet."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-auto">
                            <table className="w-full divide-y divide-gray-200 min-w-[800px]">
                                <thead className="bg-gray-50 border-b sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Candidate</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Position Applied</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date Applied</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {paginatedApps.map((app: any, index: number) => {
                                        const resumeUrl = app.resumeUrl || app.resume;

                                        return (
                                            <tr key={app._id} className="hover:bg-gray-50 transition-colors">

                                                {/* ID */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                                </td>

                                                {/* NAME */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2C4276] to-blue-500 flex items-center justify-center text-white font-bold shadow-inner uppercase overflow-hidden flex-shrink-0">
                                                            {app.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="text-sm font-bold text-gray-900">{app.name}</div>
                                                    </div>
                                                </td>

                                                {/* CONTACT */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-xs text-gray-600 font-medium">{app.email}</div>
                                                    <div className="text-xs text-gray-400">{app.phone}</div>
                                                </td>

                                                {/* JOB */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-100 uppercase tracking-tight">
                                                        {app.jobId?.title || "—"}
                                                    </span>
                                                </td>

                                                {/* DATE */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {new Date(app.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                                </td>

                                                {/* ACTIONS */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div className="flex items-center gap-2">
                                                        {resumeUrl && (
                                                            <button
                                                                onClick={() => setSelectedResume(resumeUrl)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Preview Resume"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                        )}
                                                        {resumeUrl && (
                                                            <a
                                                                href={resumeUrl}
                                                                download
                                                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                                title="Download Resume"
                                                            >
                                                                <Download size={18} />
                                                            </a>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(app._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete Application"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        <div className="px-6 py-4 border-t bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                                <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredApps?.length || 0)}</span> of{" "}
                                <span className="font-bold text-gray-900">{filteredApps?.length || 0}</span> applications
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 text-sm font-bold rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm active:scale-95"
                                >
                                    Previous
                                </button>
                                <div className="hidden sm:flex items-center gap-1">
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
                                                className={`w-10 h-10 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95 ${currentPage === pageNum ? "bg-[#2C4276] text-white" : "border bg-white hover:bg-gray-50 text-gray-700"}`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="px-4 py-2 text-sm font-bold rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm active:scale-95"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* RESUME PREVIEW MODAL */}
            {selectedResume && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-[#2C4276]/10 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-[#2C4276]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#2C4276] leading-tight">Resume Preview</h2>
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Candidate Application Record</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <a
                                    href={selectedResume}
                                    download
                                    className="flex items-center px-4 py-2 bg-[#2C4276] text-white font-bold rounded-lg hover:bg-opacity-90 transition-all text-sm shadow-md"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </a>
                                <button
                                    onClick={() => setSelectedResume("")}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex-1 bg-gray-100 overflow-hidden">
                            <iframe
                                src={selectedResume}
                                className="w-full h-full border-none"
                                title="Resume Viewer"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}