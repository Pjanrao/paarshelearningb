"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import { useGetTeachersQuery } from "@/redux/api/teachersApi";
import { useCreateMeetingMutation } from "@/redux/api/meetingApi";
import { useGetBatchesQuery } from "@/redux/api/batchApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

export default function CreateMeetingModal({ onClose, isTeacher }: any) {
    const teacherUser = useSelector((state: any) => state.auth?.teacherUser);

    const [form, setForm] = useState({
        title: "",
        teacher: isTeacher && teacherUser ? teacherUser._id : "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        platform: "Zoom",
        duration: 60,
        course: "",
        batch: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

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
        skip: !form.course,
    });

    const generateTimeOptions = (): string[] => {
        const times: string[] = [];
        const now = new Date();

        for (let h = 0; h < 24; h++) {
            for (let m of [0, 30]) {
                const date = new Date();
                date.setHours(h);
                date.setMinutes(m);

                if (form.date) {
                    const selectedDate = new Date(form.date);
                    const today = new Date();
                    const isToday = selectedDate.toDateString() === today.toDateString();
                    if (isToday && date < now) continue;
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
        setOpenInstructor(false);
    };

    const timeOptions = generateTimeOptions();

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

    // ─── Validation ───────────────────────────────────────────────
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!form.title.trim())
            newErrors.title = "Meeting title is required.";

        if (!isTeacher && !form.teacher)
            newErrors.teacher = "Please select an instructor.";

        if (!form.course)
            newErrors.course = "Please select a course.";

        if (!form.batch)
            newErrors.batch = "Please select a batch.";

        if (!form.description.trim())
            newErrors.description = "Description is required.";

        if (!form.date)
            newErrors.date = "Please select a date.";

        if (!form.startTime)
            newErrors.startTime = "Please select a start time.";

        if (!form.endTime)
            newErrors.endTime = "Please select an end time.";

        if (form.startTime && form.endTime && form.date) {
            const start = convertToDate(form.date, form.startTime);
            const end = convertToDate(form.date, form.endTime);
            if (start && end && end <= start)
                newErrors.endTime = "End time must be after start time.";
        }

        if (!form.duration || form.duration <= 0)
            newErrors.duration = "Duration must be greater than 0.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            toast.error("Please fix the errors before submitting.");
            return;
        }

        try {
            const submitData = { ...form };
            if (isTeacher && teacherUser) {
                submitData.teacher = teacherUser._id;
            }
            await createMeeting(submitData).unwrap();
            toast.success("Meeting created successfully!");
            onClose();
        } catch (err: any) {
            console.error(err);
            toast.error(err?.data?.message || "Failed to create meeting. Please try again.");
        }
    };

    const labelClass = "text-sm font-semibold text-gray-700 mb-1 block";
    const errClass = "text-xs text-red-500 mt-1";
    const inputError = (field: string) =>
        errors[field] ? "border-red-400 bg-red-50" : "border-gray-200";

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
                    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-6">

                            {/* Title */}
                            <div>
                                <label className={labelClass}>Title*</label>
                                <input
                                    placeholder="e.g. JavaScript Fundamentals"
                                    className={`border h-10 px-3 rounded-lg w-full text-sm ${inputError("title")}`}
                                    value={form.title}
                                    onChange={(e) => {
                                        setForm({ ...form, title: e.target.value });
                                        if (errors.title) setErrors({ ...errors, title: "" });
                                    }}
                                />
                                {errors.title && <p className={errClass}>{errors.title}</p>}
                            </div>

                            {/* Instructor */}
                            {isTeacher ? (
                                <div>
                                    <label className={labelClass}>Instructor*</label>
                                    <div className="w-full border border-gray-200 rounded-lg h-10 px-3 text-sm flex items-center bg-gray-50 text-gray-600 font-medium cursor-not-allowed">
                                        {teacherUser?.name || "Loading..."}
                                    </div>
                                </div>
                            ) : (
                                <div className="relative">
                                    <label className={labelClass}>Instructor*</label>
                                    <div
                                        onClick={() => { closeAllDropdowns(); setOpenInstructor(true); }}
                                        className={`w-full border rounded-lg h-10 px-3 text-sm flex items-center justify-between cursor-pointer ${inputError("teacher")}`}
                                    >
                                        {form.teacher
                                            ? instructors.find((i: any) => i._id === form.teacher)?.name
                                            : <span className="text-gray-400">Select Instructor</span>}
                                        <Icon icon="mdi:chevron-down" />
                                    </div>
                                    {errors.teacher && <p className={errClass}>{errors.teacher}</p>}

                                    {openInstructor && (
                                        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                            {instructors.map((inst: any) => (
                                                <div
                                                    key={inst._id}
                                                    onClick={() => {
                                                        setForm({ ...form, teacher: inst._id });
                                                        setOpenInstructor(false);
                                                        if (errors.teacher) setErrors({ ...errors, teacher: "" });
                                                    }}
                                                    className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                                                >
                                                    {inst.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Course */}
                            <div className="relative">
                                <label className={labelClass}>Course*</label>
                                <div
                                    onClick={() => { closeAllDropdowns(); setOpenCourse(true); setForm({ ...form, batch: "" }); }}
                                    className={`w-full border rounded-lg h-10 px-3 text-sm flex items-center justify-between cursor-pointer ${inputError("course")}`}
                                >
                                    {form.course
                                        ? courses.find((c: any) => c._id === form.course)?.name
                                        : <span className="text-gray-400">Select Course</span>}
                                    <Icon icon="mdi:chevron-down" />
                                </div>
                                {errors.course && <p className={errClass}>{errors.course}</p>}

                                {openCourse && (
                                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        {courses.map((course: any) => (
                                            <div
                                                key={course._id}
                                                onClick={() => {
                                                    setForm({ ...form, course: course._id, batch: "" });
                                                    setOpenCourse(false);
                                                    if (errors.course) setErrors({ ...errors, course: "" });
                                                }}
                                                className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                                            >
                                                {course.name}
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
                                        if (!form.course) {
                                            setErrors({ ...errors, batch: "Please select a course first." });
                                            return;
                                        }
                                        closeAllDropdowns();
                                        setOpenBatch(true);
                                    }}
                                    className={`w-full border rounded-lg h-10 px-3 text-sm flex items-center justify-between cursor-pointer ${inputError("batch")}`}
                                >
                                    {form.batch
                                        ? batchData.find((b: any) => b._id === form.batch)?.name
                                        : <span className="text-gray-400">Select Batch</span>}
                                    <Icon icon="mdi:chevron-down" />
                                </div>
                                {errors.batch && <p className={errClass}>{errors.batch}</p>}

                                {openBatch && (
                                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        {batchData.length === 0 ? (
                                            <div className="p-2 text-gray-400 text-sm">No batches found</div>
                                        ) : (
                                            batchData.map((b: any) => (
                                                <div
                                                    key={b._id}
                                                    onClick={() => {
                                                        setForm({ ...form, batch: b._id });
                                                        setOpenBatch(false);
                                                        if (errors.batch) setErrors({ ...errors, batch: "" });
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
                                    className={`border p-3 rounded-lg w-full text-sm ${inputError("description")}`}
                                    rows={3}
                                    value={form.description}
                                    onChange={(e) => {
                                        setForm({ ...form, description: e.target.value });
                                        if (errors.description) setErrors({ ...errors, description: "" });
                                    }}
                                />
                                {errors.description && <p className={errClass}>{errors.description}</p>}
                            </div>

                            {/* Date */}
                            <div>
                                <label className={labelClass}>Date*</label>
                                <input
                                    type="date"
                                    min={new Date().toLocaleDateString("en-CA")}
                                    className={`border px-3 py-2 rounded-lg w-full text-sm ${inputError("date")}`}
                                    value={form.date}
                                    onChange={(e) => {
                                        setForm({ ...form, date: e.target.value, startTime: "", endTime: "" });
                                        if (errors.date) setErrors({ ...errors, date: "" });
                                    }}
                                />
                                {errors.date && <p className={errClass}>{errors.date}</p>}
                            </div>

                            {/* Platform */}
                            <div className="relative">
                                <label className={labelClass}>Platform*</label>
                                <div
                                    onClick={() => setOpenPlatform(!openPlatform)}
                                    className="w-full border border-gray-200 rounded-lg h-10 px-3 text-sm flex items-center justify-between cursor-pointer"
                                >
                                    {form.platform}
                                    <Icon icon="mdi:chevron-down" />
                                </div>
                                {openPlatform && (
                                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                        {["Zoom"].map((platform, i) => (
                                            <div
                                                key={i}
                                                onClick={() => { setForm({ ...form, platform }); setOpenPlatform(false); }}
                                                className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                                            >
                                                {platform}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Start Time */}
                            <div className="relative">
                                <label className={labelClass}>Start Time*</label>
                                <div
                                    onClick={() => { setOpenStart(!openStart); setOpenEnd(false); setOpenPlatform(false); }}
                                    className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-white cursor-pointer flex justify-between items-center ${inputError("startTime")}`}
                                >
                                    {form.startTime || <span className="text-gray-400">Select time</span>}
                                    <Icon icon="mdi:chevron-down" />
                                </div>
                                {errors.startTime && <p className={errClass}>{errors.startTime}</p>}

                                {openStart && (
                                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        {timeOptions.map((time, i) => (
                                            <div
                                                key={i}
                                                onClick={() => {
                                                    const end = addOneHour(time);
                                                    setForm({ ...form, startTime: time, endTime: end });
                                                    setOpenStart(false);
                                                    if (errors.startTime) setErrors({ ...errors, startTime: "", endTime: "" });
                                                }}
                                                className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                                            >
                                                {time}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* End Time */}
                            <div className="relative">
                                <label className={labelClass}>End Time*</label>
                                <div
                                    onClick={() => { setOpenEnd(!openEnd); setOpenStart(false); setOpenPlatform(false); }}
                                    className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-white cursor-pointer flex justify-between items-center ${inputError("endTime")}`}
                                >
                                    {form.endTime || <span className="text-gray-400">Select time</span>}
                                    <Icon icon="mdi:chevron-down" />
                                </div>
                                {errors.endTime && <p className={errClass}>{errors.endTime}</p>}

                                {openEnd && (
                                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        {timeOptions.map((time, i) => (
                                            <div
                                                key={i}
                                                onClick={() => {
                                                    setForm({ ...form, endTime: time });
                                                    setOpenEnd(false);
                                                    if (errors.endTime) setErrors({ ...errors, endTime: "" });
                                                }}
                                                className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                                            >
                                                {time}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Duration */}
                            <div className="relative">
                                <label className={labelClass}>Duration (minutes)*</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={form.duration}
                                    className={`border p-3 rounded-lg w-full text-sm ${inputError("duration")}`}
                                    onChange={(e) => {
                                        setForm({ ...form, duration: Number(e.target.value) });
                                        if (errors.duration) setErrors({ ...errors, duration: "" });
                                    }}
                                />
                                {errors.duration && <p className={errClass}>{errors.duration}</p>}
                            </div>

                            {/* Meeting Link (auto-generated) */}
                            <div>
                                <label className={labelClass}>
                                    Meeting Link* <span className="text-gray-400">(Auto-generated)</span>
                                </label>
                                <input
                                    disabled
                                    placeholder="Meeting link will be auto-generated"
                                    className="border p-3 rounded-lg w-full bg-gray-100 text-sm"
                                />
                            </div>

                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 px-4 py-3 border-t">
                    <button onClick={onClose} className="px-4 py-2 border rounded-lg text-sm">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-blue-900 hover:bg-blue-950 disabled:opacity-60 text-white text-lg font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2"
                    >
                        {isLoading && <Icon icon="mdi:loading" className="animate-spin" width={20} />}
                        {isLoading ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}