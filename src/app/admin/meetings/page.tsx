"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye, Trash2, Pencil } from "lucide-react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import CreateMeetingModal from "@/components/dashboard/meetings/CreateMeetingModal";
import ViewMeetingModal from "@/components/dashboard/meetings/ViewMeetingModal";
import EditMeetingModal from "@/components/dashboard/meetings/EditMeetingModal";

export default function MeetingManagement() {
    const [search, setSearch] = useState("");
    const [platform, setPlatform] = useState("");
    const [open, setOpen] = useState(false);
    const [meetings, setMeetings] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const [viewOpen, setViewOpen] = useState(false);
    const [viewMeeting, setViewMeeting] = useState<any>(null);

    // ✅ STATUS LOGIC (UPDATED)
    const getStatus = (meeting: any) => {
        if (meeting.status === "cancelled") return "Cancelled";

        const now = new Date();
        const meetingDate = new Date(meeting.meetingDate);

        if (meetingDate < now) return "Past";
        return "Upcoming";
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Cancelled":
                return "bg-red-100 text-red-600";
            case "Past":
                return "bg-gray-200 text-gray-700";
            default:
                return "bg-green-100 text-green-600";
        }
    };

    const fetchMeetings = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/meetings");
            const data = await res.json();
            setMeetings(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeetings();
    }, []);

    return (
        <div className="bg-gray-50 h-full">

            {/* HEADER */}
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#2C4276]">
                        Meeting Management
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage all scheduled meetings
                    </p>
                </div>

                <Button
                    className="bg-[#2C4276] text-white"
                    onClick={() => setOpen(true)}
                >
                    + Create Meeting
                </Button>
            </div>

            {/* FILTERS */}
            <div className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row gap-4 items-center mb-4">

                {/* Search */}
                <div className="relative w-full max-w-md">
                    <Input
                        placeholder="Search meetings..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-gray-50 border rounded-xl"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>

                {/* Platform */}
                <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Zoom">Zoom</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full text-sm">

                    {/* HEADER */}
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4 text-left">#</th>
                            <th className="px-6 py-4 text-left">Title</th>
                            <th className="px-6 py-4 text-left">Instructor</th>
                            <th className="px-6 py-4 text-left">Date & Time</th>
                            <th className="px-6 py-4 text-left">Platform</th>
                            <th className="px-6 py-4 text-left">Status</th>
                            <th className="px-6 py-4 text-left">Actions</th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="p-6 text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : meetings.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-6 text-center text-gray-500">
                                    No meetings found
                                </td>
                            </tr>
                        ) : (
                            meetings.map((meeting: any, index: number) => {
                                const status = getStatus(meeting);

                                return (
                                    <tr
                                        key={meeting._id}
                                        className="border-t hover:bg-gray-50 transition"
                                    >
                                        {/* ID */}
                                        <td className="px-6 py-5">{index + 1}</td>

                                        {/* Title */}
                                        <td className="px-6 py-5 font-semibold text-gray-900">
                                            {meeting.title}
                                        </td>

                                        {/* Instructor */}
                                        <td className="px-6 py-5 text-gray-700">
                                            {meeting.teacher?.name || "N/A"}
                                        </td>

                                        {/* Date */}
                                        <td className="px-6 py-5 text-gray-700">
                                            {new Date(meeting.meetingDate).toLocaleString()}
                                        </td>

                                        {/* Platform */}
                                        <td className="px-6 py-5">
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-xs">
                                                {meeting.platform || "Zoom"}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-5">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                                                    status
                                                )}`}
                                            >
                                                {status}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">

                                                {/* View */}
                                                <button
                                                    onClick={() => {
                                                        setViewMeeting(meeting);
                                                        setViewOpen(true);
                                                    }}
                                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                                                >
                                                    <Eye size={18} />
                                                </button>

                                                {/* Edit */}
                                                <button
                                                    onClick={() => {
                                                        setViewMeeting(meeting);   // reuse same state
                                                        setEditOpen(true);
                                                    }}
                                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                                                >
                                                    <Pencil size={18} />
                                                </button>

                                                {/* Delete */}
                                                <button className="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100">
                                                    <Trash2 size={18} />
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

            {/* PAGINATION */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center mt-2">
                <p className="text-sm text-gray-600">
                    Showing {meetings.length} meetings
                </p>

                <div className="flex gap-2">
                    <button className="px-4 py-2 border rounded-lg text-sm">
                        Previous
                    </button>

                    <button className="w-10 h-10 bg-blue-900 text-white rounded-lg">
                        1
                    </button>

                    <button className="px-4 py-2 border rounded-lg text-sm">
                        Next
                    </button>
                </div>
            </div>

            {/* MODALS */}
            {open && (
                <CreateMeetingModal
                    onClose={() => {
                        setOpen(false);
                        fetchMeetings();
                    }}
                />
            )}

            {viewOpen && (
                <ViewMeetingModal
                    meeting={viewMeeting}
                    onClose={() => setViewOpen(false)}
                />
            )}

            {editOpen && (
                <EditMeetingModal
                    meeting={viewMeeting}
                    onClose={() => setEditOpen(false)}
                    onUpdate={fetchMeetings}   // refresh after update
                />
            )}
        </div>
    );
}