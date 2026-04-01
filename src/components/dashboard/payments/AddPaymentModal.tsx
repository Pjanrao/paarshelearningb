"use client";

import { useState, useEffect } from "react";
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import { useAddPaymentMutation } from "@/redux/api/paymentApi";
import { toast, Toaster } from "sonner";

export default function AddPaymentModal({ close }: any) {

    const [students, setStudents] = useState<any[]>([]);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [isDuplicate, setIsDuplicate] = useState(false);
    const { data: courses } = useGetCoursesQuery({
        page: 1,
        limit: 100
    });

    const [addPayment] = useAddPaymentMutation();

    const [form, setForm] = useState({
        studentId: "",
        email: "",
        phone: "",
        courseId: "",
        totalAmount: "",
        paidAmount: "",
        paymentMode: "Cash",
        receipt: ""
    });

    const courseList = courses?.courses || [];

    /* ================= FETCH STUDENTS ================= */
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await fetch("/api/students?page=1&limit=100");
                const data = await res.json();
                setStudents(data.students || []);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        fetchStudents();
    }, []);

    /* ================= SELECT STUDENT ================= */
    const handleStudent = async (id: string) => {

        const student = students.find((s) => s._id === id);
        if (!student) return;

        setForm((prev) => ({
            ...prev,
            studentId: id,
            email: student.email,
            phone: student.contact
        }));

        // 🔥 RECHECK DUPLICATE IF COURSE ALREADY SELECTED
        if (form.courseId) {

            try {
                const res = await fetch(
                    `/api/payments?studentId=${id}&courseId=${form.courseId}`
                );

                const data = await res.json();

                if (data?.length > 0) {
                    setIsDuplicate(true);
                    toast.error("This course already assigned to student ❌");
                } else {
                    setIsDuplicate(false);
                }

            } catch (err) {
                console.error(err);
            }
        }
    };

    /* ================= SELECT COURSE ================= */
    const handleCourse = async (id: string) => {

        const course = courseList.find((c: any) => c._id === id);
        if (!course) return;

        setForm((prev) => ({
            ...prev,
            courseId: id,
            totalAmount: String(course.fee)
        }));

        // 🔥 CHECK DUPLICATE
        if (form.studentId && id) {

            try {
                const res = await fetch(
                    `/api/payments?studentId=${form.studentId}&courseId=${id}`
                );

                const data = await res.json();

                if (data?.length > 0) {
                    setIsDuplicate(true);
                    toast.error("This course already assigned to student ❌");
                } else {
                    setIsDuplicate(false);
                }

            } catch (err) {
                console.error("Duplicate check failed:", err);
            }
        }
    };

    /* ================= FILE UPLOAD ================= */
    const uploadReceipt = async () => {

        if (!receiptFile) return "";

        try {
            const formData = new FormData();
            formData.append("file", receiptFile);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });

            let data = null;
            try {
                data = await res.json();
            } catch {
                return "";
            }

            if (!res.ok) return "";

            return data?.url || "";

        } catch (error) {
            console.error("Upload error:", error);
            return "";
        }
    };

    /* ================= SUBMIT ================= */
    const submit = async () => {

        try {

            /* ================= VALIDATION ================= */

            if (!form.studentId) {
                toast.error("Please select student ❌");
                return;
            }

            if (!form.courseId) {
                toast.error("Please select course ❌");
                return;
            }

            if (!form.paidAmount) {
                toast.error("Please enter paid amount ❌");
                return;
            }

            const paid = Number(form.paidAmount);
            const total = Number(form.totalAmount);

            if (paid <= 0) {
                toast.error("Amount must be greater than 0 ❌");
                return;
            }

            if (paid > total) {
                toast.error("Paid amount cannot exceed total fee ❌");
                return;
            }

            if (form.paymentMode === "Online" && !receiptFile) {
                toast.error("Please upload receipt for online payment ❌");
                return;
            }

            /* ================= DUPLICATE CHECK ================= */

            const res = await fetch(
                `/api/payments?studentId=${form.studentId}&courseId=${form.courseId}`
            );

            if (!res.ok) {
                toast.error("Failed to validate course ❌");
                return;
            }

            const existingData = await res.json();
            const list = Array.isArray(existingData)
                ? existingData
                : existingData?.payments || [];

            if (list.length > 0) {
                toast.error("This course is already assigned to this student ❌");
                return;
            }

            /* ================= UPLOAD ================= */

            let receiptUrl = "";

            if (form.paymentMode === "Online" && receiptFile) {
                receiptUrl = await uploadReceipt();
            }

            /* ================= SAVE ================= */

            const promise = addPayment({
                ...form,
                paidAmount: paid,
                totalAmount: total,
                receipt: receiptUrl,
                remainingAmount: total - paid
            });

            toast.promise(promise.unwrap(), {
                loading: "Saving payment...",
                success: "Payment added successfully ✅",
                error: "Failed to save payment ❌",
            });

            await promise;

            close();
        } catch (error: any) {

            console.error("SAVE ERROR FULL:", error);

            const message =
                error?.data?.error ||
                error?.error ||
                error?.message ||
                "Something went wrong ❌";

            // ✅ avoid false error
            if (message !== "Rejected") {
                toast.error(message);
            }
        }
    };
    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <Toaster position="top-right" richColors />

            {/* SCROLLABLE MODAL */}
            <div className="bg-white p-6 rounded-xl w-[500px] max-h-[85vh] overflow-y-auto space-y-4 relative">
                {/* CLOSE BUTTON */}
                <button
                    onClick={close}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold text-[#2C4276] mb-2">
                    Add Payment
                </h2>

                {/* STUDENT */}
                <div>
                    <label className="text-sm font-medium">Student</label>

                    <select
                        className="border p-2 w-full rounded mt-1"
                        value={form.studentId}
                        onChange={(e) => handleStudent(e.target.value)}
                    >
                        <option value="">Select Student</option>

                        {students.map((s) => (
                            <option key={s._id} value={s._id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* EMAIL */}
                <div>
                    <label className="text-sm font-medium">Email</label>

                    <input
                        className="border p-2 w-full rounded mt-1"
                        value={form.email}
                        placeholder="Student email"
                        readOnly
                    />
                </div>

                {/* PHONE */}
                <div>
                    <label className="text-sm font-medium">Phone</label>

                    <input
                        className="border p-2 w-full rounded mt-1"
                        value={form.phone}
                        placeholder="Student phone"
                        readOnly
                    />
                </div>

                {/* COURSE */}
                <div>
                    <label className="text-sm font-medium">Course</label>

                    <select
                        className="border p-2 w-full rounded mt-1"
                        value={form.courseId}
                        onChange={(e) => handleCourse(e.target.value)}
                    >
                        <option value="">Select Course</option>

                        {courseList.map((c: any) => (
                            <option key={c._id} value={c._id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* COURSE FEE */}
                <div>
                    <label className="text-sm font-medium">Course Fee</label>

                    <input
                        className="border p-2 w-full rounded mt-1"
                        value={form.totalAmount}
                        placeholder="Course fee"
                        readOnly
                    />
                </div>

                {/* PAID AMOUNT */}
                <div>
                    <label className="text-sm font-medium">Paid Amount</label>

                    <input
                        type="number"
                        className="border p-2 w-full rounded mt-1"
                        value={form.paidAmount}
                        placeholder="Enter paid amount"
                        onChange={(e) =>
                            setForm({ ...form, paidAmount: e.target.value })
                        }
                    />
                </div>

                {/* PAYMENT MODE */}
                <div>
                    <label className="text-sm font-medium">Payment Mode</label>

                    <select
                        className="border p-2 w-full rounded mt-1"
                        value={form.paymentMode}
                        onChange={(e) =>
                            setForm({ ...form, paymentMode: e.target.value })
                        }
                    >
                        <option value="Cash">Cash</option>
                        <option value="Online">Online</option>
                    </select>
                </div>

                {/* RECEIPT */}
                {form.paymentMode === "Online" && (
                    <div>
                        <label className="text-sm font-medium">
                            Upload Payment Receipt
                        </label>

                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="border p-2 w-full rounded mt-1"
                            onChange={(e) =>
                                setReceiptFile(e.target.files?.[0] || null)
                            }
                        />
                    </div>
                )}

                {/* SAVE */}
                <button
                    type="button"   // ✅ ADD THIS
                    onClick={submit}
                    className="bg-[#2C4276] text-white px-4 py-2 rounded w-full mt-3"
                >
                    Save Payment
                </button>

            </div>

        </div>
    );
}