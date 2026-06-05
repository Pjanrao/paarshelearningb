"use client";

import { useState, useEffect } from "react";
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import { useAddBatchMutation } from "@/redux/api/batchApi";
import { X } from "lucide-react";
import { toast } from "sonner";

export default function AddBatchModal({ close, refresh }: any) {

    const [name, setName] = useState("");
    const [courseId, setCourseId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [students, setStudents] = useState<any[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 5;

    // ✅ REDUX
    const { data: coursesData, isLoading: courseLoading } = useGetCoursesQuery({
        page: 1,
        limit: 100
    });

    const [addBatch, { isLoading }] = useAddBatchMutation();

    const courses = coursesData?.courses || [];

    // ✅ FETCH STUDENTS
    useEffect(() => {
        if (!courseId) {
            setStudents([]);
            setSelectedStudents([]);
            return;
        }

        setLoadingStudents(true);

        fetch(`/api/payments?courseId=${courseId}`)
            .then(res => res.json())
            .then(data => {

                if (!Array.isArray(data)) {
                    setStudents([]);
                    return;
                }

                const unique = Array.from(
                    new Map(
                        data
                            .filter((p: any) => p?.studentId?._id)
                            .map((p: any) => [p.studentId._id, p.studentId])
                    ).values()
                );

                setStudents(unique);
                setSelectedStudents([]); // reset selection
                setCurrentPage(1);

            })
            .catch(() => setStudents([]))
            .finally(() => setLoadingStudents(false));

    }, [courseId]);

    // ✅ PAGINATION
    const indexOfLast = currentPage * studentsPerPage;
    const indexOfFirst = indexOfLast - studentsPerPage;
    const currentStudents = students.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.max(1, Math.ceil(students.length / studentsPerPage));

    // ✅ TOGGLE
    const toggleStudent = (id: string) => {
        setSelectedStudents(prev =>
            prev.includes(id)
                ? prev.filter(s => s !== id)
                : [...prev, id]
        );
    };

    // ✅ STATUS
    const getStatus = () => {
        if (!startDate || !endDate) return "Upcoming";

        const today = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (today < start) return "Upcoming";
        if (today <= end) return "Active";
        return "Completed";
    };

    // ✅ AUTO NAME
    const generateBatchName = () => {
        const course = courses.find((c: any) => c._id === courseId);
        if (!course || !course.name) return "Enter batch name";

        const prefix = course.name.split(" ")[0];
        const random = Math.floor(100 + Math.random() * 900);

        return `${prefix}-Batch-${random}`;
    };

    const [errors, setErrors] = useState<Record<string, string>>({});

    // ✅ SUBMIT
    const handleSubmit = async () => {

        const newErrors: Record<string, string> = {};
        if (!name.trim()) newErrors.name = "Batch name is required";
        if (!courseId) newErrors.courseId = "Please select a course";
        if (!startDate) newErrors.startDate = "Start date is required";
        if (!endDate) newErrors.endDate = "End date is required";

        if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
            newErrors.endDate = "End date cannot be before start date";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error("Please fill all required fields correctly");
            return;
        }

        try {
            await addBatch({
                name,
                courseId,
                startDate,
                endDate,
                status: getStatus(),
                students: selectedStudents
            }).unwrap();

            toast.success("Batch created successfully");
            refresh?.();
            close();

        } catch (err: any) {
            console.error(err);
            toast.error(err?.data?.message || "Failed to create batch");
        }
    };

    const inputClasses = (field: string) =>
        `border w-full p-2 rounded transition-all outline-none ${errors[field] ? "border-red-500 bg-red-50 focus:ring-1 focus:ring-red-500" : "focus:ring-1 focus:ring-[#2C4276]"
        }`;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

            <div className="bg-white w-full max-w-[500px] max-h-[90vh] overflow-y-auto p-6 rounded-xl space-y-4 relative shadow-2xl">

                {/* CLOSE */}
                <button
                    onClick={close}
                    className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-[#2C4276] border-b pb-2">
                    Create Batch
                </h2>

                <div className="space-y-4 pt-2">
                    {/* NAME */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">Batch Name*</label>
                        <input
                            placeholder={generateBatchName()}
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) setErrors({ ...errors, name: "" });
                            }}
                            className={inputClasses("name")}
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* COURSE */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">Select Course*</label>
                        <select
                            value={courseId}
                            onChange={(e) => {
                                setCourseId(e.target.value);
                                if (errors.courseId) setErrors({ ...errors, courseId: "" });
                            }}
                            className={inputClasses("courseId")}
                        >
                            <option value="">
                                {courseLoading ? "Loading courses..." : "Select Course"}
                            </option>

                            {courses.map((c: any) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        {errors.courseId && <p className="text-xs text-red-500 mt-1">{errors.courseId}</p>}
                    </div>

                    {/* DATES */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">Start Date*</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                    if (errors.startDate) setErrors({ ...errors, startDate: "" });
                                }}
                                className={inputClasses("startDate")}
                            />
                            {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">End Date*</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => {
                                    setEndDate(e.target.value);
                                    if (errors.endDate) setErrors({ ...errors, endDate: "" });
                                }}
                                className={inputClasses("endDate")}
                            />
                            {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
                        </div>
                    </div>
                </div>

                {/* STATUS */}
                <div className="bg-blue-50 p-2 rounded-lg border border-blue-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Calculated Status:</span>
                    <span className="text-sm font-bold text-blue-600">{getStatus()}</span>
                </div>

                {/* STUDENTS */}
                <div className="border rounded-lg p-3 bg-gray-50">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                        Assign Students ({selectedStudents.length}/{students.length})
                    </label>

                    <div className="bg-white border rounded shadow-sm max-h-[160px] overflow-y-auto">

                        {loadingStudents && (
                            <p className="text-sm text-gray-400 p-4 text-center animate-pulse">Loading students...</p>
                        )}

                        {!loadingStudents && currentStudents.length === 0 && (
                            <p className="text-sm text-gray-400 p-4 text-center">
                                No students found
                            </p>
                        )}

                        {currentStudents.map((s: any) => (
                            <div key={s._id} className="flex justify-between items-center p-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors">

                                <div>
                                    <p className="text-sm font-bold text-gray-700">{s.name}</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{s.email}</p>
                                </div>

                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded text-[#2C4276] focus:ring-[#2C4276] cursor-pointer"
                                    checked={selectedStudents.includes(s._id)}
                                    onChange={() => toggleStudent(s._id)}
                                />

                            </div>
                        ))}

                    </div>

                    {/* PAGINATION */}
                    {students.length > studentsPerPage && (
                        <div className="flex justify-between items-center mt-3 px-1">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="text-xs font-medium text-gray-500 hover:text-[#2C4276] disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                ← Prev
                            </button>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="text-xs font-medium text-gray-500 hover:text-[#2C4276] disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>

                {/* BUTTONS */}
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={close}
                        className="px-6 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-[#2C4276] hover:bg-[#1e2d50] text-white px-8 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {isLoading ? "Creating..." : "Create Batch"}
                    </button>
                </div>

            </div>
        </div>
    );
}