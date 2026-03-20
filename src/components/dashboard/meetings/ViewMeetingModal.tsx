"use client";

import { Icon } from "@iconify/react";

export default function MeetingViewModal({ meeting, onClose }: any) {
    if (!meeting) return null;

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const copyLink = () => {
        navigator.clipboard.writeText(meeting.meetingLink);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl relative">

                {/* HEADER */}

                <div className="flex justify-between items-start px-6 py-5 border-b">

                    {/* LEFT SIDE */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Meeting Details
                        </h2>

                        <h3 className="mt-2 text-xl font-semibold text-gray-800">
                            {meeting.title}
                        </h3>

                        <div className="flex items-center gap-3 mt-2">
                            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                                {meeting.status || "Scheduled"}
                            </span>

                            <span className="text-gray-500 text-sm">
                                {formatDate(meeting.meetingDate)}
                            </span>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex items-start gap-3">

                        {/* COPY BUTTON */}
                        <button
                            onClick={copyLink}
                            className="flex items-center gap-2 border px-4 py-2 rounded-xl shadow-sm hover:bg-gray-100"
                        >
                            <Icon icon="mdi:content-copy" />
                            Copy Link
                        </button>

                        {/* CLOSE BUTTON */}
                        <button onClick={onClose}>
                            <Icon icon="mdi:close" width="22" />
                        </button>

                    </div>
                </div>

                {/* BODY */}
                <div className="p-6 space-y-6">

                    {/* MEETING INFO CARD */}
                    <div className="bg-gray-50 border rounded-xl p-5">

                        <h4 className="text-lg font-semibold mb-4 text-gray-800">
                            Meeting Information
                        </h4>

                        <div className="grid grid-cols-2 gap-6">

                            {/* Platform */}
                            <div>
                                <p className="text-gray-500 text-sm">Platform</p>
                                <p className="font-semibold text-gray-900">
                                    {meeting.platform || "Zoom"}
                                </p>
                            </div>

                            {/* Instructor */}
                            <div>
                                <p className="text-gray-500 text-sm">Instructor</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Icon icon="mdi:account" className="text-blue-500" />
                                    <p className="font-semibold text-gray-900">
                                        {meeting.teacher?.name || meeting.instructor || "-"}
                                    </p>
                                </div>
                            </div>

                            {/* Link */}
                            <div className="col-span-2">
                                <p className="text-gray-500 text-sm mb-1">Meeting Link</p>

                                <div className="flex items-center justify-between gap-3">
                                    <a
                                        href={meeting.meetingLink}
                                        target="_blank"
                                        className="text-blue-600 break-all"
                                    >
                                        {meeting.meetingLink}
                                    </a>


                                </div>
                            </div>

                        </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <h4 className="text-lg font-semibold mb-2 text-gray-800">
                            Description
                        </h4>
                        <p className="text-gray-600">
                            {meeting.description || "No description provided"}
                        </p>
                    </div>

                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg"
                    >
                        Close
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100">
                        <Icon icon="mdi:pencil-outline" />
                        Edit
                    </button>
                </div>

            </div>
        </div>
    );
}