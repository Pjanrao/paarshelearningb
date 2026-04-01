"use client";

import { useState, useEffect } from "react";
import { X, UploadCloud, Loader2 } from "lucide-react";
import { useUpdateVideoMutation } from "@/redux/api/videoApi";
import { toast } from "sonner";

export default function EditVideoModal({ video, open, close }: any) {
    const [updateVideo, { isLoading }] = useUpdateVideoMutation();

    const [topic, setTopic] = useState("");

    const [form, setForm] = useState({
        subtopic: "",
        title: "",
        description: "",
        file: null as File | null,
    });

    useEffect(() => {
        if (video) {
            setTopic(video.topic);
            setForm({
                subtopic: video.subtopic,
                title: video.title,
                description: video.description || "",
                file: null,
            });
        }
    }, [video]);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!topic || !form.subtopic || !form.title) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            // ✅ CASE 1: New video uploaded
            if (form.file) {
                const formData = new FormData();
                formData.append("courseId", video.course);
                formData.append("topic", topic);
                formData.append("subtopic", form.subtopic);
                formData.append("title", form.title);
                formData.append("description", form.description);
                formData.append("file", form.file);

                // call upload API (same as create)
                await fetch("/api/videos", {
                    method: "POST",
                    body: formData,
                });

                // delete old video
                await fetch(`/api/videos/${video._id}`, {
                    method: "DELETE",
                });

                toast.success("Video replaced successfully");
            }

            // ✅ CASE 2: Only text update
            else {
                await updateVideo({
                    id: video._id,
                    data: {
                        topic,
                        subtopic: form.subtopic,
                        title: form.title,
                        description: form.description,
                    },
                }).unwrap();

                toast.success("Video updated successfully");
            }

            close();
        } catch (error: any) {
            toast.error("Update failed");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
            <div className="bg-white w-[600px] max-h-[90vh] rounded-xl shadow-xl flex flex-col relative overflow-hidden">

                {/* HEADER */}
                <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-[#2C4276]">Edit Video</h2>
                        <p className="text-xs text-gray-500 mt-1">
                            Update video details under a topic.
                        </p>
                    </div>
                    <button onClick={close} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* BODY */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">

                        {/* MAIN TOPIC */}
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                            <label className="text-sm font-bold text-[#2C4276]">
                                Main Topic *
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Module 1: Introduction"
                                className="mt-2 w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-[#2C4276] bg-white"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                        </div>

                        {/* VIDEO ITEM (same UI as upload) */}
                        <div className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-800 mb-4 border-b pb-2">
                                Video Item
                            </h3>

                            <div className="space-y-4">

                                {/* SUBTOPIC */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Sub Topic *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. What is React?"
                                        className="mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#2C4276]"
                                        value={form.subtopic}
                                        onChange={(e) =>
                                            setForm({ ...form, subtopic: e.target.value })
                                        }
                                    />
                                </div>

                                {/* TITLE */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Video Title *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Getting Started"
                                        className="mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#2C4276]"
                                        value={form.title}
                                        onChange={(e) =>
                                            setForm({ ...form, title: e.target.value })
                                        }
                                    />
                                </div>

                                {/* DESCRIPTION */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        placeholder="Brief description of the video..."
                                        className="mt-1 w-full border rounded-lg p-2 resize-none"
                                        rows={2}
                                        value={form.description}
                                        onChange={(e) =>
                                            setForm({ ...form, description: e.target.value })
                                        }
                                    />
                                </div>

                                {/* FILE SECTION (UI SAME but not required) */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Video File (Optional)
                                    </label>

                                    <div className="mt-1 border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">

                                        {/* EXISTING VIDEO */}
                                        {video?.videoUrl && !form.file && (
                                            <div className="mb-3">
                                                <video
                                                    src={video.videoUrl}
                                                    controls
                                                    className="w-full rounded-lg max-h-[200px]"
                                                />
                                                <p className="text-[10px] text-gray-500 text-center mt-1">
                                                    Current video
                                                </p>
                                            </div>
                                        )}

                                        {/* NEW FILE SELECTED */}
                                        {form.file ? (
                                            <div className="text-center">
                                                <p className="text-sm font-semibold truncate">
                                                    {form.file.name}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => setForm({ ...form, file: null })}
                                                    className="text-red-500 text-xs mt-2"
                                                >
                                                    Remove New File
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center relative">
                                                <UploadCloud className="text-gray-400 mb-1" size={24} />
                                                <p className="text-xs text-gray-500">
                                                    Click to replace video
                                                </p>

                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={(e) => {
                                                        if (e.target.files?.[0]) {
                                                            setForm({ ...form, file: e.target.files[0] });
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>

                    </form>
                </div>

                {/* FOOTER */}
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
                        form="edit-form"
                        disabled={isLoading}
                        className="px-5 py-2.5 bg-[#2C4276] text-white font-bold rounded-xl flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Update Video"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}