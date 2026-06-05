"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useUpdatePaymentMutation } from "@/redux/api/paymentApi";
import { toast } from "sonner";


interface Installment {
    amount: number;
    paymentMode: string;
    date: string;
    receipt?: string;
    file?: File | null;

}

export default function EditPaymentModal({ payment, close }: any) {
    const [updatePayment] = useUpdatePaymentMutation();

    const [firstAmount, setFirstAmount] = useState(payment?.paidAmount || 0);
    const [firstMode, setFirstMode] = useState(payment?.paymentMode || "Cash");
    const [firstReceipt, setFirstReceipt] = useState<File | null>(null);
    const [firstPreview, setFirstPreview] = useState<string | null>(
        payment?.receipt || null
    );
    const [installments, setInstallments] = useState<Installment[]>(
        payment?.installments || []
    );

    const [errors, setErrors] = useState<any>({});

    const updateInstallment = (
        index: number,
        field: keyof Installment,
        value: any
    ) => {

        const updated = [...installments];

        updated[index] = {
            ...updated[index],
            [field]: value
        };

        setInstallments(updated);
        // Clear error when field changes
        if (errors[`inst_${index}_${field}`]) {
            const newErrors = { ...errors };
            delete newErrors[`inst_${index}_${field}`];
            setErrors(newErrors);
        }
    };

    const validate = () => {
        const newErrors: any = {};

        let totalPaid = firstAmount;
        if (firstAmount < 0) newErrors.firstAmount = "Amount cannot be negative";

        if (firstMode === "Online" && !firstReceipt && !payment.receipt) {
            newErrors.firstReceipt = "Receipt is required for online payment";
        }

        installments.forEach((inst, index) => {
            if (inst.amount <= 0) {
                newErrors[`inst_${index}_amount`] = "Amount must be greater than 0";
            }
            if (inst.paymentMode === "Online" && !inst.receipt && !inst.file) {
                newErrors[`inst_${index}_receipt`] = "Receipt is required";
            }
            if (!inst.date) {
                newErrors[`inst_${index}_date`] = "Date is required";
            }
            totalPaid += inst.amount;
        });

        if (totalPaid > payment.totalAmount) {
            newErrors.total = `Total paid (₹${totalPaid}) exceeds course fee (₹${payment.totalAmount})`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            toast.error("Please fix validation errors ❌");
            return;
        }

        try {

            const formData = new FormData();

            formData.append("paidAmount", String(firstAmount));
            formData.append("paymentMode", firstMode);

            // ✅ ALWAYS APPEND FILE PROPERLY
            if (firstReceipt instanceof File) {
                formData.append("receipt", firstReceipt);
            } else {
                formData.append("receipt", ""); // important
            }
            const cleanInstallments = installments.map((inst) => ({
                amount: inst.amount,
                paymentMode: inst.paymentMode,
                date: inst.date,
                receipt: inst.receipt || null
            }));

            formData.append("installments", JSON.stringify(cleanInstallments));

            installments.forEach((inst, index) => {
                if (inst.file) {
                    formData.append(`installment_receipt_${index}`, inst.file);
                }
            });

            const promise = updatePayment({
                id: payment._id,
                data: formData
            }).unwrap(); // ✅ only here

            toast.promise(promise, {
                loading: "Updating payment...",
                success: "Payment updated successfully ✅",
                error: "Update failed ❌",
            });

            await promise;
            close();

            // ✅ refresh latest data
            window.location.reload();

        } catch (error: any) {

            console.error("UPDATE ERROR FULL:", error);

            const message =
                error?.data?.error ||
                error?.data?.message ||
                error?.error ||
                error?.message ||
                "Something went wrong ❌";

            if (message !== "Rejected") {
                toast.error(message);
            }
        }
    };
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            {/* MODAL */}

            <div className="bg-white w-[650px] max-h-[90vh] rounded-xl shadow-xl flex flex-col">

                {/* HEADER */}

                <div className="flex justify-between items-center px-5 py-3 border-b">

                    <h2 className="text-lg font-semibold">Edit Payment</h2>

                    <button onClick={close}>
                        <X size={20} />
                    </button>

                </div>

                {/* BODY (SCROLLABLE) */}

                <div className="flex-1 overflow-y-auto p-5 space-y-5">

                    {/* STUDENT INFORMATION */}

                    <div className="border rounded-lg overflow-hidden">

                        <div className="bg-blue-50 px-4 py-2 font-semibold text-blue-700 text-sm">
                            Student Information
                        </div>

                        <div className="grid grid-cols-2 text-sm">

                            <div className="p-2 border-b text-gray-500">Name</div>
                            <div className="p-2 border-b">{payment?.studentId?.name}</div>

                            <div className="p-2 border-b text-gray-500">Email</div>
                            <div className="p-2 border-b">{payment?.studentId?.email}</div>

                            <div className="p-2 text-gray-500">Phone</div>
                            <div className="p-2">
                                {payment?.studentId?.phone ||
                                    payment?.studentId?.mobile ||
                                    payment?.studentId?.contact ||
                                    "-"}
                            </div>

                        </div>

                    </div>


                    {/* COURSE */}

                    <div className="border rounded-lg overflow-hidden">

                        <div className="bg-blue-50 px-4 py-2 font-semibold text-blue-700 text-sm">
                            Course Information
                        </div>

                        <div className="grid grid-cols-2 text-sm">

                            <div className="p-2 border-b text-gray-500">Course</div>
                            <div className="p-2 border-b">{payment?.courseId?.name}</div>

                            <div className="p-2 text-gray-500">Course Fee</div>
                            <div className="p-2">₹{payment?.totalAmount}</div>

                        </div>

                    </div>


                    {/* FIRST PAYMENT */}

                    <div className="border rounded-lg overflow-hidden">

                        <div className="bg-blue-50 px-4 py-2 font-semibold text-blue-700 text-sm flex justify-between items-center">
                            <span>First Payment</span>
                            {errors.firstAmount && <span className="text-[10px] text-red-500 font-normal">{errors.firstAmount}</span>}
                        </div>

                        <div className="grid grid-cols-2 gap-3 p-3 text-sm">

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Amount*</label>

                                <input
                                    type="number"
                                    value={firstAmount}
                                    onChange={(e) => {
                                        setFirstAmount(Number(e.target.value));
                                        if (errors.firstAmount) setErrors({ ...errors, firstAmount: "" });
                                    }}
                                    className={`w-full border rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none transition-all ${errors.firstAmount ? "border-red-500 bg-red-50" : "border-gray-300"
                                        }`}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Payment Mode*</label>

                                <select
                                    value={firstMode}
                                    onChange={(e) => setFirstMode(e.target.value)}
                                    className="border border-gray-300 w-full p-2 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                >
                                    <option>Cash</option>
                                    <option>Online</option>
                                </select>
                            </div>

                        </div>

                        {/* RECEIPT */}

                        {firstMode === "Online" && (

                            <div className="px-3 pb-3 space-y-2">
                                <div className="flex items-center gap-3">
                                    {(firstPreview || payment?.receipt) && (
                                        <a
                                            href={firstPreview || payment.receipt}
                                            target="_blank"
                                            className="text-blue-600 hover:text-blue-800 underline text-xs font-medium"
                                        >
                                            View Current Receipt
                                        </a>
                                    )}

                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            setFirstReceipt(file);
                                            if (file) {
                                                setFirstPreview(URL.createObjectURL(file));
                                            }
                                            if (errors.firstReceipt) setErrors({ ...errors, firstReceipt: "" });
                                        }}
                                        className={`border rounded p-1.5 w-full text-xs transition-all ${errors.firstReceipt ? "border-red-500 bg-red-50" : "border-gray-200"
                                            }`}
                                    />
                                </div>
                                {errors.firstReceipt && <p className="text-[10px] text-red-500">{errors.firstReceipt}</p>}
                                {firstPreview && !firstPreview.startsWith('http') && (
                                    <div className="relative w-20 h-20 rounded border overflow-hidden">
                                        <img
                                            src={firstPreview}
                                            alt="receipt preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <span className="absolute bottom-0 left-0 right-0 bg-blue-600 text-[8px] text-white text-center py-0.5">NEW</span>
                                    </div>
                                )}
                            </div>

                        )}

                    </div>


                    {/* INSTALLMENTS */}

                    {installments.length > 0 && (

                        <div className="border rounded-lg overflow-hidden">

                            <div className="bg-blue-50 px-4 py-2 font-semibold text-blue-700 text-sm">
                                Installments
                            </div>

                            <div className="space-y-4 p-3 bg-gray-50/50">

                                {installments.map((inst, index) => (

                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm space-y-3"
                                    >

                                        <div className="grid grid-cols-3 gap-3 text-sm">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Amount*</label>

                                                <input
                                                    type="number"
                                                    value={inst.amount}
                                                    onChange={(e) =>
                                                        updateInstallment(
                                                            index,
                                                            "amount",
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                    className={`w-full border rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none text-xs transition-all ${errors[`inst_${index}_amount`] ? "border-red-500 bg-red-50" : "border-gray-300"
                                                        }`}
                                                />
                                                {errors[`inst_${index}_amount`] && <p className="text-[9px] text-red-500">{errors[`inst_${index}_amount`]}</p>}
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Mode*</label>

                                                <select
                                                    value={inst.paymentMode}
                                                    onChange={(e) =>
                                                        updateInstallment(
                                                            index,
                                                            "paymentMode",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border border-gray-300 w-full p-2 rounded focus:ring-1 focus:ring-blue-500 outline-none text-xs"
                                                >
                                                    <option>Cash</option>
                                                    <option>Online</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Date*</label>

                                                <input
                                                    type="date"
                                                    value={inst.date?.substring(0, 10)}
                                                    onChange={(e) =>
                                                        updateInstallment(index, "date", e.target.value)
                                                    }
                                                    className={`w-full border rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none text-xs transition-all ${errors[`inst_${index}_date`] ? "border-red-500 bg-red-50" : "border-gray-300"
                                                        }`}
                                                />
                                                {errors[`inst_${index}_date`] && <p className="text-[9px] text-red-500">{errors[`inst_${index}_date`]}</p>}
                                            </div>
                                        </div>

                                        {/* RECEIPT */}

                                        {inst.paymentMode === "Online" && (

                                            <div className="border-t pt-3 space-y-2">
                                                <div className="flex items-center gap-3">
                                                    {inst.receipt && (
                                                        <a
                                                            href={inst.receipt}
                                                            target="_blank"
                                                            className="text-blue-600 hover:text-blue-800 underline text-[10px] font-medium"
                                                        >
                                                            View Current Receipt
                                                        </a>
                                                    )}
                                                    <input
                                                        type="file"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0] || null;
                                                            updateInstallment(index, "file", file);
                                                            if (file) {
                                                                updateInstallment(
                                                                    index,
                                                                    "receipt",
                                                                    URL.createObjectURL(file)
                                                                );
                                                            }
                                                        }}
                                                        className={`border rounded p-1.5 w-full text-[10px] transition-all ${errors[`inst_${index}_receipt`] ? "border-red-500 bg-red-50" : "border-gray-200"
                                                            }`}
                                                    />
                                                </div>
                                                {errors[`inst_${index}_receipt`] && <p className="text-[9px] text-red-500">{errors[`inst_${index}_receipt`]}</p>}

                                                {inst.receipt && !inst.receipt.startsWith('http') && (
                                                    <div className="relative w-16 h-16 rounded border overflow-hidden">
                                                        <img
                                                            src={inst.receipt}
                                                            alt="installment preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <span className="absolute bottom-0 left-0 right-0 bg-blue-600 text-[8px] text-white text-center py-0.5">NEW</span>
                                                    </div>
                                                )}
                                            </div>

                                        )}

                                    </div>

                                ))}

                            </div>

                        </div>

                    )}

                    {errors.total && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm flex items-center justify-center gap-2 font-medium">
                            <span className="text-lg">⚠️</span> {errors.total}
                        </div>
                    )}

                </div>

                {/* FOOTER */}

                <div className="flex justify-end gap-3 p-4 border-t bg-white">

                    <button
                        onClick={close}
                        className="px-4 py-2 rounded bg-gray-200"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded bg-[#2C4276] text-white"
                    >
                        Update Payment
                    </button>

                </div>

            </div>

        </div>
    );
}