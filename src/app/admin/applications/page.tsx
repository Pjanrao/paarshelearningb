"use client";

import { useGetApplicationsQuery } from "@/redux/api/jobApi";
import { useState } from "react";
import { Mail, Phone, Calendar, User, Briefcase, Eye, Download, FileText, Trash2, X } from "lucide-react";

export default function Applications() {
    const { data: applications, isLoading, refetch } = useGetApplicationsQuery();
    const [selectedResume, setSelectedResume] = useState("");
    // ✅ DELETE FUNCTION
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this application?")) return;

        try {
            await fetch(`/api/applications/${id}`, {
                method: "DELETE",
            });

            refetch(); // refresh list
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-midnight_text">Job Applications</h1>
                    <p className="mt-2 text-sm text-grey">
                        A list of all incoming applications with detailed candidate information.
                    </p>
                </div>
            </div>

            <div className="mt-8 flex flex-col border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">

                        <table className="min-w-full divide-y divide-gray-200">

                            {/* HEADER */}
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="py-4 pl-4 pr-3 text-left text-xs font-semibold text-gray-500 sm:pl-6">
                                        Candidate
                                    </th>
                                    <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500">
                                        Contact Info
                                    </th>
                                    <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500">
                                        Applied Position
                                    </th>
                                    <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500">
                                        Date Applied
                                    </th>
                                    <th className="px-3 py-4 text-right text-xs font-semibold text-gray-500 sm:pr-6">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 bg-white">

                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-10">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : applications?.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-10">
                                            No applications found
                                        </td>
                                    </tr>
                                ) : (
                                    applications?.map((app: any) => {
                                        const resumeUrl = app.resumeUrl || app.resume;

                                        return (
                                            <tr key={app._id} className="hover:bg-gray-50">

                                                {/* NAME */}
                                                <td className="py-4 pl-4 pr-3 sm:pl-6">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            {app.name?.charAt(0)}
                                                        </div>
                                                        <div className="ml-3">
                                                            <p className="font-medium">{app.name}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* CONTACT */}
                                                <td className="px-3 py-4 text-sm">
                                                    <div>{app.email}</div>
                                                    <div>{app.phone}</div>
                                                </td>

                                                {/* JOB */}
                                                <td className="px-3 py-4 text-sm">
                                                    {app.jobId?.title}
                                                </td>

                                                {/* DATE */}
                                                <td className="px-3 py-4 text-sm">
                                                    {new Date(app.createdAt).toLocaleDateString()}
                                                </td>

                                                {/* ACTIONS */}
                                                <td className="px-3 py-4 text-right">
                                                    <div className="flex justify-end gap-2">

                                                        {/* VIEW */}
                                                        {resumeUrl && (
                                                            <button
                                                                onClick={() => setSelectedResume(app.resumeUrl || app.resume)}
                                                                className="p-2 bg-blue-50 rounded"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        {/* DOWNLOAD */}
                                                        {resumeUrl && (
                                                            <a
                                                                href={resumeUrl}
                                                                download
                                                                className="p-2 bg-gray-50 rounded"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </a>
                                                        )}

                                                        {/* DELETE */}
                                                        <button
                                                            onClick={() => handleDelete(app._id)}
                                                            className="p-2 bg-red-50 text-red-600 rounded"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>

                                                    </div>
                                                </td>

                                            </tr>
                                        );
                                    })
                                )}

                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
            {/* ✅ RESUME PREVIEW MODAL */}
            {selectedResume && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">

                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                                    <FileText className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-midnight_text leading-tight">
                                        Resume Preview
                                    </h2>
                                    <p className="text-xs text-grey font-medium uppercase tracking-wider">Candidate Application Record</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <a
                                    href={selectedResume}
                                    download
                                    className="flex items-center px-4 py-2 bg-primary/10 text-primary font-bold rounded-[30px] hover:bg-primary hover:text-white transition-all text-sm"
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

                        {/* Body (Iframe) */}
                        <div className="flex-1 bg-gray-100 overflow-hidden relative">
                            <iframe
                                src={selectedResume}
                                className="w-full h-full border-none shadow-inner"
                                title="Resume Viewer"
                            />
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex justify-center">
                            <p className="text-xs text-grey">
                                Press <span className="px-1.5 py-0.5 bg-gray-200 rounded text-midnight_text font-bold">Esc</span> to close this preview
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}