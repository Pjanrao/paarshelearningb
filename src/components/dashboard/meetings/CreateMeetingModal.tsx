"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import { useGetTeachersQuery } from "@/redux/api/teachersApi";
import { useCreateMeetingMutation } from "@/redux/api/meetingApi";
import { useGetBatchesQuery } from "@/redux/api/batchApi";
import { toast } from "sonner";

export default function CreateMeetingModal({ onClose }: any) {
    const [form, setForm] = useState({
        title: "",
        teacher: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        platform: "Zoom",
        duration: 60,
        course: "",
        batch: "",
    });

    const [createMeeting, { isLoading }] = useCreateMeetingMutation();
    const [openStart, setOpenStart] = useState(false);
    const [openEnd, setOpenEnd] = useState(false);
    const [openPlatform, setOpenPlatform] = useState(false);
    const [openCourse, setOpenCourse] = useState(false);

    const { data: instructorData } = useGetTeachersQuery();
    const instructors = instructorData?.teachers || [];
    const [openInstructor, setOpenInstructor] = useState(false);

    const { data: courseData } = useGetCoursesQuery({
        page: 1,
        limit: 100,
    });
    const courses = courseData?.courses || [];
    const [openBatch, setOpenBatch] = useState(false);

    const { data: batchData = [] } = useGetBatchesQuery(form.course, {
        skip: !form.course, // only call when course selected
    });


const generateTimeOptions = (): string[] => {
    const times: string[] = [];
    const now = new Date();

    for (let h = 0; h < 24; h++) {
        for (let m of [0, 30]) {

            const date = new Date();
            date.setHours(h);
            date.setMinutes(m);

            // ✅ If selected date is today → block past time
            if (form.date) {
                const selectedDate = new Date(form.date);
                const today = new Date();

                const isToday =
                    selectedDate.toDateString() === today.toDateString();

                if (isToday && date < now) continue; // ❌ skip past time
            }

            const hour = h % 12 || 12;
            const ampm = h < 12 ? "AM" : "PM";
            const minute = m === 0 ? "00" : "30";

            times.push(`${hour}:${minute} ${ampm}`);
        }
    }

    return times;
};

    const addOneHour = (time: string) => {
        const [hourMin, period] = time.split(" ");
        let [hour, min] = hourMin.split(":").map(Number);

        if (period === "PM" && hour !== 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;

        const date = new Date();
        date.setHours(hour);
        date.setMinutes(min);

        date.setHours(date.getHours() + 1);

        let newHour = date.getHours();
        const newMin = date.getMinutes();

        const newPeriod = newHour >= 12 ? "PM" : "AM";
        newHour = newHour % 12 || 12;

        return `${newHour}:${newMin === 0 ? "00" : newMin} ${newPeriod}`;
    };
    const closeAllDropdowns = () => {
        setOpenStart(false);
        setOpenEnd(false);
        setOpenPlatform(false);
        setOpenCourse(false);

        setOpenInstructor(false); // ✅ ADD THIS
    };

    const timeOptions = generateTimeOptions();
const now = new Date();

// convert time string → proper Date
const convertToDate = (date: string, time: string) => {
    if (!date || !time) return null;

    const [hourMin, period] = time.split(" ");
    let [hour, min] = hourMin.split(":").map(Number);

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    const d = new Date(date);
    d.setHours(hour);
    d.setMinutes(min);
    d.setSeconds(0);

    return d;
};

const selected = convertToDate(form.date, form.startTime);

if (selected && selected < now) {
toast.error("Cannot select past date/time");
    return;
}
    const handleSubmit = async () => {
        try {
            await createMeeting({
                ...form,
            }).unwrap();

            onClose(); // ✅ this will auto refresh table

        } catch (err) {
            console.error(err);
        }
    };

    const labelClass = "text-sm font-semibold text-gray-700 mb-1 block";


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

            <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl relative max-h-[80vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3 border-b">
                    <h2 className="text-lg font-semibold">Create Meeting</h2>
                    <button onClick={onClose}>
                        <Icon icon="mdi:close" width="20" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 min-h-0">
                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
                        <div className="grid grid-cols-2 gap-3 p-6">

                            {/* Title */}
                            <div>
                                <label className={labelClass}>Title*</label>
                                <input
                                    placeholder="e.g. JavaScript Fundamentals"
                                    className="border h-10 px-3 rounded-lg w-full text-sm"
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                />
                            </div>

                            {/* Instructor */}
                            <div className="relative">
                                <label className={labelClass}>Instructor*</label>

                                {/* Trigger */}
                                <div
                                    onClick={() => {
                                        closeAllDropdowns();
                                        setOpenInstructor(true);
                                    }}
                                    className="w-full border border-gray-200 rounded-lg h-10 px-3 text-sm flex items-center justify-between cursor-pointer"
                                >
                                    {form.teacher
                                        ? instructors.find((i: any) => i._id === form.teacher)?.name
                                        : "Select Instructor"}
                                    <Icon icon="mdi:chevron-down" />
                                </div>

                                {/* Dropdown */}
                                {openInstructor && (
                                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        {instructors.map((inst: any) => (
                                            <div
                                                key={inst._id}
                                                onClick={() => {
                                                    setForm({ ...form, teacher: inst._id });
                                                    setOpenInstructor(false);
                                                }}
                                                className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                                            >
                                                {inst.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <label className={labelClass}>Course*</label>

                                {/* Trigger */}
                                <div
                                    onClick={() => {
                                        closeAllDropdowns();
                                        setOpenCourse(true);
                                        setForm({ ...form, batch: "" });
                                    }}
                                    className="w-full border border-gray-200 rounded-lg h-10 px-3 text-sm flex items-center justify-between cursor-pointer"
                                >
                                    {form.course
                                        ? courses.find((c: any) => c._id === form.course)?.name
                                        : "Select Course"}
                                    <Icon icon="mdi:chevron-down" />
                                </div>

                                {/* Dropdown */}
                                {openCourse && (
                                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        {courses.map((course: any) => (
                                            <div
                                                key={course._id}
                                                onClick={() => {
                                                    setForm({
                                                        ...form,
                                                        course: course._id,

                                                    });
                                                    setOpenCourse(false);
                                                }}
                                                className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                                            >
                                                {course.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <label className={labelClass}>Batch*</label>

                                {/* Trigger */}
                                <div
                                    onClick={() => {
                                        if (!form.course) return alert("Select course first");
                                        closeAllDropdowns();
                                        setOpenBatch(true);
                                    }}
                                    className="w-full border border-gray-200 rounded-lg h-10 px-3 text-sm flex items-center justify-between cursor-pointer"
                                >
                                    {form.batch
                                        ? batchData.find((b: any) => b._id === form.batch)?.name
                                        : "Select Batch"}
                                    <Icon icon="mdi:chevron-down" />
                                </div>

                                {/* Dropdown */}
                                {openBatch && (
                                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
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
                                                    className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                                                >
                                                    {b.name}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>


                            {/* Description */}
                            <div className="col-span-2">
                                <label className={labelClass}>Description*</label>
                                <textarea
                                    placeholder="Provide details about this meeting..."
                                    className="border p-3 rounded-lg w-full"
                                    rows={3}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </div>

                            {/* Date */}
                            <div>
                                <label className={labelClass}>Date*</label>
                                <input
    type="date"
    min={new Date().toLocaleDateString("en-CA")}
    className="border px-3 py-2 rounded-lg w-full text-sm"
    onChange={(e) => setForm({ ...form, date: e.target.value })}
/>
                            </div>

                            {/* Platform */}
                            <div>

                                <div className="relative">
                                    <label className={labelClass}>Platform*</label>

                                    <div
                                        onClick={() => setOpenPlatform(!openPlatform)}
                                        className="w-full border border-gray-200 rounded-lg h-10 px-3 text-sm flex items-center justify-between"
                                    >
                                        {form.platform}
                                        <Icon icon="mdi:chevron-down" />
                                    </div>

                                    {openPlatform && (
                                        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                            {["Zoom"].map((platform, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => {
                                                        setForm({ ...form, platform });
                                                        setOpenPlatform(false);
                                                        setOpenStart(false);
                                                        setOpenEnd(false);
                                                    }}
                                                    className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                                                >
                                                    {platform}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Time */}

                            <div className="relative">
                                <label className={labelClass}>Start Time*</label>
                                {/* Trigger */}
                                <div
                                    onClick={() => {
                                        setOpenStart(!openStart);
                                        setOpenEnd(false);
                                        setOpenPlatform(false);
                                    }}

                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white cursor-pointer flex justify-between items-center"
                                >
                                    {form.startTime || "Select time"}
                                    <Icon icon="mdi:chevron-down" />
                                </div>

                                {/* Dropdown */}
                                {openStart && (
                                    <div className="
      absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg
      max-h-48 overflow-y-auto
    ">
                                        {timeOptions.map((time, i) => (
                                            <div
                                                key={i}
                                                onClick={() => {
                                                    const end = addOneHour(time);

                                                    setForm({
                                                        ...form,
                                                        startTime: time,
                                                        endTime: end, // auto set
                                                    });

                                                    setOpenStart(false);
                                                    setOpenEnd(false);
                                                    setOpenPlatform(false);
                                                }}
                                                className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                                            >
                                                {time}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="relative">
                                    <label className={labelClass}>End Time*</label>

                                    <div
                                        onClick={() => {
                                            setOpenEnd(!openEnd);
                                            setOpenStart(false);
                                            setOpenPlatform(false);
                                        }}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white cursor-pointer flex justify-between items-center"
                                    >
                                        {form.endTime || "Select time"}
                                        <Icon icon="mdi:chevron-down" />
                                    </div>

                                    {openEnd && (
                                        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                            {timeOptions.map((time, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => {
                                                        setForm({ ...form, endTime: time });
                                                        setOpenEnd(false);
                                                        setOpenStart(false);
                                                        setOpenPlatform(false);
                                                    }}
                                                    className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                                                >
                                                    {time}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="relative">
                                <label className={labelClass}>Duration (minutes)*</label>
                                <input
                                    type="number"
                                    value={form.duration}
                                    className="border p-3 rounded-lg w-full"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            duration: Number(e.target.value),
                                        })
                                    }
                                />
                            </div>

                            {/* Meeting Link */}
                            <div>
                                <label className={labelClass}>
                                    Meeting Link* <span className="text-gray-400">(Auto-generated)</span>
                                </label>
                                <input
                                    disabled
                                    placeholder="Meeting link will be auto-generated"
                                    className="border p-3 rounded-lg w-full bg-gray-100"
                                />
                            </div>



                        </div>

                        {/* Footer */}

                    </div>
                </div>
                <div className="flex justify-end gap-2 px-4 py-3 border-t">
                    <button onClick={onClose} className="px-4 py-2 border rounded-lg text-sm">
                        Cancel
                    </button>

                    <button onClick={handleSubmit} className="bg-blue-900 hover:bg-blue-950 text-white text-lg font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition">
                        Create
                    </button>
                </div>


            </div>
        </div>
    );
}