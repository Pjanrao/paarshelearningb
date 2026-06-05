"use client";

import { useState, useEffect } from "react";
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import { useAddPaymentMutation } from "@/redux/api/paymentApi";
import { toast, Toaster } from "sonner";
import { useDispatch } from "react-redux";
import { referralAdminApi } from "@/redux/api/referralAdminApi";

export default function AddPaymentModal({ close }: any) {
    const dispatch = useDispatch();
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

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!form.studentId) newErrors.studentId = "Student selection is required";
        if (!form.courseId) newErrors.courseId = "Course selection is required";
        if (!form.paidAmount) {
            newErrors.paidAmount = "Paid amount is required";
        } else {
            const paid = Number(form.paidAmount);
            const total = Number(form.totalAmount);
            if (paid <= 0) newErrors.paidAmount = "Amount must be greater than 0";
            if (paid > total) newErrors.paidAmount = "Paid amount cannot exceed total fee";
        }

        if (form.paymentMode === "Online" && !receiptFile) {
            newErrors.receipt = "Payment receipt is required for online mode";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ================= SUBMIT ================= */
    const submit = async () => {
        if (!validate()) {
            toast.error("Please fix validation errors ❌");
            return;
        }

        if (isDuplicate) {
            toast.error("This course is already assigned to student ❌");
            return;
        }

        try {
            const paid = Number(form.paidAmount);
            const total = Number(form.totalAmount);

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

            // 🔥 ADD THIS LINE (MAIN FIX)
            dispatch(
                referralAdminApi.util.invalidateTags(["Referral", "ReferralStats"])
            );

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

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

            <Toaster position="top-right" richColors />

            {/* SCROLLABLE MODAL */}
            <div className="bg-white p-5 sm:p-6 rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto space-y-4 relative">
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
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Student*</label>

                    <select
                        className={`w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-[#2C4276] outline-none transition-all ${errors.studentId ? "border-red-500 bg-red-50" : "border-gray-300"
                            }`}
                        value={form.studentId}
                        onChange={(e) => {
                            handleStudent(e.target.value);
                            if (errors.studentId) setErrors({ ...errors, studentId: "" });
                        }}
                    >
                        <option value="">Select Student</option>

                        {students.map((s) => (
                            <option key={s._id} value={s._id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                    {errors.studentId && <p className="text-xs text-red-500">{errors.studentId}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* EMAIL */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Email</label>

                        <input
                            className="w-full border border-gray-200 bg-gray-50 p-2 rounded-md text-sm text-gray-500 cursor-not-allowed outline-none"
                            value={form.email}
                            placeholder="Student email"
                            readOnly
                        />
                    </div>

                    {/* PHONE */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Phone</label>

                        <input
                            className="w-full border border-gray-200 bg-gray-50 p-2 rounded-md text-sm text-gray-500 cursor-not-allowed outline-none"
                            value={form.phone}
                            placeholder="Student phone"
                            readOnly
                        />
                    </div>
                </div>

                {/* COURSE */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Course*</label>

                    <select
                        className={`w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-[#2C4276] outline-none transition-all ${errors.courseId ? "border-red-500 bg-red-50" : "border-gray-300"
                            }`}
                        value={form.courseId}
                        onChange={(e) => {
                            handleCourse(e.target.value);
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
                    {errors.courseId && <p className="text-xs text-red-500">{errors.courseId}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* COURSE FEE */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Course Fee</label>

                        <input
                            className="w-full border border-gray-200 bg-gray-50 p-2 rounded-md text-sm text-gray-500 cursor-not-allowed outline-none"
                            value={form.totalAmount}
                            placeholder="Course fee"
                            readOnly
                        />
                    </div>

                    {/* PAID AMOUNT */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Paid Amount*</label>

                        <input
                            type="number"
                            className={`w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-[#2C4276] outline-none transition-all ${errors.paidAmount ? "border-red-500 bg-red-50" : "border-gray-300"
                                }`}
                            value={form.paidAmount}
                            placeholder="Enter paid amount"
                            onChange={(e) => {
                                setForm({ ...form, paidAmount: e.target.value });
                                if (errors.paidAmount) setErrors({ ...errors, paidAmount: "" });
                            }}
                        />
                        {errors.paidAmount && <p className="text-xs text-red-500">{errors.paidAmount}</p>}
                    </div>
                </div>

                {/* PAYMENT MODE */}
                <div className="grid grid-cols-2 gap-4 items-end">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Payment Mode*</label>

                        <select
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-[#2C4276] outline-none"
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
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Receipt*</label>

                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                className={`w-full border rounded-md p-1.5 text-xs focus:ring-1 focus:ring-[#2C4276] outline-none transition-all ${errors.receipt ? "border-red-500 bg-red-50" : "border-gray-300"
                                    }`}
                                onChange={(e) => {
                                    setReceiptFile(e.target.files?.[0] || null);
                                    if (errors.receipt) setErrors({ ...errors, receipt: "" });
                                }}
                            />
                        </div>
                    )}
                </div>
                {errors.receipt && <p className="text-xs text-red-500 -mt-2">{errors.receipt}</p>}

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