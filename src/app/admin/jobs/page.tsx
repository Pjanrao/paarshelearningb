"use client";

import Link from "next/link";
import { useState } from "react";
import {
    useGetJobsQuery,
    useDeleteJobMutation,
} from "@/redux/api/jobApi";
import {
    Plus,
    Edit2,
    Trash2,
    MapPin,
    Eye,
    X,
    Briefcase,
    Search,
} from "lucide-react";

export default function AdminJobs() {
    const { data: jobs, isLoading } = useGetJobsQuery(true);
    const [deleteJob] = useDeleteJobMutation();

    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredJobs = jobs?.filter((job: any) =>
        job.title.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil((filteredJobs?.length || 0) / itemsPerPage);

    const paginatedJobs = filteredJobs?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this job?")) {
            await deleteJob(id);
        }
    };

    return (
        <div className="bg-gray-50 h-full">
            <div className="mb-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4276]">Jobs Management</h1>
                        <p className="text-gray-500 text-sm mt-1 font-medium">Manage all job postings and track applicants</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-10 pr-4 py-2.5 rounded-xl border-0 focus:ring-2 focus:ring-[#2C4276]/20 w-full shadow-sm bg-white text-gray-600 outline-none transition-all"
                            />
                            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        </div>

                        <Link
                            href="/admin/jobs/add"
                            className="bg-[#2C4276] text-white px-5 py-2.5 rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-md font-semibold active:scale-95 whitespace-nowrap"
                        >
                            <Plus size={20} />
                            <span>Add Job</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <p className="text-gray-500 animate-pulse">Loading jobs...</p>
                    </div>
                ) : (filteredJobs?.length || 0) === 0 ? (
                    <div className="text-center py-20 px-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="text-gray-400" size={32} />
                        </div>
                        <p className="text-gray-500 text-lg font-medium">No jobs found</p>
                        <p className="text-gray-400 text-sm mt-2">
                            {search ? "No jobs match your search." : "No jobs posted yet. Click 'Add Job' to get started."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-auto">
                            <table className="w-full divide-y divide-gray-200 min-w-[900px]">
                                <thead className="bg-gray-50 border-b sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Job Title</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employment</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Posted Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {paginatedJobs?.map((job: any, index: number) => (
                                        <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">{job.title}</div>
                                                {job.company && (
                                                    <div className="text-xs text-gray-400">{job.company}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                    <MapPin size={13} className="text-gray-400" />
                                                    {job.location}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold border border-blue-100 uppercase tracking-tight">
                                                    {job.type || "—"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(job.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${job.isActive ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
                                                    {job.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedJob(job)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <Link
                                                        href={`/admin/jobs/edit/${job._id}`}
                                                        className="p-2 text-[#2C4276] hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit Job"
                                                    >
                                                        <Edit2 size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(job._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Job"
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

                        {/* PAGINATION */}
                        <div className="px-6 py-4 border-t bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                                <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredJobs?.length || 0)}</span> of{" "}
                                <span className="font-bold text-gray-900">{filteredJobs?.length || 0}</span> jobs
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

            {/* JOB DETAILS MODAL */}
            {selectedJob && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h2 className="text-xl font-bold text-[#2C4276]">Job Details</h2>
                            <button
                                onClick={() => setSelectedJob(null)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto space-y-5">
                            <div>
                                <h3 className="text-2xl font-bold text-[#2C4276] mb-1">{selectedJob.title}</h3>
                                <div className="flex flex-wrap gap-3 mt-2">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                                        {selectedJob.location}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Briefcase className="w-4 h-4 mr-1.5 text-gray-400" />
                                        {selectedJob.type}
                                    </div>
                                    {selectedJob.salary && (
                                        <div className="text-sm font-semibold text-green-600">
                                            ₹ {selectedJob.salary}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                                    <p className="text-gray-400 text-[9px] font-bold uppercase">Work Mode</p>
                                    <p className="text-sm font-bold text-gray-900">{selectedJob.workMode || "N/A"}</p>
                                </div>
                                <div className="bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                                    <p className="text-gray-400 text-[9px] font-bold uppercase">Education</p>
                                    <p className="text-sm font-bold text-gray-900">{selectedJob.education || "N/A"}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-3 py-3 rounded-xl border border-gray-100">
                                <p className="text-gray-400 text-[9px] font-bold uppercase mb-2">Description</p>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedJob.description}</p>
                            </div>

                            {selectedJob.responsibilities && (
                                <div className="bg-gray-50 px-3 py-3 rounded-xl border border-gray-100">
                                    <p className="text-gray-400 text-[9px] font-bold uppercase mb-2">Responsibilities</p>
                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedJob.responsibilities}</p>
                                </div>
                            )}

                            {selectedJob.requirements?.length > 0 && (
                                <div className="bg-gray-50 px-3 py-3 rounded-xl border border-gray-100">
                                    <p className="text-gray-400 text-[9px] font-bold uppercase mb-2">Requirements</p>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                        {selectedJob.requirements.map((req: string, i: number) => (
                                            <li key={i}>{req}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {selectedJob.skills?.length > 0 && (
                                <div>
                                    <p className="text-gray-400 text-[9px] font-bold uppercase mb-2">Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedJob.skills.map((skill: string, i: number) => (
                                            <span key={i} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-100 uppercase tracking-tight">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <Link
                                href={`/admin/jobs/edit/${selectedJob._id}`}
                                className="px-5 py-2 bg-[#2C4276] text-white rounded-xl text-sm font-bold hover:bg-opacity-90 transition-all shadow-md active:scale-95"
                            >
                                Edit Job
                            </Link>
                            <button
                                onClick={() => setSelectedJob(null)}
                                className="px-5 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}