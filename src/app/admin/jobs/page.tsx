"use client";

import Link from "next/link";
import { useState } from "react";
import { useGetJobsQuery, useDeleteJobMutation } from "@/redux/api/jobApi";
import { Plus, Edit2, Trash2, MapPin, Building, Briefcase, Eye, X } from "lucide-react";

export default function AdminJobs() {
    const { data: jobs, isLoading } = useGetJobsQuery(true);
    const [deleteJob] = useDeleteJobMutation();
    const [selectedJob, setSelectedJob] = useState<any>(null);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
            await deleteJob(id);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-midnight_text">Jobs Management</h1>
                    <p className="mt-2 text-sm text-grey">A list of all jobs including their title, company, and location.</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Link
                        href="/admin/jobs/add"
                        className="inline-flex items-center justify-center rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Job
                    </Link>
                </div>
            </div>

            <div className="mt-8 flex flex-col border border-gray-200 rounded-2xl shadow-sm bg-white overflow-hidden">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-200">

                            {/* ✅ HEADER FIXED */}
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-grey sm:pl-6">
                                        Job Title
                                    </th>
                                    {/* <th className="px-3 py-3.5 text-left text-xs font-semibold text-grey">
                                        Company
                                    </th> */}
                                    <th className="px-3 py-3.5 text-left text-xs font-semibold text-grey">
                                        Location
                                    </th>

                                    {/* ✅ NEW COLUMN */}
                                    <th className="px-3 py-3.5 text-left text-xs font-semibold text-grey">
                                        Status
                                    </th>

                                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-3 py-8 text-center text-sm text-grey">
                                            Loading jobs...
                                        </td>
                                    </tr>
                                ) : jobs?.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-3 py-8 text-center text-sm text-grey">
                                            No jobs found.
                                        </td>
                                    </tr>
                                ) : (
                                    jobs?.map((job: any) => (
                                        <tr key={job._id} className="hover:bg-section">

                                            <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                <div className="font-medium text-midnight_text">{job.title}</div>
                                            </td>

                                            <td className="px-3 py-4 text-sm text-grey">
                                                <div className="flex items-center">
                                                    <MapPin className="w-3.5 h-3.5 mr-1.5" />
                                                    {job.location}
                                                </div>
                                            </td>

                                            {/* ✅ STATUS FIXED */}
                                            <td className="px-3 py-4 text-sm">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs ${job.isActive
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {job.isActive !== false ? "Active" : "Inactive"}                                                </span>
                                            </td>

                                            <td className="py-4 pl-3 pr-4 text-right sm:pr-6">
                                                <div className="flex justify-end gap-3">

                                                    {/* ✅ VIEW */}
                                                    <button
                                                        onClick={() => setSelectedJob(job)}
                                                        className="bg-blue-50 p-2 rounded-lg text-blue-600"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <Link
                                                        href={`/admin/jobs/edit/${job._id}`}
                                                        className="text-primary bg-primary/10 p-2 rounded-lg"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>

                                                    <button
                                                        onClick={() => handleDelete(job._id)}
                                                        className="text-red-600 bg-red-50 p-2 rounded-lg"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
            {/* ✅ JOB DETAILS MODAL */}
            {selectedJob && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">

                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h2 className="text-xl font-bold text-midnight_text">
                                Job Details
                            </h2>
                            <button
                                onClick={() => setSelectedJob(null)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-primary mb-1">{selectedJob.title}</h3>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    <div className="flex items-center text-sm text-grey">
                                        <MapPin className="w-4 h-4 mr-1.5 text-primary" />
                                        {selectedJob.location}
                                    </div>
                                    <div className="flex items-center text-sm text-grey">
                                        <Briefcase className="w-4 h-4 mr-1.5 text-primary" />
                                        {selectedJob.type}
                                    </div>
                                    <div className="text-sm font-semibold text-success">
                                        ₹ {selectedJob.salary}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-bold text-midnight_text uppercase tracking-wider mb-2">Work Mode</h4>
                                    <p className="text-gray-600 bg-gray-50 px-3 py-2 rounded-lg inline-block">{selectedJob.workMode || "N/A"}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-midnight_text uppercase tracking-wider mb-2">Education</h4>
                                    <p className="text-gray-600 bg-gray-50 px-3 py-2 rounded-lg inline-block">{selectedJob.education || "N/A"}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-midnight_text uppercase tracking-wider mb-2">Description</h4>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedJob.description}</p>
                            </div>

                            {selectedJob.responsibilities && (
                                <div>
                                    <h4 className="text-sm font-bold text-midnight_text uppercase tracking-wider mb-2">Responsibilities</h4>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedJob.responsibilities}</p>
                                </div>
                            )}

                            {selectedJob.requirements?.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-bold text-midnight_text uppercase tracking-wider mb-2">Requirements</h4>
                                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                                        {selectedJob.requirements.map((req: string, i: number) => (
                                            <li key={i}>{req}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {selectedJob.skills?.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-bold text-midnight_text uppercase tracking-wider mb-2">Skills</h4>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {selectedJob.skills.map((skill: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                            <button
                                onClick={() => setSelectedJob(null)}
                                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-[30px] hover:bg-gray-50 transition-all shadow-sm"
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