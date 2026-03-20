"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import { useGetTeachersQuery } from "@/redux/api/teachersApi";

export default function EditMeetingModal({ meeting, onClose, onUpdate }: any) {

    const [form, setForm] = useState<any>({
        title: "",
        teacher: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        platform: "Zoom",
        duration: 60,
        course: "",
        meetingLink: "",
    });

    const formatTime = (isoString: string) => {
        if (!isoString) return "";

        const date = new Date(isoString);

        let hours = date.getHours();
        const minutes = date.getMinutes();

        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;

        const mins = minutes === 0 ? "00" : minutes;

        return `${hours}:${mins} ${ampm}`;
    };

    const [openInstructor, setOpenInstructor] = useState(false);
    const [openCourse, setOpenCourse] = useState(false);
    const [openStart, setOpenStart] = useState(false);
    const [openEnd, setOpenEnd] = useState(false);
    const [openPlatform, setOpenPlatform] = useState(false);

    const { data: instructorData } = useGetTeachersQuery();
    const instructors = instructorData?.teachers || [];

    const { data: courseData } = useGetCoursesQuery({
        page: 1,
        limit: 100,
    });
    const courses = courseData?.courses || [];

    // ✅ PREFILL DATA (FIXED)
    useEffect(() => {
        if (meeting) {
            setForm({
                title: meeting.title || "",
                teacher: meeting.teacher?._id || meeting.teacher || "",
                description: meeting.description || "",
                date: meeting.meetingDate
                    ? new Date(meeting.meetingDate).toISOString().split("T")[0]
                    : "",
                startTime: formatTime(meeting.startTime),
                endTime: formatTime(meeting.endTime),
                platform: meeting.platform || "Zoom",
                duration: meeting.duration || 60,
                course: meeting.course?._id || meeting.course || "",
                meetingLink: meeting.meetingLink || "",
            });
        }
    }, [meeting]);

    // ⏰ TIME OPTIONS
    const generateTimeOptions = () => {
        const times = [];
        for (let h = 0; h < 24; h++) {
            for (let m of [0, 30]) {
                const hour = h % 12 || 12;
                const ampm = h < 12 ? "AM" : "PM";
                const minute = m === 0 ? "00" : "30";
                times.push(`${hour}:${minute} ${ampm}`);
            }
        }
        return times;
    };

    const timeOptions = generateTimeOptions();

    // ✅ UPDATE API
    const handleUpdate = async () => {
        try {
            await fetch(`/api/meetings/${meeting._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            onUpdate();
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    const labelClass = "text-sm font-semibold text-gray-700 mb-1 block";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

            <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl max-h-[80vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3 border-b">
                    <h2 className="text-lg font-semibold">Edit Meeting</h2>
                    <button onClick={onClose}>
                        <Icon icon="mdi:close" width="20" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 gap-3">

                    {/* Title */}
                    <div>
                        <label className={labelClass}>Title*</label>
                        <input
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="border h-10 px-3 rounded-lg w-full"
                        />
                    </div>

                    {/* Instructor */}
                    <div className="relative">
                        <label className={labelClass}>Instructor*</label>

                        <div
                            onClick={() => setOpenInstructor(!openInstructor)}
                            className="border h-10 px-3 rounded-lg flex items-center justify-between cursor-pointer"
                        >
                            {form.teacher
                                ? instructors.find((i: any) => i._id === form.teacher)?.name
                                : "Select Instructor"}
                            <Icon icon="mdi:chevron-down" />
                        </div>

                        {openInstructor && (
                            <div className="absolute z-50 bg-white border rounded-lg mt-1 w-full max-h-40 overflow-y-auto">
                                {instructors.map((inst: any) => (
                                    <div
                                        key={inst._id}
                                        onClick={() => {
                                            setForm({ ...form, teacher: inst._id });
                                            setOpenInstructor(false);
                                        }}
                                        className="p-2 hover:bg-blue-50 cursor-pointer"
                                    >
                                        {inst.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Course */}
                    <div className="relative">
                        <label className={labelClass}>Course*</label>

                        <div
                            onClick={() => setOpenCourse(!openCourse)}
                            className="border h-10 px-3 rounded-lg flex items-center justify-between cursor-pointer"
                        >
                            {form.course
                                ? courses.find((c: any) => c._id === form.course)?.name
                                : "Select Course"}
                            <Icon icon="mdi:chevron-down" />
                        </div>

                        {openCourse && (
                            <div className="absolute z-50 bg-white border rounded-lg mt-1 w-full max-h-40 overflow-y-auto">
                                {courses.map((c: any) => (
                                    <div
                                        key={c._id}
                                        onClick={() => {
                                            setForm({ ...form, course: c._id });
                                            setOpenCourse(false);
                                        }}
                                        className="p-2 hover:bg-blue-50 cursor-pointer"
                                    >
                                        {c.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Date */}
                    <div>
                        <label className={labelClass}>Date*</label>
                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            className="border px-3 py-2 rounded-lg w-full"
                        />
                    </div>

                    {/* Platform */}
                    <div className="relative">
                        <label className={labelClass}>Platform*</label>

                        <div
                            onClick={() => setOpenPlatform(!openPlatform)}
                            className="border h-10 px-3 rounded-lg flex items-center justify-between cursor-pointer"
                        >
                            {form.platform}
                            <Icon icon="mdi:chevron-down" />
                        </div>

                        {openPlatform && (
                            <div className="absolute z-50 bg-white border rounded-lg mt-1 w-full">
                                {["Zoom"].map((p, i) => (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            setForm({ ...form, platform: p });
                                            setOpenPlatform(false);
                                        }}
                                        className="p-2 hover:bg-blue-50 cursor-pointer"
                                    >
                                        {p}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Start Time */}
                    <div className="relative">
                        <label className={labelClass}>Start Time*</label>

                        <div
                            onClick={() => setOpenStart(!openStart)}
                            className="border px-3 py-2.5 rounded-lg cursor-pointer flex justify-between"
                        >
                            {form.startTime || "Select time"}
                            <Icon icon="mdi:chevron-down" />
                        </div>

                        {openStart && (
                            <div className="absolute z-50 bg-white border rounded-lg mt-1 w-full max-h-48 overflow-y-auto">
                                {timeOptions.map((t, i) => (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            setForm({ ...form, startTime: t });
                                            setOpenStart(false);
                                        }}
                                        className="p-2 hover:bg-blue-50 cursor-pointer"
                                    >
                                        {t}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* End Time */}
                    <div className="relative">
                        <label className={labelClass}>End Time*</label>

                        <div
                            onClick={() => setOpenEnd(!openEnd)}
                            className="border px-3 py-2.5 rounded-lg cursor-pointer flex justify-between"
                        >
                            {form.endTime || "Select time"}
                            <Icon icon="mdi:chevron-down" />
                        </div>

                        {openEnd && (
                            <div className="absolute z-50 bg-white border rounded-lg mt-1 w-full max-h-48 overflow-y-auto">
                                {timeOptions.map((t, i) => (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            setForm({ ...form, endTime: t });
                                            setOpenEnd(false);
                                        }}
                                        className="p-2 hover:bg-blue-50 cursor-pointer"
                                    >
                                        {t}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Duration */}
                    <div>
                        <label className={labelClass}>Duration</label>
                        <input
                            type="number"
                            value={form.duration}
                            onChange={(e) =>
                                setForm({ ...form, duration: Number(e.target.value) })
                            }
                            className="border px-3 py-2 rounded-lg w-full"
                        />
                    </div>

                    {/* Meeting Link */}
                    <div className="col-span-2">
                        <label className={labelClass}>
                            Meeting Link <span className="text-gray-400">(Auto-generated)</span>
                        </label>

                        <div className="flex items-center gap-2">
                            <input
                                value={form.meetingLink}
                                readOnly
                                className="border px-3 py-2 rounded-lg w-full bg-gray-100 text-sm"
                            />

                            <button
                                onClick={() =>
                                    navigator.clipboard.writeText(form.meetingLink)
                                }
                                className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100"
                            >
                                Copy
                            </button>
                        </div>

                        <a
                            href={form.meetingLink}
                            target="_blank"
                            className="text-blue-600 text-xs underline mt-1 inline-block"
                        >
                            Open Meeting
                        </a>
                    </div>

                    {/* Description */}
                    <div className="col-span-2">
                        <label className={labelClass}>Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                            className="border p-3 rounded-lg w-full"
                        />
                    </div>

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 px-4 py-3 border-t">
                    <button onClick={onClose} className="px-4 py-2 border rounded-lg">
                        Cancel
                    </button>

                    <button
                        onClick={handleUpdate}
                        className="bg-blue-900 text-white px-6 py-2 rounded-lg"
                    >
                        Update
                    </button>
                </div>

            </div>
        </div>
    );
}