"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetStudentVideosQuery } from "@/redux/api/videoApi";
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import { PlayCircle, Play, Heart, FileText, PenTool, Clock, GraduationCap, BookOpen, Video as VideoIcon, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Loader2, Info, Search, Mic } from "lucide-react";
import Link from "next/link";

export default function CourseVideoPlayerPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    const { data: videosData, isLoading: videosLoading, isError: videosError } = useGetStudentVideosQuery(courseId, { skip: !courseId });
    const { data: coursesData } = useGetCoursesQuery({});

    const [activeVideo, setActiveVideo] = useState<any>(null);
    const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
    const [expandedSubtopics, setExpandedSubtopics] = useState<Record<string, boolean>>({});
    const [completedVideos, setCompletedVideos] = useState<string[]>([]);

    const videos = videosData?.videos || [];

    // Load progress from localStorage on mount
    useEffect(() => {
        if (courseId) {
            const storedProgress = localStorage.getItem(`course_progress_${courseId}`);
            if (storedProgress) {
                try {
                    setCompletedVideos(JSON.parse(storedProgress));
                } catch (e) {
                    console.error("Failed to parse progress", e);
                }
            }
        }
    }, [courseId]);

    const markVideoCompleted = (videoId: string) => {
        if (!completedVideos.includes(videoId)) {
            const newCompleted = [...completedVideos, videoId];
            setCompletedVideos(newCompleted);
            localStorage.setItem(`course_progress_${courseId}`, JSON.stringify(newCompleted));
        }
    };

    // Find course details
    const coursesList = Array.isArray(coursesData?.courses) ? coursesData.courses : [];
    const courseDetails = coursesList.find((c: any) => c._id === courseId) || { name: "Course Details", description: "" };

    // Group videos by Topic and Subtopic
    const groupedVideos: Record<string, Record<string, any[]>> = {};
    videos.forEach((video) => {
        if (!groupedVideos[video.topic]) {
            groupedVideos[video.topic] = {};
        }
        if (!groupedVideos[video.topic][video.subtopic]) {
            groupedVideos[video.topic][video.subtopic] = [];
        }
        groupedVideos[video.topic][video.subtopic].push(video);
    });

    // Flatten videos for Next/Previous navigation
    const sortedVideos = [...videos].sort((a, b) => {
        if (a.topic < b.topic) return -1;
        if (a.topic > b.topic) return 1;
        if (a.subtopic < b.subtopic) return -1;
        if (a.subtopic > b.subtopic) return 1;
        return a.title.localeCompare(b.title);
    });

    const currentIndex = activeVideo ? sortedVideos.findIndex(v => v._id === activeVideo._id) : -1;
    const hasNext = currentIndex !== -1 && currentIndex < sortedVideos.length - 1;
    const hasPrev = currentIndex !== -1 && currentIndex > 0;

    const goToNext = () => {
        if (hasNext) {
            const v = sortedVideos[currentIndex + 1];
            setActiveVideo(v);
            setExpandedTopics(prev => ({ ...prev, [v.topic]: true }));
            setExpandedSubtopics(prev => ({ ...prev, [`${v.topic}-${v.subtopic}`]: true }));
        }
    };

    const goToPrev = () => {
        if (hasPrev) {
            const v = sortedVideos[currentIndex - 1];
            setActiveVideo(v);
            setExpandedTopics(prev => ({ ...prev, [v.topic]: true }));
            setExpandedSubtopics(prev => ({ ...prev, [`${v.topic}-${v.subtopic}`]: true }));
        }
    };

    // Auto-play / select first video on load
    useEffect(() => {
        if (videos.length > 0 && !activeVideo) {
            const firstVid = videos[0];
            setActiveVideo(firstVid);

            // Expand the first topic and subtopic
            setExpandedTopics({
                [firstVid.topic]: true
            });
            setExpandedSubtopics({
                [`${firstVid.topic}-${firstVid.subtopic}`]: true
            });
        }
    }, [videos, activeVideo]);

    const toggleTopic = (topic: string) => {
        setExpandedTopics(prev => ({ ...prev, [topic]: !prev[topic] }));
    };

    const toggleSubtopic = (subtopicKey: string) => {
        setExpandedSubtopics(prev => ({ ...prev, [subtopicKey]: !prev[subtopicKey] }));
    };

    let totalVideosCount = 0;
    videos.forEach(() => { totalVideosCount++; });

    if (videosLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-3xl p-8">
                <Loader2 className="w-10 h-10 text-[#2C4276] animate-spin mb-4" />
                <p className="text-slate-500 font-medium font-sans">Loading course content...</p>
            </div>
        );
    }

    if (videosError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-3xl p-8 text-center">
                <Info size={48} className="text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied or Error Occurred</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-6">You may not be enrolled in this course or something went wrong while fetching the videos.</p>
                <Link
                    href="/student/my-courses"
                    className="bg-[#2C4276] hover:bg-[#1f3159] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md"
                >
                    Back to My Courses
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-full font-sans">
            {/* Navigation Header */}
            <div className="flex items-center justify-between mb-6 gap-4">

                {/* LEFT: Back + Title */}
                <div className="flex items-center gap-3 flex-1">
                    <button
                        onClick={() => router.push("/student/my-courses")}
                        className="p-2 hover:bg-white rounded-xl text-slate-500"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <h1 className="text-2xl lg:text-3xl font-extrabold text-[#1e293b] truncate">
                        {courseDetails.name}
                    </h1>
                </div>

                {/* RIGHT: Progress Bar */}
                {/* RIGHT: SAME WIDTH AS SIDEBAR */}
                <div className="hidden xl:block xl:w-[450px] 2xl:w-[480px]">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-3 text-white shadow-md">
                        <div className="flex justify-between text-xs font-bold mb-1">
                            <span>Progress</span>
                            <span>{totalVideosCount > 0 ? Math.round((completedVideos.length / totalVideosCount) * 100) : 0}%</span>
                        </div>

                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white rounded-full transition-all duration-1000 ease-out" style={{ width: `${totalVideosCount > 0 ? Math.round((completedVideos.length / totalVideosCount) * 100) : 0}%` }}></div>
                        </div>
                    </div>
                </div>

            </div>

            {videos.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[50vh]">
                    <div className="w-20 h-20 bg-blue-50 text-blue-300 rounded-full flex items-center justify-center mb-6">
                        <VideoIcon size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">No videos yet</h2>
                    <p className="text-slate-500">The instructor hasn't uploaded any videos for this course yet.</p>
                </div>
            ) : (
                <div className="flex flex-col xl:flex-row gap-6">
                    {/* LEFT SIDE: VIDEO PLAYER */}
                    <div className="flex-1 space-y-6">
                        {/* Video Player Container */}
                        <div className="w-full bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video relative flex items-center justify-center">
                            {activeVideo ? (
                                <video
                                    key={activeVideo.videoUrl}
                                    className="w-full h-full object-contain bg-black"
                                    controls
                                    autoPlay
                                    controlsList="nodownload"
                                    onEnded={() => markVideoCompleted(activeVideo._id)}
                                >
                                    <source src={activeVideo.videoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <div className="text-white font-medium flex flex-col items-center">
                                    <PlayCircle size={48} className="mb-4 text-white/50" />
                                    <p>Select a video to start playing</p>
                                </div>
                            )}
                        </div>

                        {/* Video Details */}
                        {activeVideo && (
                            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100">
                                <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-lg mb-4">
                                    {activeVideo.topic} • {activeVideo.subtopic}
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">{activeVideo.title}</h2>
                                {activeVideo.description && (
                                    <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">{activeVideo.description}</p>
                                )}

                                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                                    <button
                                        onClick={goToPrev}
                                        disabled={!hasPrev}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200"
                                    >
                                        <ChevronLeft size={18} />
                                        Previous Video
                                    </button>
                                    <button
                                        onClick={goToNext}
                                        disabled={!hasNext}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white bg-[#2C4276] hover:bg-[#1f3159] shadow-md shadow-blue-900/20"
                                    >
                                        Next Video
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDE: VIDEO LIST (ACCORDION) */}
                    <div className="w-full xl:w-[450px] 2xl:w-[480px] shrink-0">
                        <div className="bg-white rounded-[32px] overflow-hidden flex flex-col h-[600px] xl:h-[calc(100vh-140px)] sticky top-6 shadow-[0px_10px_40px_rgba(0,0,0,0.03)] border-0">

                            {/* Course Progress Header */}
                            <div className="p-6 pb-2">


                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Course Content</h3>
                                    <span className="text-sm font-medium text-slate-500">{videos.length} lectures</span>
                                </div>

                                {/* Search Bar */}
                                <div className="relative mb-6">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search lectures..."
                                        className="w-full bg-slate-50 text-slate-700 placeholder-slate-400 rounded-full py-3.5 pl-11 pr-11 outline-none focus:ring-2 ring-blue-500/50 transition-all font-medium text-sm"
                                    />
                                    <Mic className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-blue-500 transition-colors" size={18} />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto outline-none px-6 pb-24 space-y-4 custom-scrollbar">
                                {Object.entries(groupedVideos).map(([topic, subtopics], idx) => {
                                    const isExpanded = expandedTopics[topic];

                                    if (!isExpanded) {
                                        return (
                                            <button
                                                key={topic}
                                                onClick={() => toggleTopic(topic)}
                                                className="w-full bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-gray-300 transition-all group focus:outline-none"
                                            >
                                                <span className="font-bold text-slate-800 text-sm tracking-wide">{topic}</span>
                                                <ChevronDown size={20} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                                            </button>
                                        );
                                    }

                                    return (
                                        <div key={topic} className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                                            {/* Header */}
                                            <button
                                                onClick={() => toggleTopic(topic)}
                                                className="w-full p-5 pb-3 flex flex-col justify-start focus:outline-none"
                                            >
                                                <span className="font-bold text-slate-800 text-sm tracking-wide uppercase">{topic}</span>
                                            </button>

                                            {/* Expanded Subtopics List */}
                                            <div className="px-3 pb-3 space-y-4 pt-3">
                                                {Object.entries(subtopics).map(([subtopic, vids]) => {
                                                    const subtopicKey = `${topic}-${subtopic}`;
                                                    const isSubExpanded = expandedSubtopics[subtopicKey];

                                                    // Calculate if any video in this subtopic is currently active
                                                    const hasActiveVideo = vids.some(v => activeVideo?._id === v._id);

                                                    return (
                                                        <div
                                                            key={subtopicKey}
                                                            className={`bg-white rounded-xl overflow-hidden transition-all duration-300 ${isSubExpanded
                                                                ? "border border-blue-200 shadow-md shadow-blue-900/5 ring-1 ring-inset ring-blue-50"
                                                                : "border border-gray-100 shadow-sm hover:border-blue-100 hover:shadow-md hover:shadow-blue-900/5"
                                                                }`}
                                                            style={{ borderLeftWidth: isSubExpanded ? '3px' : '1px', borderLeftColor: isSubExpanded ? '#3b82f6' : '#f3f4f6' }}
                                                        >
                                                            {/* Subtopic Header (Clickable) */}
                                                            <button
                                                                onClick={() => toggleSubtopic(subtopicKey)}
                                                                className="w-full text-left p-4 flex items-start gap-4 focus:outline-none"
                                                            >
                                                                <div className={`mt-0.5 shrink-0 flex items-center justify-center p-2 rounded-full border ${isSubExpanded || hasActiveVideo ? "border-blue-100 bg-blue-50 text-blue-600" : "border-slate-100 text-slate-400"}`}>
                                                                    <PlayCircle size={22} strokeWidth={1.5} className={(isSubExpanded || hasActiveVideo) ? "fill-blue-100" : ""} />
                                                                </div>

                                                                <div className="flex-1 pr-2">
                                                                    <h4 className={`text-[15px] font-bold tracking-tight mb-1.5 ${isSubExpanded || hasActiveVideo ? "text-slate-900" : "text-slate-700"}`}>
                                                                        {subtopic}
                                                                    </h4>
                                                                    <div className="inline-block px-2.5 py-0.5 bg-[#e0e7ff] text-[#4f46e5] text-[11px] font-semibold rounded mx-0">
                                                                        Beginner
                                                                    </div>
                                                                </div>

                                                                <div className={`shrink-0 mt-1 transition-transform duration-300 ${isSubExpanded || hasActiveVideo ? "text-slate-600" : "text-slate-400"}`}>
                                                                    {isSubExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                                </div>
                                                            </button>

                                                            {/* Expanded Detailed View (Level 3 + Actions) */}
                                                            {isSubExpanded && (
                                                                <div className="bg-slate-50/60 p-4 border-t border-gray-100 space-y-4">
                                                                    {/* Row 1: Quick Actions */}
                                                                    <div className="flex items-center gap-6 px-1">
                                                                        <button
                                                                            onClick={() => {
                                                                                setActiveVideo(vids[0]);
                                                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                            }}
                                                                            className={`flex items-center gap-2 font-bold text-sm tracking-wide focus:outline-none transition-all ${
                                                                                hasActiveVideo 
                                                                                ? "text-green-600" 
                                                                                : "text-blue-600 hover:underline"
                                                                            }`}
                                                                        >
                                                                            <Play size={16} strokeWidth={2.5} className="fill-current" /> 
                                                                            {hasActiveVideo ? "Playing..." : "Play Now"}
                                                                        </button>
                                                                        <button className="flex items-center gap-2 text-blue-600 font-bold text-sm tracking-wide hover:underline focus:outline-none transition-all">
                                                                            <Heart size={16} strokeWidth={2.5} /> Favorite
                                                                        </button>
                                                                    </div>

                                                                    {/* Row 3: Stats Cards */}
                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        <div className="bg-white rounded-lg p-3.5 shadow-sm border border-gray-100">
                                                                            <div className="flex items-center gap-2 text-slate-500 text-[13px] font-medium mb-1.5">
                                                                                <Clock size={15} strokeWidth={2} /> Duration
                                                                            </div>
                                                                            <div className="font-bold text-slate-800 tracking-tight">26:34</div>
                                                                        </div>
                                                                        <div className="bg-white rounded-lg p-3.5 shadow-sm border border-gray-100">
                                                                            <div className="flex items-center gap-2 text-slate-500 text-[13px] font-medium mb-1.5">
                                                                                <GraduationCap size={15} strokeWidth={2} /> Level
                                                                            </div>
                                                                            <div className="font-bold text-slate-800 tracking-tight">Beginner</div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Row 4: Learning Objectives */}
                                                                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                                                                        <div className="flex items-center gap-2 text-slate-800 font-bold text-[15px] tracking-tight mb-3">
                                                                            <BookOpen size={18} className="text-blue-600" /> Learning Objectives
                                                                        </div>
                                                                        <ul className="space-y-2.5">
                                                                            <li className="flex items-start gap-2.5 text-sm text-slate-600">
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                                                                                <span className="leading-snug">Understand key concepts</span>
                                                                            </li>
                                                                            <li className="flex items-start gap-2.5 text-sm text-slate-600">
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                                                                                <span className="leading-snug">Apply practical examples</span>
                                                                            </li>
                                                                        </ul>
                                                                    </div>

                                                                    {/* Videos List (Nested) - Show individual clips if multiple */}

                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Generate Certificate Button overlay at bottom */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-12 pointer-events-none">
                                <div className="pointer-events-auto w-full bg-slate-200/50 backdrop-blur-sm text-slate-400 py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                                    Generate Certificate
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
