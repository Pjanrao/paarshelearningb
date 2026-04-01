"use client";

import { useState } from "react";
import {
    Search,
    Copy,
    Link as LinkIcon,
    Video,
    Calendar,
    Clock,
    User,
    PlayCircle,
    Info,
    Loader2
} from "lucide-react";
import { useGetStudentMeetingsQuery } from "@/redux/api/meetingApi";

export default function MeetingLinksPage() {
    const [activeTab, setActiveTab] = useState("All Meetings");
    const [searchQuery, setSearchQuery] = useState("");

    const { data, isLoading, isError } = useGetStudentMeetingsQuery();
    const rawMeetings = data?.meetings || [];

    const getPlatformIcon = (platform: string) => {
        const lower = platform.toLowerCase();
        if (lower.includes("zoom")) return "/images/icons/zoom.png";
        if (lower.includes("teams")) return "/images/icons/teams.png";
        if (lower.includes("meet")) return "/images/icons/meet.png";
        return "/images/icons/zoom.png"; // Default
    };

    const meetings = rawMeetings.map((m: any) => {
        const now = new Date();
        const startTime = new Date(m.startTime);
        const endTime = new Date(m.endTime);

        const status = startTime > now ? "Upcoming" : "Past";

        return {
            id: m._id,
            title: m.title,
            description: m.description || (m.course?.description ? m.course.description.substring(0, 100) + "..." : "No description available"),
            status: status,
            date: startTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            time: `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            instructor: m.teacher?.name || "N/A",
            platform: m.platform || "Zoom",
            platformIcon: getPlatformIcon(m.platform || "Zoom"),
            meetingLink: m.meetingLink
        };
    });

    const tabs = ["All Meetings", "Upcoming", "Past Meetings"];

    const filteredMeetings = meetings.filter(meeting => {
        if (activeTab === "Upcoming") return meeting.status === "Upcoming";
        if (activeTab === "Past Meetings") return meeting.status === "Past";
        return true;
    }).filter(meeting =>
        meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meeting.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCopyLink = (link?: string) => {
        if (link) {
            navigator.clipboard.writeText(link);
            alert("Meeting link copied to clipboard!");
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-3xl p-8">
                <Loader2 className="w-10 h-10 text-[#2C4276] animate-spin mb-4" />
                <p className="text-slate-500 font-medium font-sans">Loading meetings...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-3xl p-8">
                <Info size={48} className="text-red-500 mb-4" />
                <p className="text-red-500 font-bold uppercase tracking-widest">Error loading meetings</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-[#2C4276] text-white px-6 py-2 rounded-xl text-sm font-bold"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-white rounded-3xl p-8 lg:p-10 shadow-sm overflow-hidden border border-gray-100">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Meeting Links</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Access your class meeting links and recordings
                    </p>
                </div>

                <div className="relative w-full lg:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by title or instructor..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] transition-all text-sm text-slate-900 placeholder:text-slate-400 shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabs Section */}
            <div className="flex items-center gap-8 mb-10 border-b border-gray-100">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-sm font-bold transition-all relative ${activeTab === tab
                            ? "text-[#2C4276]"
                            : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2C4276] rounded-full"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Meetings List */}
            <div className="space-y-6">
                {filteredMeetings.map((meeting) => (
                    <div
                        key={meeting.id}
                        className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 hover:border-[#2C4276]/30 transition-all group shadow-sm hover:shadow-md"
                    >
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                            <div className="space-y-4 flex-1">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#2C4276] transition-colors">
                                        {meeting.title}
                                    </h2>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${meeting.status === 'Upcoming'
                                        ? 'bg-green-100 text-green-700 border border-green-200'
                                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                                        }`}>
                                        {meeting.status}
                                    </span>
                                </div>
                                <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
                                    {meeting.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                                        <Calendar size={14} className="text-[#2C4276]" />
                                        <span className="text-xs text-slate-600 font-medium">{meeting.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                                        <Clock size={14} className="text-[#2C4276]" />
                                        <span className="text-xs text-slate-600 font-medium">{meeting.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 text-[#2C4276]">
                                        <div className="w-1.5 h-4 bg-[#2C4276]/30 rounded-full"></div>
                                        <span className="text-xs font-bold tracking-tight">{meeting.platform}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                    <User size={14} />
                                    <span>Instructor: {meeting.instructor}</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
                                {meeting.status === 'Upcoming' ? (
                                    <>
                                        <button
                                            onClick={() => handleCopyLink(meeting.meetingLink)}
                                            className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-slate-700 px-6 py-2.5 rounded-xl text-xs font-bold transition-all border border-gray-200"
                                        >
                                            <Copy size={16} />
                                            Copy Link
                                        </button>
                                        <a
                                            href={meeting.meetingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 bg-[#2C4276] hover:bg-[#1e2e54] text-white px-6 py-2.5 rounded-xl text-xs font-black tracking-widest transition-all shadow-lg shadow-[#2C4276]/20"
                                        >
                                            <LinkIcon size={16} />
                                            JOIN MEETING
                                        </a>
                                        <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
                                            <Info size={12} />
                                            <span>Join 5 minutes early</span>
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredMeetings.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
                        <Video size={64} className="text-gray-200 mb-4" />
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em]">No meetings found</p>
                    </div>
                )}
            </div>

            {/* Footer Section */}
            <div className="mt-10 bg-gray-50 border border-gray-100 rounded-3xl p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6 text-center lg:text-left">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#2C4276]">
                            <Info size={24} />
                        </div>
                        <div>
                            <h3 className="text-slate-900 font-bold text-lg">Need Technical Help?</h3>
                            <p className="text-slate-500 text-sm">If you're having trouble joining a meeting or accessing recordings, our support team is here to help.</p>
                        </div>
                    </div>
                    <button className="bg-[#2C4276] hover:bg-[#1e2e54] text-white px-8 py-3 rounded-xl text-xs font-black tracking-widest transition-all shadow-md">
                        CONTACT SUPPORT
                    </button>
                </div>
            </div>
        </div>
    );
}