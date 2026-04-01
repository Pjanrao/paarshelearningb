"use client";

import { useState } from "react";
import { X, UploadCloud, Loader2, Plus } from "lucide-react";
import { useUploadVideoMutation } from "@/redux/api/videoApi";
import { toast } from "sonner";

export default function UploadVideoModal({ courseId, open, close }: any) {
    const [uploadVideo, { isLoading }] = useUploadVideoMutation();

    const [topic, setTopic] = useState("");
    const [videos, setVideos] = useState<any[]>([{
        id: Date.now(),
        subtopic: "",
        title: "",
        description: "",
        file: null as File | null
    }]);

    if (!open) return null;

    const handleAddMore = () => {
        setVideos([...videos, {
            id: Date.now(),
            subtopic: "",
            title: "",
            description: "",
            file: null
        }]);
    };

    const handleRemove = (id: number) => {
        if (videos.length > 1) {
            setVideos(videos.filter(v => v.id !== id));
        }
    };

    const updateVideo = (id: number, field: string, value: any) => {
        setVideos(videos.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!topic) {
            toast.error("Please enter the Main Topic");
            return;
        }

        // Validate all videos
        for (let i = 0; i < videos.length; i++) {
            const v = videos[i];
            if (!v.subtopic || !v.title || !v.file) {
                toast.error(`Please fill all required fields and select a video for item #${i + 1}`);
                return;
            }
        }

        try {
            // Upload sequentially
            for (const v of videos) {
                const formData = new FormData();
                formData.append("courseId", courseId);
                formData.append("topic", topic);
                formData.append("subtopic", v.subtopic);
                formData.append("title", v.title);
                formData.append("description", v.description);
                formData.append("file", v.file);

                await uploadVideo(formData).unwrap();
            }

            toast.success("Videos uploaded successfully!");

            // Reset form
            setTopic("");
            setVideos([{ id: Date.now(), subtopic: "", title: "", description: "", file: null }]);
            close();
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error?.data?.error || "Failed to upload videos");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
            <div className="bg-white w-[600px] max-h-[90vh] rounded-xl shadow-xl flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-[#2C4276]">Upload Videos</h2>
                        <p className="text-xs text-gray-500 mt-1">Add one or multiple videos under a topic.</p>
                    </div>
                    <button onClick={close} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form id="upload-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* Main Topic is shared for all videos in this batch */}
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                            <label className="text-sm font-bold text-[#2C4276]">Main Topic *</label>
                            <input
                                type="text"
                                placeholder="e.g. Module 1: Introduction"
                                className="mt-2 w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-[#2C4276] bg-white"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                        </div>

                        {/* Dynamic Video List */}
                        <div className="space-y-8">
                            {videos.map((vid, index) => (
                                <div key={vid.id} className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                    {videos.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemove(vid.id)}
                                            className="absolute -top-3 -right-3 bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-200 shadow-sm border border-red-200"
                                            title="Remove this video"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}

                                    <h3 className="text-sm font-bold text-gray-800 mb-4 border-b pb-2">Video Item #{index + 1}</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Sub Topic *</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. What is React?"
                                                className="mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#2C4276]"
                                                value={vid.subtopic}
                                                onChange={(e) => updateVideo(vid.id, "subtopic", e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Video Title *</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Getting Started"
                                                className="mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#2C4276]"
                                                value={vid.title}
                                                onChange={(e) => updateVideo(vid.id, "title", e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Description (Optional)</label>
                                            <textarea
                                                placeholder="Brief description of the video..."
                                                className="mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#2C4276] resize-none"
                                                rows={2}
                                                value={vid.description}
                                                onChange={(e) => updateVideo(vid.id, "description", e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Video File *</label>
                                            <div className="mt-1 border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition relative">
                                                {vid.file ? (
                                                    <div className="text-center">
                                                        <p className="font-semibold text-gray-700 text-sm truncate max-w-[200px]">{vid.file.name}</p>
                                                        <p className="text-[10px] text-gray-500">{(vid.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateVideo(vid.id, "file", null)}
                                                            className="text-red-500 text-xs font-bold mt-2"
                                                        >
                                                            Remove File
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <UploadCloud className="text-gray-400 mb-1" size={24} />
                                                        <p className="text-xs text-gray-500">Click or drag to upload</p>
                                                        <input
                                                            type="file"
                                                            accept="video/*"
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                            onChange={(e) => {
                                                                if (e.target.files?.[0]) {
                                                                    updateVideo(vid.id, "file", e.target.files[0]);
                                                                }
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add More Button */}
                        <div className="pt-2 pb-4">
                            <button
                                type="button"
                                onClick={handleAddMore}
                                className="w-full py-3 border-2 border-dashed border-[#2C4276]/30 text-[#2C4276] bg-blue-50/30 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition"
                            >
                                <Plus size={18} />
                                Add Another Video
                            </button>
                        </div>
                    </form>
                </div>

                <div className="shrink-0 pt-4 pb-4 px-6 bg-white border-t flex justify-end gap-3 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                    <button
                        type="button"
                        onClick={close}
                        className="px-5 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="upload-form"
                        disabled={isLoading}
                        className="px-5 py-2.5 bg-[#2C4276] text-white font-bold rounded-xl hover:bg-[#1f3159] transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Uploading {videos.length} Video{videos.length > 1 ? 's' : ''}...
                            </>
                        ) : (
                            `Upload ${videos.length} Video${videos.length > 1 ? 's' : ''}`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}