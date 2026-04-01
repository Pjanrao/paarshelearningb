"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Plus } from "lucide-react";
import {
    useUploadVideoMutation,
    useUpdateVideoMutation,
    useDeleteVideoMutation,
} from "@/redux/api/videoApi";
import { toast } from "sonner";

export default function EditTopicModal({ data, open, close }: any) {
    const [uploadVideo, { isLoading }] = useUploadVideoMutation();
    const [updateVideo] = useUpdateVideoMutation();
    const [deleteVideo] = useDeleteVideoMutation();

    const [topic, setTopic] = useState("");
    const [videos, setVideos] = useState<any[]>([]);
    const [deletedIds, setDeletedIds] = useState<string[]>([]);

    // ✅ FIXED PREFILL (IMPORTANT)
    useEffect(() => {
        if (data) {
            setTopic(data.topic);

            const mapped = data.videos.map((v: any) => ({
                id: v._id,
                subtopic: v.subtopic,
                title: v.title,
                description: v.description,
                file: null,
                isExisting: true,
                courseId: v.course,
                videoUrl: v.videoUrl, // ✅ preview
            }));

            setVideos(mapped);
            setDeletedIds([]);
        }
    }, [data]);

    if (!open) return null;

    // ✅ ADD NEW VIDEO
    const handleAddMore = () => {
        setVideos([
            ...videos,
            {
                id: Date.now(),
                subtopic: "",
                title: "",
                description: "",
                file: null,
                isExisting: false,
                courseId: data?.videos?.[0]?.course,
            },
        ]);
    };

    // ✅ REMOVE VIDEO
    const handleRemove = (id: number) => {
        const removed = videos.find((v) => v.id === id);

        if (removed?.isExisting) {
            setDeletedIds((prev) => [...prev, removed.id]);
        }

        setVideos(videos.filter((v) => v.id !== id));
    };

    // ✅ UPDATE FIELD
    const updateVideoField = (id: number, field: string, value: any) => {
        setVideos(videos.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
    };

    // ✅ SUBMIT
    const handleSubmit = async () => {
        try {
            // DELETE
            for (const id of deletedIds) {
                await deleteVideo({
                    id,
                    courseId: data?.videos?.[0]?.course,
                }).unwrap();
            }

            // UPDATE + ADD
            for (const item of videos) {
                if (!item.title || !item.subtopic) continue;

                // UPDATE
                if (item.isExisting) {
                    await updateVideo({
                        id: item.id,
                        data: {
                            title: item.title,
                            description: item.description,
                            topic: topic,
                            subtopic: item.subtopic,
                            course: item.courseId,
                        },
                    }).unwrap();
                }

                // ADD NEW
                else {
                    if (!item.file) continue;

                    const formData = new FormData();
                    formData.append("title", item.title);
                    formData.append("description", item.description || "");
                    formData.append("courseId", item.courseId);
                    formData.append("topic", topic);
                    formData.append("subtopic", item.subtopic);
                    formData.append("file", item.file);

                    await uploadVideo(formData).unwrap();
                }
            }

            toast.success("Topic updated successfully");
            close();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update topic");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
            <div className="bg-white w-[600px] max-h-[90vh] rounded-xl shadow-xl flex flex-col overflow-hidden">

                {/* HEADER */}
                <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
                    <h2 className="text-xl font-bold text-[#2C4276]">Edit Topic</h2>
                    <button onClick={close}>
                        <X />
                    </button>
                </div>

                {/* BODY */}
                <div className="p-6 overflow-y-auto space-y-4">

                    {/* TOPIC */}
                    <input
                        className="w-full border p-2"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Main Topic"
                    />

                    {/* VIDEOS */}
                    {videos.map((vid, index) => (
                        <div key={vid.id} className="border p-4 rounded relative">

                            <button
                                type="button"
                                onClick={() => handleRemove(vid.id)}
                                className="absolute top-2 right-2 text-red-500"
                            >
                                <X size={16} />
                            </button>

                            <p className="font-bold mb-2">Video #{index + 1}</p>

                            <input
                                className="w-full border p-2 mb-2"
                                value={vid.subtopic}
                                onChange={(e) =>
                                    updateVideoField(vid.id, "subtopic", e.target.value)
                                }
                                placeholder="Subtopic"
                            />

                            <input
                                className="w-full border p-2 mb-2"
                                value={vid.title}
                                onChange={(e) =>
                                    updateVideoField(vid.id, "title", e.target.value)
                                }
                                placeholder="Title"
                            />

                            <textarea
                                className="w-full border p-2 mb-2"
                                value={vid.description}
                                onChange={(e) =>
                                    updateVideoField(vid.id, "description", e.target.value)
                                }
                            />

                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        updateVideoField(vid.id, "file", e.target.files[0]);
                                    }
                                }}
                            />

                            {/* ✅ PREVIEW */}
                            {vid.file ? (
                                <video
                                    src={URL.createObjectURL(vid.file)}
                                    controls
                                    className="w-full mt-2"
                                />
                            ) : vid.videoUrl ? (
                                <video src={vid.videoUrl} controls className="w-full mt-2" />
                            ) : null}
                        </div>
                    ))}

                    {/* ADD MORE */}
                    <button
                        type="button"
                        onClick={handleAddMore}
                        className="w-full border-dashed border-2 p-2"
                    >
                        + Add Video
                    </button>
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-[#2C4276] text-white px-4 py-2 rounded"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : "Update"}
                    </button>
                </div>
            </div>
        </div>
    );
}