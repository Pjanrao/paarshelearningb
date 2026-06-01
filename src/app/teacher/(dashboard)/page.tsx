"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, Circle, ChevronDown, ChevronUp, BookOpen, Users } from "lucide-react";
import toast from "react-hot-toast";

export default function TeacherDashboard() {
    const [batches, setBatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedBatch, setExpandedBatch] = useState<string | null>(null);
    const [teacherProfile, setTeacherProfile] = useState<any>(null);
    const [lastUpdated, setLastUpdated] = useState<string>("");

    const fetchTeacherProfile = async () => {
        try {
            const res = await fetch("/api/teacher/profile");
            if (!res.ok) throw new Error("Failed to load teacher profile");
            const data = await res.json();
            setTeacherProfile(data.teacher || null);
        } catch (error: any) {
            console.warn("Teacher profile unavailable:", error.message || error);
        }
    };

    const fetchBatches = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/teacher/batches");
            if (!res.ok) throw new Error("Failed to load batches");
            const data = await res.json();
            setBatches(data.batches || []);
        } catch (error: any) {
            toast.error(error.message || "Error loading batches");
        } finally {
            setLoading(false);
        }
    };

    const refreshData = async () => {
        await Promise.all([fetchTeacherProfile(), fetchBatches()]);
        setLastUpdated(new Date().toLocaleTimeString());
    };

    useEffect(() => {
        refreshData();

        const onFocus = () => {
            refreshData();
        };

        const intervalId = window.setInterval(() => {
            refreshData();
        }, 30000);

        window.addEventListener("focus", onFocus);
        return () => {
            window.removeEventListener("focus", onFocus);
            window.clearInterval(intervalId);
        };
    }, []);

    const toggleSyllabusStatus = async (batchId: string, topicId: string, currentStatus: boolean) => {
        try {
            const newStatus = !currentStatus;

            // Optimistic update
            setBatches((prevBatches) => prevBatches.map(batch => {
                if (batch._id === batchId) {
                    const progIndex = batch.syllabusProgress?.findIndex((p: any) => p.topicId === topicId);
                    let newProgress = [...(batch.syllabusProgress || [])];
                    if (progIndex >= 0) {
                        newProgress[progIndex].completed = newStatus;
                    } else {
                        newProgress.push({ topicId, completed: newStatus });
                    }
                    return { ...batch, syllabusProgress: newProgress };
                }
                return batch;
            }));

            const res = await fetch(`/api/teacher/batches/${batchId}/syllabus`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topicId, completed: newStatus })
            });

            if (!res.ok) {
                throw new Error("Failed to update status");
            }
            toast.success("Saved");
        } catch (error) {
            toast.error("Failed to update syllabus status");
            fetchBatches(); // Revert back
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Assigned Batches</h1>
                    <p className="text-sm text-gray-500">Manage your batches and track syllabus completion</p>
                    {lastUpdated && (
                        <p className="text-xs text-gray-400 mt-1">Last refreshed at {lastUpdated}</p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={refreshData}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
                >
                    Refresh
                </button>
            </div>
            {teacherProfile?.assignedCourses?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {teacherProfile.assignedCourses.map((course: string, index: number) => (
                            <span key={index} className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                <BookOpen size={14} /> {course}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 mt-3">No assigned courses yet.</p>
                )}

            {batches.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center border">
                    <BookOpen className="mx-auto text-gray-300 mb-3" size={48} />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No batches assigned</h3>
                    <p className="text-gray-500 text-sm">You haven't been assigned to any batches yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {batches.map((batch) => {
                        const isExpanded = expandedBatch === batch._id;
                        const course = batch.courseId || {};
                        const syllabus = course.syllabus || [];
                        const progress = batch.syllabusProgress || [];

                        const completedCount = syllabus.filter((topic: any) =>
                            progress.some((p: any) => p.topicId === topic._id && p.completed)
                        ).length;

                        const progressPercent = syllabus.length > 0 ? Math.round((completedCount / syllabus.length) * 100) : 0;

                        return (
                            <div key={batch._id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <div
                                    className="p-5 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
                                    onClick={() => setExpandedBatch(isExpanded ? null : batch._id)}
                                >
                                    <div className="flex items-center gap-4">
                                        {course.thumbnail ? (
                                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border">
                                                <img src={course.thumbnail} className="w-full h-full object-cover" alt="Course" />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 border">
                                                <BookOpen className="text-blue-500" size={24} />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{batch.name}</h3>
                                            <p className="text-sm text-gray-500 font-medium">{course.name || "Unknown Course"}</p>
                                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 font-medium bg-gray-100 w-fit px-2 py-1 rounded">
                                                <Users size={14} />
                                                <span>{batch.students?.length || 0} Students Enrolled</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className="flex-1 md:w-48 text-right">
                                            <div className="flex justify-between items-center mb-1 text-xs">
                                                <span className="font-medium text-gray-500">Syllabus Progress</span>
                                                <span className="font-bold text-gray-900">{progressPercent}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div
                                                    className="bg-[#2C4276] h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${progressPercent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="text-gray-400 bg-gray-100 p-2 rounded-full hidden md:block">
                                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t bg-gray-50 p-5 p-0">
                                        <div className="p-5">
                                            <h4 className="font-bold text-gray-900 mb-4 px-2">Course Syllabus Tracking</h4>

                                            {syllabus.length === 0 ? (
                                                <p className="text-sm text-gray-500 italic px-2">No syllabus mapped to this course.</p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {syllabus.map((topic: any, index: number) => {
                                                        const isCompleted = progress.some((p: any) => p.topicId === topic._id && p.completed);

                                                        return (
                                                            <div
                                                                key={topic._id}
                                                                onClick={() => toggleSyllabusStatus(batch._id, topic._id, isCompleted)}
                                                                className={`p-3 rounded-lg border transition-all cursor-pointer flex gap-4 items-start
                                                                    ${isCompleted ? "bg-green-50 border-green-200" : "bg-white border-gray-200 hover:border-blue-300"}
                                                                `}
                                                            >
                                                                <button className="mt-0.5 focus:outline-none flex-shrink-0">
                                                                    {isCompleted ? (
                                                                        <CheckCircle2 className="text-green-600" size={24} />
                                                                    ) : (
                                                                        <Circle className="text-gray-300 hover:text-blue-500 transition-colors" size={24} />
                                                                    )}
                                                                </button>
                                                                <div>
                                                                    <h5 className={`font-semibold text-sm ${isCompleted ? "text-green-900" : "text-gray-800"}`}>
                                                                        {topic.title}
                                                                    </h5>
                                                                    {topic.description && (
                                                                        <p className={`text-xs mt-1 line-clamp-2 ${isCompleted ? "text-green-700/80" : "text-gray-500"}`}>
                                                                            {topic.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
