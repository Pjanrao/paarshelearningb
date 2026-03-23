"use client";

import { useState, useEffect } from "react";
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import { useAddBatchMutation } from "@/redux/api/batchApi";
import { X } from "lucide-react";

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

    // ✅ SUBMIT
    const handleSubmit = async () => {

        if (!name || !courseId || !startDate || !endDate) {
            alert("Fill all fields");
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

            refresh?.();
            close();

        } catch (err) {
            console.error(err);
            alert("Failed to create batch");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-[500px] max-h-[90vh] overflow-y-auto p-6 rounded-xl space-y-4 relative">

                {/* CLOSE */}
                <button
                    onClick={close}
                    className="absolute top-3 right-3 text-gray-400 hover:text-black"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-semibold text-[#2C4276]">
                    Create Batch
                </h2>

                {/* NAME */}
                <input
                    placeholder={generateBatchName()}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border w-full p-2 rounded"
                />

                {/* COURSE */}
                <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="border w-full p-2 rounded"
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

                {/* DATES */}
                <div className="grid grid-cols-2 gap-2">
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-2 rounded" />
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-2 rounded" />
                </div>

                {/* STATUS */}
                <p className="text-sm">
                    Status: <span className="font-semibold text-blue-600">{getStatus()}</span>
                </p>

                {/* STUDENTS */}
                <div className="border rounded p-2">

                    {loadingStudents && (
                        <p className="text-sm text-gray-400 p-2">Loading students...</p>
                    )}

                    {!loadingStudents && currentStudents.length === 0 && (
                        <p className="text-sm text-gray-400 p-2">
                            No students found
                        </p>
                    )}

                    {currentStudents.map((s: any) => (
                        <div key={s._id} className="flex justify-between p-2 border-b">

                            <div>
                                <p className="text-sm font-medium">{s.name}</p>
                                <p className="text-xs text-gray-500">{s.email}</p>
                            </div>

                            <input
                                type="checkbox"
                                checked={selectedStudents.includes(s._id)}
                                onChange={() => toggleStudent(s._id)}
                            />

                        </div>
                    ))}

                </div>

                {/* PAGINATION */}
                <div className="flex justify-between text-sm">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
                    <span>{currentPage}/{totalPages}</span>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
                </div>

                {/* BUTTONS */}
                <div className="flex justify-end gap-2">
                    <button onClick={close} className="bg-gray-200 px-3 py-1 rounded">Cancel</button>

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-[#2C4276] text-white px-3 py-1 rounded"
                    >
                        {isLoading ? "Creating..." : "Create"}
                    </button>
                </div>

            </div>
        </div>
    );
}