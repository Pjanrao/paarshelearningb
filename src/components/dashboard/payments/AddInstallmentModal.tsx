"use client";

import { useState } from "react";
import { useAddInstallmentMutation } from "@/redux/api/paymentApi";
import { toast } from "sonner";

export default function AddInstallmentModal({ payment, close }: any) {

    const [amount, setAmount] = useState("");
    const [paymentMode, setPaymentMode] = useState("Cash");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [addInstallment] = useAddInstallmentMutation();

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!amount) {
            newErrors.amount = "Installment amount is required";
        } else if (Number(amount) <= 0) {
            newErrors.amount = "Amount must be greater than 0";
        } else if (Number(amount) > payment.remainingAmount) {
            newErrors.amount = "Amount cannot exceed remaining amount";
        }

        if (paymentMode === "Online" && !file) {
            newErrors.receipt = "Payment receipt is required for online mode";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = async () => {
        if (!validate()) {
            toast.error("Please fix validation errors ❌");
            return;
        }

        try {
            setLoading(true);

            let receiptUrl = "";

            // ✅ SAFE UPLOAD (FIXED)
            if (file) {

                try {
                    const formData = new FormData();
                    formData.append("file", file);

                    const res = await fetch("/api/upload", {
                        method: "POST",
                        body: formData
                    });

                    const text = await res.text();

                    let data;
                    try {
                        data = JSON.parse(text);
                    } catch {
                        data = null;
                    }

                    if (res.ok && data?.url) {
                        receiptUrl = data.url;
                    }

                } catch (err) {
                    console.error("Upload failed:", err);
                    // ❗ DO NOT STOP FLOW
                }
            }

            // ✅ ALWAYS SAVE INSTALLMENT
            await addInstallment({
                paymentId: payment._id,
                amount: Number(amount),
                paymentMode,
                receipt: receiptUrl
            }).unwrap();

            close();

        } catch (error) {
            console.error("Installment error:", error);
            toast.error("Failed to save installment ❌");
        }

        setLoading(false);
    };

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

            <div className="bg-white p-6 rounded-xl w-full max-w-[420px] space-y-5 relative">

                {/* CLOSE BUTTON */}
                <button
                    onClick={close}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg transition-colors"
                >
                    ✕
                </button>

                <div className="space-y-1">
                    <h2 className="text-xl font-bold text-[#2C4276]">
                        Add Installment
                    </h2>

                    <p className="text-sm text-gray-600">
                        Remaining Amount:
                        <span className="font-bold text-red-600 ml-1">
                            ₹{payment.remainingAmount}
                        </span>
                    </p>
                </div>

                {/* INSTALLMENT AMOUNT */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Installment Amount*</label>

                    <input
                        type="number"
                        className={`w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-[#2C4276] outline-none transition-all ${errors.amount ? "border-red-500 bg-red-50" : "border-gray-300"
                            }`}
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => {
                            setAmount(e.target.value);
                            if (errors.amount) setErrors({ ...errors, amount: "" });
                        }}
                    />
                    {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
                </div>

                {/* PAYMENT MODE */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Payment Mode*</label>

                    <select
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-[#2C4276] outline-none"
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                    >
                        <option value="Cash">Cash</option>
                        <option value="Online">Online</option>
                    </select>
                </div>

                {/* RECEIPT UPLOAD */}
                {paymentMode === "Online" && (
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">
                            Upload Receipt*
                        </label>

                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            className={`w-full border rounded-md p-1.5 text-xs focus:ring-1 focus:ring-[#2C4276] outline-none transition-all ${errors.receipt ? "border-red-500 bg-red-50" : "border-gray-300"
                                }`}
                            onChange={(e) => {
                                setFile(e.target.files ? e.target.files[0] : null);
                                if (errors.receipt) setErrors({ ...errors, receipt: "" });
                            }}
                        />
                        {errors.receipt && <p className="text-xs text-red-500">{errors.receipt}</p>}
                    </div>
                )}

                {/* SAVE BUTTON */}
                <button
                    onClick={submit}
                    disabled={loading}
                    className="bg-[#2C4276] text-white px-4 py-2.5 rounded-lg w-full font-semibold hover:bg-[#22345f] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                >
                    {loading ? "Saving..." : "Save Installment"}
                </button>

            </div>

        </div>
    );
}