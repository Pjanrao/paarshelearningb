"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import { useGetTeachersQuery } from "@/redux/api/teachersApi";
import { useUpdateMeetingMutation } from "@/redux/api/meetingApi";
import { useGetBatchesQuery } from "@/redux/api/batchApi";
import { toast } from "sonner";


export default function EditMeetingModal({ meeting, onClose, onUpdate }: any) {

    console.log("🔥 MEETING PROP:", meeting);

    useEffect(() => {
        console.log("🚀 useEffect triggered");

        if (meeting) {
            console.log("✅ meeting exists");
        } else {
            console.log("❌ meeting is NULL");
        }
    }, [meeting]);

    const [updateMeeting, { isLoading }] = useUpdateMeetingMutation();
    const [openBatch, setOpenBatch] = useState(false);

    const [form, setForm] = useState<any>({
        title: "",
        teacher: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        platform: "Zoom",
        duration: 60,
        batch: "",
        course: "",
        meetingLink: "",
    });

    const formatTime = (isoString: string) => {
        if (!isoString) return "";

        console.log("ISO:", isoString);

        const date = new Date(isoString);

        let hours = date.getHours();
        const minutes = date.getMinutes();

        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;

        const mins =
            minutes === 0
                ? "00"
                : minutes === 30
                    ? "30"
                    : minutes.toString().padStart(2, "0");

        const formatted = `${hours}:${mins} ${ampm}`;

        console.log("Formatted Time:", formatted);

        return formatted;
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

    const convertToISO = (date: string, time: string) => {
        if (!date || !time) return "";

        const [hourMin, period] = time.trim().split(" ");
        let [hour, min] = hourMin.split(":").map(Number);

        if (period === "PM" && hour !== 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;

        const iso = `${date}T${hour.toString().padStart(2, "0")}:${min
            .toString()
            .padStart(2, "0")}:00`;

        return new Date(iso).toISOString();
    };
    const { data: batchData = [] } = useGetBatchesQuery(form.course, {
        skip: !form.course, // don't call if no course selected
    });

    // ✅ PREFILL DATA (FIXED)
    useEffect(() => {
        if (meeting) {
            console.log("👉 FULL MEETING:", meeting);


            const start = formatTime(meeting.startTimeISO || meeting.startTime);
            const end = formatTime(meeting.endTimeISO || meeting.endTime);

            console.log("👉 Converted start:", start);
            console.log("👉 Converted end:", end);

            setForm({
                title: meeting.title || "",
                teacher: meeting.teacher?._id || meeting.teacher || "",
                description: meeting.description || "",
                batch: meeting.batch?._id || meeting.batch || "",
                date: meeting.meetingDate
                    ? new Date(meeting.meetingDate).toISOString().split("T")[0]
                    : "",
                startTime: start,
                endTime: end,
                platform: meeting.platform || "Zoom",
                duration: meeting.duration || 60,
                course: meeting.course?._id || meeting.course || "",
                meetingLink: meeting.meetingLink || "",
            });
        }
    }, [meeting]);

    // ⏰ TIME OPTIONS
//   const generateTimeOptions = (): string[] => {
//     const times: string[] = [];

//     for (let h = 0; h < 24; h++) {
//         for (let m of [0, 30]) {
//             const hour = h % 12 || 12;
//             const ampm = h < 12 ? "AM" : "PM";
//             const minute = m === 0 ? "00" : "30";

//             times.push(`${hour}:${minute} ${ampm}`);
//         }
//     }

//     return times;
// };
const generateTimeOptions = (): string[] => {
    const times: string[] = [];
    const now = new Date();

    const selectedDate = form.date ? new Date(form.date) : null;
    const today = new Date();

    const isToday =
        selectedDate &&
        selectedDate.toDateString() === today.toDateString();

    const isPastDate =
        selectedDate &&
        selectedDate < new Date(today.toDateString());

    for (let h = 0; h < 24; h++) {
        for (let m of [0, 30]) {

            const slot = new Date();
            slot.setHours(h);
            slot.setMinutes(m);
            slot.setSeconds(0);

            // ✅ ONLY restrict for TODAY
            if (isToday && slot < now) continue;

            // ✅ allow all for past date
            // ✅ allow all for future date

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
            await updateMeeting({
                id: meeting._id,
                data: {
                    ...form,
                    // startTime: convertToISO(form.date, form.startTime),
                    // endTime: convertToISO(form.date, form.endTime),
                    startTime: form.startTime,
endTime: form.endTime,
                },
            }).unwrap();

            onClose(); // ✅ auto refresh

        } catch (err) {
            console.error("UPDATE ERROR:", err);

            if (err && typeof err === "object") {
                console.error("Error data:", (err as any).data);
                console.error("Error message:", (err as any).error);
            }
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
                            className="border h-10 px-3 rounded-lg flex items-center justify-between cursor-pointer overflow-hidden"
                        >
                            <div className="truncate max-w-[220px]" title={
                                courses.find((c: any) => c._id === form.course)?.name
                            }>
                                {form.course
                                    ? courses.find((c: any) => c._id === form.course)?.name
                                    : "Select Course"}
                            </div>
                            <Icon icon="mdi:chevron-down" />
                        </div>

                        {openCourse && (
                            <div className="absolute z-50 bg-white border rounded-lg mt-1 w-full max-h-40 overflow-y-auto">
                                {courses.map((c: any) => (
                                    <div
                                        key={c._id}
                                        onClick={() => {
                                            setForm({ ...form, course: c._id, batch: "", });
                                            setOpenCourse(false);
                                        }}
                                        title={c.name}
                                        className="p-2 hover:bg-blue-50 cursor-pointer truncate"
                                    >

                                        {c.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Batch */}
                    <div className="relative">
                        <label className={labelClass}>Batch*</label>

                        <div
                            onClick={() => {
                                if (!form.course) return toast.error("Select course first");
                                setOpenBatch(!openBatch);
                            }}
                            className="border h-10 px-3 rounded-lg flex items-center justify-between cursor-pointer"
                        >
                            {form.batch
                                ? batchData.find((b: any) => b._id === form.batch)?.name
                                : "Select Batch"}
                            <Icon icon="mdi:chevron-down" />
                        </div>

                        {openBatch && (
                            <div className="absolute z-50 bg-white border rounded-lg mt-1 w-full max-h-40 overflow-y-auto">
                                {batchData.length === 0 ? (
                                    <div className="p-2 text-gray-400 text-sm">
                                        No batches found
                                    </div>
                                ) : (
                                    batchData.map((b: any) => (
                                        <div
                                            key={b._id}
                                            onClick={() => {
                                                setForm({ ...form, batch: b._id });
                                                setOpenBatch(false);
                                            }}
                                            className="p-2 hover:bg-blue-50 cursor-pointer"
                                        >
                                            {b.name}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Date */}
                    <div>
                        <label className={labelClass}>Date*</label>
                       <input
    type="date"
    value={form.date}
    min={new Date().toLocaleDateString("en-CA")}   // ✅ ADD THIS
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