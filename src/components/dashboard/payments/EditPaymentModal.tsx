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
    };


    const handleSubmit = async () => {

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

                        <div className="bg-blue-50 px-4 py-2 font-semibold text-blue-700 text-sm">
                            First Payment
                        </div>

                        <div className="grid grid-cols-2 gap-3 p-3 text-sm">

                            <div>
                                <label className="text-xs text-gray-500">Amount</label>

                                <input
                                    type="number"
                                    value={firstAmount}
                                    onChange={(e) => setFirstAmount(Number(e.target.value))}
                                    className="border w-full p-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-500">Payment Mode</label>

                                <select
                                    value={firstMode}
                                    onChange={(e) => setFirstMode(e.target.value)}
                                    className="border w-full p-2 rounded"
                                >
                                    <option>Cash</option>
                                    <option>Online</option>
                                </select>
                            </div>

                        </div>

                        {/* RECEIPT */}

                        {firstMode === "Online" && (

                            <div className="px-3 pb-3 flex items-center gap-3">

                                {(firstPreview || payment?.receipt) && (
                                    <a
                                        href={firstPreview || payment.receipt}
                                        target="_blank"
                                        className="text-blue-600 underline text-sm"
                                    >
                                        View Receipt
                                    </a>
                                )}

                                <input
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setFirstReceipt(file);

                                        if (file) {
                                            setFirstPreview(URL.createObjectURL(file)); // ✅ preview
                                        }
                                    }}
                                    className="border p-2 rounded w-full"
                                />
                                {firstPreview && (
                                    <img
                                        src={firstPreview}
                                        alt="receipt preview"
                                        className="h-20 mt-2 rounded border"
                                    />
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

                            <div className="space-y-3 p-3">

                                {installments.map((inst, index) => (

                                    <div
                                        key={index}
                                        className="border rounded p-3 grid grid-cols-3 gap-3 text-sm"
                                    >

                                        <div>
                                            <label className="text-xs text-gray-500">Amount</label>

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
                                                className="border w-full p-2 rounded"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs text-gray-500">Mode</label>

                                            <select
                                                value={inst.paymentMode}
                                                onChange={(e) =>
                                                    updateInstallment(
                                                        index,
                                                        "paymentMode",
                                                        e.target.value
                                                    )
                                                }
                                                className="border w-full p-2 rounded"
                                            >
                                                <option>Cash</option>
                                                <option>Online</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-xs text-gray-500">Date</label>

                                            <input
                                                type="date"
                                                value={inst.date?.substring(0, 10)}
                                                onChange={(e) =>
                                                    updateInstallment(index, "date", e.target.value)
                                                }
                                                className="border w-full p-2 rounded"
                                            />
                                        </div>

                                        {/* RECEIPT */}

                                        {inst.paymentMode === "Online" && (

                                            <div className="col-span-3 flex items-center gap-3">

                                                {inst.receipt && (
                                                    <a
                                                        href={inst.receipt}
                                                        target="_blank"
                                                        className="text-blue-600 underline text-sm"
                                                    >
                                                        View Receipt
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
                                                    className="border p-2 rounded w-full"
                                                />
                                                {inst.receipt && (
                                                    <img
                                                        src={inst.receipt}
                                                        alt="installment preview"
                                                        className="h-20 mt-2 rounded border"
                                                    />
                                                )}

                                            </div>

                                        )}

                                    </div>

                                ))}

                            </div>

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