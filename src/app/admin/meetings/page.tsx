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
import DeleteMeetingModal from "@/components/dashboard/meetings/DeleteMeetingModal";
import { useGetMeetingsQuery, useDeleteMeetingMutation } from "@/redux/api/meetingApi";

export default function MeetingManagement() {

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [platform, setPlatform] = useState("");
    const [open, setOpen] = useState(false);

    const [editOpen, setEditOpen] = useState(false);

    const [viewOpen, setViewOpen] = useState(false);
    const [viewMeeting, setViewMeeting] = useState<any>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState<number | "all">(10);

    const {
        data: meetings = [],
        isLoading: loading,
        isError,
    } = useGetMeetingsQuery("");

    const effectiveLimit = itemsPerPage === "all" ? meetings.length : itemsPerPage;
    const totalPages = itemsPerPage === "all" ? 1 : Math.ceil(meetings.length / effectiveLimit);

    const paginatedMeetings = meetings.slice(
        (currentPage - 1) * effectiveLimit,
        currentPage * effectiveLimit
    );

    const [deleteMeeting] = useDeleteMeetingMutation();

    // ✅ STATUS LOGIC (UPDATED)
    // const getStatus = (meeting: any) => {
    //     if (meeting.status === "cancelled") return "Cancelled";

    //     const now = new Date();
    //     const meetingDate = new Date(meeting.meetingDate);

    //     if (meetingDate < now) return "Past";
    //     return "Upcoming";
    // };
    const getStatus = (meeting: any) => {
        if (meeting.status === "cancelled") return "Cancelled";

        const now = new Date();

        // ✅ use startTime instead of meetingDate
        const meetingDateTime = new Date(meeting.startTime);

        if (meetingDateTime < now) return "Past";
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
            <div className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4 items-center mb-4">

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
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Zoom">Zoom</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                <table className="w-full text-sm min-w-[800px] md:min-w-0">

                    {/* HEADER */}
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                        <tr>
                            <th className="px-4 md:px-6 py-4 text-left">#</th>
                            <th className="px-4 md:px-6 py-4 text-left">Title</th>
                            <th className="px-4 md:px-6 py-4 text-left hidden sm:table-cell">Instructor</th>
                            <th className="px-4 md:px-6 py-4 text-left">Date & Time</th>
                            <th className="px-4 md:px-6 py-4 text-left hidden lg:table-cell">Platform</th>
                            <th className="px-4 md:px-6 py-4 text-left">Status</th>
                            <th className="px-4 md:px-6 py-4 text-left">Actions</th>
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
                            paginatedMeetings.map((meeting: any, index: number) => {
                                const status = getStatus(meeting);

                                const start = new Date(meeting.startTime).toLocaleTimeString(undefined, {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                });

                                const end = new Date(meeting.endTime).toLocaleTimeString(undefined, {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                });

                                const date = new Date(meeting.startTime).toLocaleDateString(undefined, {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                });


                                return (
                                    <tr
                                        key={meeting._id}
                                        className="border-t hover:bg-gray-50 transition"
                                    >
                                        {/* ID */}
                                        <td className="px-4 md:px-6 py-5">{(currentPage - 1) * effectiveLimit + index + 1}</td>

                                        {/* Title */}
                                        <td className="px-4 md:px-6 py-5 font-semibold text-gray-900">
                                            {meeting.title}
                                        </td>

                                        {/* Instructor */}
                                        <td className="px-4 md:px-6 py-5 text-gray-700 hidden sm:table-cell">
                                            {meeting.teacher?.name || "N/A"}
                                        </td>

                                        {/* Date */}
                                        <td className="px-4 md:px-6 py-5 text-gray-700">


                                            <div>{date}</div>

                                            {/* TIME */}
                                            <div className="text-xs text-gray-500">
                                                {start} - {end}
                                            </div>

                                        </td>

                                        {/* Platform */}
                                        <td className="px-4 md:px-6 py-5 hidden lg:table-cell">
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-xs">
                                                {meeting.platform || "Zoom"}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 md:px-6 py-5">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                                                    status
                                                )}`}
                                            >
                                                {status}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 md:px-6 py-5">
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
                                                <button onClick={() => setDeleteId(meeting._id)} className="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100">
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
            <div className="px-4 md:px-6 py-4 border-t bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 mt-2">
                <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-600">
                        Showing {meetings.length > 0 ? (currentPage - 1) * effectiveLimit + 1 : 0} to {Math.min(currentPage * effectiveLimit, meetings.length)} of {meetings.length} meetings
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span>Show:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                const val = e.target.value;
                                setItemsPerPage(val === "all" ? "all" : Number(val));
                                setCurrentPage(1);
                            }}
                            className="border px-2 py-1 rounded-lg text-sm bg-white"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value="all">All</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2">

                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        className="px-3 md:px-4 py-2 border rounded-lg text-sm disabled:opacity-50"
                    >
                        Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-9 h-9 md:w-10 md:h-10 rounded-lg text-sm md:text-base ${currentPage === i + 1
                                ? "bg-blue-900 text-white"
                                : "border"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        className="px-3 md:px-4 py-2 border rounded-lg text-sm disabled:opacity-50"
                    >
                        Next
                    </button>

                </div>
            </div>

            {/* MODALS */}
            {open && (
                <CreateMeetingModal
                    onClose={() => {
                        setOpen(false);
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
                />
            )}

            <DeleteMeetingModal
                deleteId={deleteId}
                setDeleteId={setDeleteId}
                onDelete={async (id) => {
                    await deleteMeeting(id).unwrap(); // ✅ auto refresh
                }}
            />
        </div>
    );
}