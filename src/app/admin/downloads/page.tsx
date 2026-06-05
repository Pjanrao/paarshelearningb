"use client";

import React, { useState, useEffect } from "react";
import {
    FileText,
    Plus,
    Search,
    Loader2,
    X,
    Download as DownloadIcon,
    Pencil,
    Trash2,
    CheckCircle,
    FileSpreadsheet,
    FileCode,
    FileMinus
} from "lucide-react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

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
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteId, setDeleteId] = useState<{ id: string; title: string } | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchDownloads();
    }, []);

    const fetchDownloads = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/admin/downloads");
            const data = await res.json();
            if (res.ok) {
                setDownloads(data || []);
            }
        } catch (error) {
            toast.error("Failed to fetch downloads");
        } finally {
            setIsLoading(false);
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!currentDownload?.title?.trim()) newErrors.title = "Title is required";
        if (!currentDownload?.fileUrl?.trim()) newErrors.fileUrl = "File URL is required";
        else if (!currentDownload.fileUrl.startsWith('http')) newErrors.fileUrl = "Invalid URL format";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

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
                toast.success(`Resource ${currentDownload?._id ? "updated" : "published"} successfully`);
                setIsModalOpen(false);
                fetchDownloads();
            } else {
                const error = await res.json();
                throw new Error(error.message || "Failed to save resource");
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleteLoading(true);
        try {
            const res = await fetch(`/api/admin/downloads/${deleteId.id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Resource deleted permanently");
                fetchDownloads();
                setDeleteId(null);
            }
        } catch (error) {
            toast.error("Failed to remove resource");
        } finally {
            setDeleteLoading(false);
        }
    };

    const filteredDownloads = downloads.filter(d =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getFileIcon = (category: string) => {
        switch (category) {
            case "Syllabus": return <FileText className="text-blue-500" size={24} />;
            case "Study Material": return <FileSpreadsheet className="text-green-500" size={24} />;
            case "Assignments": return <FileCode className="text-purple-500" size={24} />;
            default: return <FileText className="text-gray-500" size={24} />;
        }
    };

    return (
        <div className="bg-gray-50 h-full p-4 sm:p-6">
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#2C4276] tracking-tight">Downloads Management</h1>
                        <p className="text-gray-500 text-sm mt-1.5 font-medium">Publish resources and study materials for students</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative w-full sm:w-72">
                            <input
                                type="text"
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 pr-4 py-3 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-[#2C4276]/10 w-full shadow-sm bg-white text-gray-600 outline-none transition-all placeholder:text-gray-400"
                            />
                            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        </div>
                        <button
                            onClick={() => {
                                setCurrentDownload({ title: "", description: "", fileUrl: "", category: "General", status: "active" });
                                setErrors({});
                                setIsModalOpen(true);
                            }}
                            className="bg-[#2C4276] text-white px-6 py-3 rounded-2xl hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2C4276]/20 font-bold active:scale-95 whitespace-nowrap"
                        >
                            <Plus size={20} />
                            <span>Add New Resource</span>
                        </button>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-3xl shadow-sm border border-gray-50">
                    <Loader2 className="animate-spin text-[#2C4276]" size={40} />
                    <p className="text-gray-400 font-medium tracking-wide">Fetching library records...</p>
                </div>
            ) : filteredDownloads.length === 0 ? (
                <div className="text-center py-24 px-4 bg-white rounded-3xl shadow-sm border border-gray-100">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="text-gray-300" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">No Resources Found</h3>
                    <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
                        {searchQuery
                            ? "No matching resources found in the library."
                            : "Your downloads library is empty. Start adding some educational content!"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredDownloads.map((download) => (
                        <div key={download._id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col h-full">
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-white transition-colors border border-gray-50">
                                        {getFileIcon(download.category)}
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${download.status === 'active' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
                                        {download.status}
                                    </div>
                                </div>
                                <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-1">{download.title}</h3>
                                <p className="text-gray-500 text-xs font-medium mb-4 line-clamp-2 leading-relaxed">{download.description || "No description provided."}</p>

                                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-50">
                                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-black uppercase tracking-tighter">
                                        <DownloadIcon size={14} />
                                        {download.downloadCount} Hits
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-gray-200" />
                                    <div className="text-gray-400 text-[10px] font-black uppercase tracking-tighter truncate">
                                        {download.category}
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 pb-6 mt-auto flex gap-2">
                                <button
                                    onClick={() => {
                                        setCurrentDownload(download);
                                        setErrors({});
                                        setIsModalOpen(true);
                                    }}
                                    className="flex-1 py-3 bg-[#2C4276] text-white rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2C4276]/10 text-xs font-black uppercase tracking-widest active:scale-95"
                                >
                                    <Pencil size={14} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => setDeleteId({ id: download._id, title: download.title })}
                                    className="p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all border border-red-50 active:scale-95"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#2C4276]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="px-8 py-6 border-b flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-black text-[#2C4276] tracking-tight">{currentDownload?._id ? "Update Resource" : "Publish Resource"}</h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Educational Content Management</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-gray-600 transition-all border border-transparent hover:border-gray-100">
                                <X size={22} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
                            <div className="p-8 pb-4 space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider ml-1">Resource Title <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl outline-none focus:ring-4 focus:ring-[#2C4276]/10 transition-all font-semibold ${errors.title ? 'border-red-500 bg-red-50' : 'border-gray-100'}`}
                                        value={currentDownload?.title || ""}
                                        onChange={(e) => {
                                            setCurrentDownload({ ...currentDownload, title: e.target.value });
                                            if (errors.title) setErrors({ ...errors, title: "" });
                                        }}
                                        placeholder="e.g. FullStack Roadmap 2024"
                                    />
                                    {errors.title && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.title}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider ml-1">Brief Description</label>
                                    <textarea
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#2C4276]/10 transition-all font-semibold resize-none"
                                        rows={3}
                                        value={currentDownload?.description || ""}
                                        onChange={(e) => setCurrentDownload({ ...currentDownload, description: e.target.value })}
                                        placeholder="What's inside this resource?"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider ml-1">File Source URL <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl outline-none focus:ring-4 focus:ring-[#2C4276]/10 transition-all font-semibold ${errors.fileUrl ? 'border-red-500 bg-red-50' : 'border-gray-100'}`}
                                            value={currentDownload?.fileUrl || ""}
                                            onChange={(e) => {
                                                setCurrentDownload({ ...currentDownload, fileUrl: e.target.value });
                                                if (errors.fileUrl) setErrors({ ...errors, fileUrl: "" });
                                            }}
                                            placeholder="https://cloud.storage.com/file.pdf"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                                            <DownloadIcon size={18} />
                                        </div>
                                    </div>
                                    {errors.fileUrl && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.fileUrl}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider ml-1">Classification</label>
                                        <select
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#2C4276]/10 transition-all font-semibold bg-white cursor-pointer"
                                            value={currentDownload?.category || "General"}
                                            onChange={(e) => setCurrentDownload({ ...currentDownload, category: e.target.value })}
                                        >
                                            <option value="General">General</option>
                                            <option value="Study Material">Study Material</option>
                                            <option value="Syllabus">Syllabus</option>
                                            <option value="Assignments">Assignments</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider ml-1">Availability</label>
                                        <select
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#2C4276]/10 transition-all font-semibold bg-white cursor-pointer"
                                            value={currentDownload?.status || "active"}
                                            onChange={(e) => setCurrentDownload({ ...currentDownload, status: e.target.value as any })}
                                        >
                                            <option value="active">Active (Visible)</option>
                                            <option value="inactive">Inactive (Hidden)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 pt-4 flex gap-4 bg-white border-t border-gray-50">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 text-gray-500 font-black text-[11px] uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-[2] py-4 bg-[#2C4276] text-white rounded-2xl hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-[#2C4276]/20 transition-all font-black text-[11px] uppercase tracking-widest active:scale-95"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                                    <span>{currentDownload?._id ? "Update Archive" : "Publish Resource"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="max-w-md bg-white rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="p-8 text-center bg-white space-y-6">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-red-50/50">
                            <FileMinus className="text-red-600" size={32} />
                        </div>
                        <div className="space-y-2">
                            <AlertDialogTitle className="text-2xl font-black text-gray-900 tracking-tight">
                                Delete Resource?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm font-medium text-gray-400">
                                This will permanently remove <span className="text-red-500 font-black">{deleteId?.title}</span> from the student library. This action cannot be reversed.
                            </AlertDialogDescription>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={handleDelete}
                                disabled={deleteLoading}
                                className="w-full py-7 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-red-200"
                            >
                                {deleteLoading ? <Loader2 className="animate-spin" size={20} /> : "Destroy Resource"}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setDeleteId(null)}
                                className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 bg-transparent hover:bg-gray-50 rounded-2xl"
                            >
                                Keep it archived
                            </Button>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
