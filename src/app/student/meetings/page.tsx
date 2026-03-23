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
    MoreVertical
} from "lucide-react";
import Image from "next/image";

export default function MeetingLinksPage() {
    const [activeTab, setActiveTab] = useState("All Meetings");
    const [searchQuery, setSearchQuery] = useState("");

    const meetings = [
        {
            id: 1,
            title: "Node.js API Development",
            description: "Building RESTful APIs with Node.js and Express",
            status: "Upcoming",
            date: "Sunday, August 20, 2023",
            time: "11:00 AM - 12:30 PM",
            instructor: "Robert Johnson",
            platform: "Microsoft Teams",
            platformIcon: "/images/icons/teams.png" // Mock path
        },
        {
            id: 2,
            title: "React Components Workshop",
            status: "Upcoming",
            description: "Hands-on workshop on building reusable React components",
            date: "Thursday, August 17, 2023",
            time: "2:00 PM - 4:00 PM",
            instructor: "Jane Smith",
            platform: "Zoom",
            platformIcon: "/images/icons/zoom.png" // Mock path
        },
        {
            id: 3,
            title: "JavaScript Fundamentals - Week 1",
            status: "Upcoming",
            description: "Introduction to JavaScript variables, functions, and control flow",
            date: "Tuesday, August 15, 2023",
            time: "10:00 AM - 11:30 AM",
            instructor: "John Doe",
            platform: "Google Meet",
            platformIcon: "/images/icons/meet.png" // Mock path
        },
        {
            id: 4,
            title: "CSS Grid & Flexbox Masterclass",
            status: "Past",
            description: "Deep dive into modern CSS layout techniques",
            date: "Monday, July 10, 2023",
            time: "1:00 PM - 2:30 PM",
            instructor: "Sarah Williams",
            platform: "Zoom",
            platformIcon: "/images/icons/zoom.png"
        },
        {
            id: 5,
            title: "TypeScript Fundamentals",
            status: "Past",
            description: "Introduction to TypeScript types, interfaces, and generics",
            date: "Wednesday, July 5, 2023",
            time: "10:00 AM - 11:30 AM",
            instructor: "Michael Brown",
            platform: "Google Meet",
            platformIcon: "/images/icons/meet.png"
        }
    ];

    const tabs = ["All Meetings", "Upcoming", "Past Meetings"];

    const filteredMeetings = meetings.filter(meeting => {
        if (activeTab === "Upcoming") return meeting.status === "Upcoming";
        if (activeTab === "Past Meetings") return meeting.status === "Past";
        return true;
    }).filter(meeting =>
        meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meeting.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                                        <button className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-slate-700 px-6 py-2.5 rounded-xl text-xs font-bold transition-all border border-gray-200">
                                            <Copy size={16} />
                                            Copy Link
                                        </button>
                                        <button className="flex items-center justify-center gap-2 bg-[#2C4276] hover:bg-[#1e2e54] text-white px-6 py-2.5 rounded-xl text-xs font-black tracking-widest transition-all shadow-lg shadow-[#2C4276]/20">
                                            <LinkIcon size={16} />
                                            JOIN MEETING
                                        </button>
                                        <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
                                            <Info size={12} />
                                            <span>Join 5 minutes early</span>
                                        </div>
                                    </>
                                ) : (
                                    <button className="flex items-center justify-center gap-2 bg-[#2C4276] hover:bg-[#1e2e54] text-white px-8 py-3 rounded-xl text-xs font-black tracking-widest transition-all shadow-lg shadow-[#2C4276]/20">
                                        <PlayCircle size={18} />
                                        WATCH RECORDING
                                    </button>
                                )}
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



// "use client";

// import { useGetMeetingsQuery } from "@/redux/api/meetingApi";

// export default function StudentMeetings() {
//     const { data: meetings } = useGetMeetingsQuery("");

//     return (
//         <div className="p-6">
//             <h2 className="text-xl font-bold mb-4">Live Classes</h2>

//             <div className="grid gap-4">
//                 {meetings?.map((m: any) => (
//                     <div key={m._id} className="border p-4 rounded-lg">
//                         <h3 className="font-bold">{m.title}</h3>
//                         <p>{new Date(m.meetingDate).toLocaleString()}</p>

//                         <a
//                             href={m.meetingLink}
//                             target="_blank"
//                             className="text-blue-600 font-bold"
//                         >
//                             Join Meeting
//                         </a>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }