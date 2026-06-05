"use client";

import { useEffect, useState } from "react";
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import {
    useAddBatchMutation,
    useUpdateBatchMutation
} from "@/redux/api/batchApi";
import { X } from "lucide-react";
import { toast } from "sonner";

type BatchFormType = {
    name: string;
    courseId: string;
    startDate: string;
    endDate: string;
    students: string[];
};

export default function BatchFormModal({ close, refresh, batch }: any) {

    const isEdit = !!batch;

    const [form, setForm] = useState<BatchFormType>({
        name: "",
        courseId: "",
        startDate: "",
        endDate: "",
        students: []
    });

    const [students, setStudents] = useState<any[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    // ✅ REDUX MUTATIONS
    const [addBatch, { isLoading: adding }] = useAddBatchMutation();
    const [updateBatch, { isLoading: updating }] = useUpdateBatchMutation();

    // ✅ COURSES (REDUX)
    const { data: coursesData, isLoading } = useGetCoursesQuery({
        page: 1,
        limit: 100
    });

    const courseList = coursesData?.courses || [];

    // ✅ PREFILL EDIT
    useEffect(() => {
        if (batch) {
            setForm({
                name: batch.name || "",
                courseId: batch.courseId?._id || "",
                startDate: batch.startDate?.slice(0, 10) || "",
                endDate: batch.endDate?.slice(0, 10) || "",
                students: batch.students?.map((s: any) => s._id) || []
            });
        }
    }, [batch]);

    // 🔥 PAGINATION
    const [page, setPage] = useState(1);
    const limit = 5;

    const paginatedStudents = students.slice(
        (page - 1) * limit,
        page * limit
    );

    const totalPages = Math.max(1, Math.ceil(students.length / limit));

    // ✅ FETCH STUDENTS (COURSE BASED)
    useEffect(() => {
        if (!form.courseId) {
            setStudents([]);
            return;
        }

        setLoadingStudents(true);

        fetch(`/api/payments?courseId=${form.courseId}`)
            .then(res => res.json())
            .then(data => {

                if (!Array.isArray(data)) {
                    setStudents([]);
                    return;
                }

                const uniqueStudents = Array.from(
                    new Map(
                        data
                            .filter((p: any) => p?.studentId?._id)
                            .map((p: any) => [p.studentId._id, p.studentId])
                    ).values()
                );

                setStudents(uniqueStudents);
                setPage(1);

            })
            .catch(() => setStudents([]))
            .finally(() => setLoadingStudents(false));

    }, [form.courseId]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    // ✅ TOGGLE STUDENT
    const toggleStudent = (id: string) => {
        setForm(prev => ({
            ...prev,
            students: prev.students.includes(id)
                ? prev.students.filter(s => s !== id)
                : [...prev.students, id]
        }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!form.name.trim()) newErrors.name = "Batch name is required";
        if (!form.courseId) newErrors.courseId = "Please select a course";
        if (!form.startDate) newErrors.startDate = "Start date is required";
        if (!form.endDate) newErrors.endDate = "End date is required";

        if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
            newErrors.endDate = "End date cannot be before start date";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ SUBMIT (REDUX FIX)
    const handleSubmit = async () => {
        if (!validate()) {
            toast.error("Please fill all required fields correctly");
            return;
        }

        try {
            if (isEdit) {
                await updateBatch({
                    id: batch._id,
                    body: form
                }).unwrap();
                toast.success("Batch updated successfully");
            } else {
                await addBatch(form).unwrap();
                toast.success("Batch created successfully");
            }

            refresh(); // refetch batches
            close();

        } catch (err: any) {
            console.error("Save failed:", err);
            toast.error(err?.data?.message || "Failed to save batch");
        }
    };

    const inputClasses = (field: string) =>
        `border p-2 w-full rounded mt-1 outline-none transition-all ${errors[field] ? "border-red-500 bg-red-50 focus:ring-1 focus:ring-red-500" : "focus:ring-1 focus:ring-[#2C4276]"
        }`;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">

            <div className="bg-white p-6 w-full max-w-[550px] rounded-xl shadow-xl space-y-4 relative max-h-[90vh] overflow-y-auto">

                {/* CLOSE */}
                <button
                    onClick={close}
                    className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-[#2C4276] border-b pb-2">
                    {isEdit ? "Edit Batch" : "Create Batch"}
                </h2>

                <div className="grid grid-cols-1 gap-4">
                    {/* NAME */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Batch Name*</label>
                        <input
                            value={form.name}
                            onChange={(e) => {
                                setForm({ ...form, name: e.target.value });
                                if (errors.name) setErrors({ ...errors, name: "" });
                            }}
                            className={inputClasses("name")}
                            placeholder="Enter batch name"
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* COURSE */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Select Course*</label>

                        <select
                            className={inputClasses("courseId")}
                            value={form.courseId}
                            onChange={(e) => {
                                setForm({ ...form, courseId: e.target.value });
                                if (errors.courseId) setErrors({ ...errors, courseId: "" });
                            }}
                        >
                            <option value="">Select Course</option>
                            {courseList.map((c: any) => (
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
                            <label className="text-sm font-semibold text-gray-700">Start Date*</label>
                            <input
                                type="date"
                                value={form.startDate}
                                onChange={(e) => {
                                    setForm({ ...form, startDate: e.target.value });
                                    if (errors.startDate) setErrors({ ...errors, startDate: "" });
                                }}
                                className={inputClasses("startDate")}
                            />
                            {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700">End Date*</label>
                            <input
                                type="date"
                                value={form.endDate}
                                onChange={(e) => {
                                    setForm({ ...form, endDate: e.target.value });
                                    if (errors.endDate) setErrors({ ...errors, endDate: "" });
                                }}
                                className={inputClasses("endDate")}
                            />
                            {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
                        </div>
                    </div>
                </div>

                {/* STUDENTS */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                        Assign Students ({form.students.length}/{students.length})
                    </label>

                    <div className="bg-white border rounded-lg max-h-[160px] overflow-y-auto shadow-sm">

                        {loadingStudents && (
                            <div className="p-4 text-center text-gray-400 text-sm">
                                <span className="inline-block animate-pulse">Fetching students...</span>
                            </div>
                        )}

                        {!loadingStudents && paginatedStudents.length === 0 && (
                            <p className="p-4 text-center text-gray-400 text-sm">
                                No students found for this course
                            </p>
                        )}

                        {paginatedStudents.map((s: any) => (
                            <div key={s._id} className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                                <span className="text-sm text-gray-700">{s.name}</span>

                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded text-[#2C4276] focus:ring-[#2C4276] cursor-pointer"
                                    checked={form.students.includes(s._id)}
                                    onChange={() => toggleStudent(s._id)}
                                />
                            </div>
                        ))}

                    </div>

                    {/* PAGINATION */}
                    {students.length > limit && (
                        <div className="flex justify-between items-center mt-3 px-1">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="text-xs font-medium text-gray-500 hover:text-[#2C4276] disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                ← Prev
                            </button>

                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Page {page} of {totalPages}</span>

                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="text-xs font-medium text-gray-500 hover:text-[#2C4276] disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={close}
                        className="px-6 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={adding || updating}
                        className="bg-[#2C4276] hover:bg-[#1e2d50] text-white px-8 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {adding || updating
                            ? (isEdit ? "Updating..." : "Creating...")
                            : isEdit
                                ? "Save Changes"
                                : "Create Batch"}
                    </button>
                </div>

            </div>
        </div>
    );
}