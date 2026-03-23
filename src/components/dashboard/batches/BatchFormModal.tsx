"use client";

import { useEffect, useState } from "react";
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import {
    useAddBatchMutation,
    useUpdateBatchMutation
} from "@/redux/api/batchApi";
import { X } from "lucide-react";

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

    // ✅ TOGGLE STUDENT
    const toggleStudent = (id: string) => {
        setForm(prev => ({
            ...prev,
            students: prev.students.includes(id)
                ? prev.students.filter(s => s !== id)
                : [...prev.students, id]
        }));
    };

    // ✅ SUBMIT (REDUX FIX)
    const handleSubmit = async () => {

        if (!form.name || !form.courseId) {
            alert("Please fill all fields");
            return;
        }

        try {
            if (isEdit) {
                await updateBatch({
                    id: batch._id,
                    body: form
                }).unwrap();
            } else {
                await addBatch(form).unwrap();
            }

            refresh(); // refetch batches
            close();

        } catch (err) {
            console.error("Save failed:", err);
            alert("Something went wrong");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

            <div className="bg-white p-6 w-[550px] rounded-xl shadow-lg space-y-4 relative">

                {/* CLOSE */}
                <button
                    onClick={close}
                    className="absolute top-3 right-3 text-gray-400 hover:text-black"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-semibold text-[#2C4276]">
                    {isEdit ? "Edit Batch" : "Create Batch"}
                </h2>

                {/* NAME */}
                <div>
                    <label className="text-sm text-gray-500">Batch Name</label>
                    <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="border p-2 w-full rounded mt-1"
                    />
                </div>

                {/* COURSE */}
                <div>
                    <label className="text-sm text-gray-500">Select Course</label>

                    <select
                        className="border p-2 w-full rounded mt-1"
                        value={form.courseId}
                        onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                    >
                        <option value="">Select Course</option>

                        {isLoading && <option>Loading...</option>}

                        {courseList.map((c: any) => (
                            <option key={c._id} value={c._id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* DATES */}
                <div className="flex gap-2">
                    <input
                        type="date"
                        value={form.startDate}
                        onChange={(e) =>
                            setForm({ ...form, startDate: e.target.value })
                        }
                        className="border p-2 w-full rounded"
                    />

                    <input
                        type="date"
                        value={form.endDate}
                        onChange={(e) =>
                            setForm({ ...form, endDate: e.target.value })
                        }
                        className="border p-2 w-full rounded"
                    />
                </div>

                {/* STUDENTS */}
                <div>
                    <label className="text-sm text-gray-500">
                        Students ({students.length})
                    </label>

                    <div className="border max-h-[200px] overflow-y-auto rounded mt-1">

                        {loadingStudents && (
                            <p className="p-2 text-gray-400">Loading...</p>
                        )}

                        {!loadingStudents && paginatedStudents.length === 0 && (
                            <p className="p-2 text-gray-400">
                                No students found
                            </p>
                        )}

                        {paginatedStudents.map((s: any) => (
                            <div key={s._id} className="flex justify-between p-2 border-b">
                                <span>{s.name}</span>

                                <input
                                    type="checkbox"
                                    checked={form.students.includes(s._id)}
                                    onChange={() => toggleStudent(s._id)}
                                />
                            </div>
                        ))}

                    </div>
                </div>

                {/* PAGINATION */}
                <div className="flex justify-between">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                        Prev
                    </button>

                    <span>{page} / {totalPages}</span>

                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                        Next
                    </button>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-2">
                    <button onClick={close} className="bg-gray-200 px-4 py-2 rounded">
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={adding || updating}
                        className="bg-[#2C4276] text-white px-4 py-2 rounded"
                    >
                        {adding || updating
                            ? "Saving..."
                            : isEdit
                                ? "Update"
                                : "Create"}
                    </button>
                </div>

            </div>
        </div>
    );
}