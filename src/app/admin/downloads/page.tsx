"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import toast, { Toaster } from "react-hot-toast";

interface Download {
    _id: string;
    title: string;
    description: string;
    fileUrl: string;
    category: string;
    status: "active" | "inactive";
    downloadCount: number;
    createdAt: string;
}

export default function AdminDownloadsPage() {
    const [downloads, setDownloads] = useState<Download[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDownload, setCurrentDownload] = useState<Partial<Download> | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchDownloads();
    }, []);

    const fetchDownloads = async () => {
        try {
            const res = await fetch("/api/admin/downloads");
            const data = await res.json();
            setDownloads(data);
        } catch (error) {
            toast.error("Failed to fetch downloads");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const method = currentDownload?._id ? "PUT" : "POST";
        const url = currentDownload?._id
            ? `/api/admin/downloads/${currentDownload._id}`
            : "/api/admin/downloads";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentDownload),
            });

            if (res.ok) {
                toast.success(`Download ${currentDownload?._id ? "updated" : "created"} successfully`);
                setIsModalOpen(false);
                fetchDownloads();
            } else {
                const error = await res.json();
                throw new Error(error.message || "Something went wrong");
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this download?")) return;

        try {
            const res = await fetch(`/api/admin/downloads/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Download deleted successfully");
                fetchDownloads();
            }
        } catch (error) {
            toast.error("Failed to delete download");
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Toaster position="top-right" />
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Manage Downloads</h1>
                        <p className="text-gray-500">Add and manage downloadable resources for students.</p>
                    </div>
                    <button
                        onClick={() => {
                            setCurrentDownload({ title: "", description: "", fileUrl: "", category: "General", status: "active" });
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-[#2C4276] text-white px-6 py-3 rounded-xl hover:bg-[#1e2f56] transition-all shadow-lg shadow-blue-900/20"
                    >
                        <Icon icon="solar:add-circle-bold" width="24" />
                        Add New Resource
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C4276]"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {downloads.map((download) => (
                            <div key={download._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-blue-50 rounded-xl text-[#2C4276]">
                                            <Icon icon="solar:document-bold" width="32" />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setCurrentDownload(download);
                                                    setIsModalOpen(true);
                                                }}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Icon icon="solar:pen-bold" width="20" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(download._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Icon icon="solar:trash-bin-trash-bold" width="20" />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{download.title}</h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{download.description}</p>
                                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-50">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${download.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'}`}>
                                            {download.status}
                                        </span>
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <Icon icon="solar:download-bold" />
                                            {download.downloadCount} downloads
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {currentDownload?._id ? "Edit Resource" : "Add Resource"}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <Icon icon="solar:close-circle-bold" width="32" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        value={currentDownload?.title || ""}
                                        onChange={(e) => setCurrentDownload({ ...currentDownload, title: e.target.value })}
                                        placeholder="e.g. React Study Guide"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                    <textarea
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        rows={3}
                                        value={currentDownload?.description || ""}
                                        onChange={(e) => setCurrentDownload({ ...currentDownload, description: e.target.value })}
                                        placeholder="Brief description of the resource..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">File URL</label>
                                    <input
                                        type="url"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        value={currentDownload?.fileUrl || ""}
                                        onChange={(e) => setCurrentDownload({ ...currentDownload, fileUrl: e.target.value })}
                                        placeholder="https://example.com/file.pdf"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            value={currentDownload?.category || "General"}
                                            onChange={(e) => setCurrentDownload({ ...currentDownload, category: e.target.value })}
                                        >
                                            <option value="General">General</option>
                                            <option value="Study Material">Study Material</option>
                                            <option value="Syllabus">Syllabus</option>
                                            <option value="Assignments">Assignments</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            value={currentDownload?.status || "active"}
                                            onChange={(e) => setCurrentDownload({ ...currentDownload, status: e.target.value as any })}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-6 py-3 rounded-xl bg-[#2C4276] text-white font-semibold hover:bg-[#1e2f56] transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Saving..." : "Save Resource"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
