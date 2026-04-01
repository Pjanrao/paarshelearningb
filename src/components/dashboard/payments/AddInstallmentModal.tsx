"use client";

import { useState } from "react";
import { useAddInstallmentMutation } from "@/redux/api/paymentApi";

export default function AddInstallmentModal({ payment, close }: any) {

    const [amount, setAmount] = useState("");
    const [paymentMode, setPaymentMode] = useState("Cash");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const [addInstallment] = useAddInstallmentMutation();

    const submit = async () => {

        if (!amount) {
            alert("Enter installment amount");
            return;
        }

        if (Number(amount) > payment.remainingAmount) {
            alert("Amount cannot exceed remaining amount");
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
            alert("Failed to save installment");
        }

        setLoading(false);
    };

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white p-6 rounded-xl w-[420px] space-y-4 relative">

                {/* CLOSE BUTTON */}
                <button
                    onClick={close}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold text-[#2C4276]">
                    Add Installment
                </h2>

                <p className="text-sm">
                    Remaining Amount:
                    <span className="font-semibold text-red-600 ml-1">
                        ₹{payment.remainingAmount}
                    </span>
                </p>

                {/* INSTALLMENT AMOUNT */}
                <div>
                    <label className="text-sm font-medium">Installment Amount</label>

                    <input
                        type="number"
                        className="border p-2 w-full rounded mt-1"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                {/* PAYMENT MODE */}
                <div>
                    <label className="text-sm font-medium">Payment Mode</label>

                    <select
                        className="border p-2 w-full rounded mt-1"
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                    >
                        <option value="Cash">Cash</option>
                        <option value="Online">Online</option>
                    </select>
                </div>

                {/* RECEIPT UPLOAD */}
                {paymentMode === "Online" && (

                    <div>
                        <label className="text-sm font-medium">
                            Upload Receipt (Image/PDF)
                        </label>

                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="border p-2 w-full rounded mt-1"
                            onChange={(e) =>
                                setFile(e.target.files ? e.target.files[0] : null)
                            }
                        />
                    </div>

                )}

                {/* SAVE BUTTON */}
                <button
                    onClick={submit}
                    disabled={loading}
                    className="bg-[#2C4276] text-white px-4 py-2 rounded w-full hover:bg-[#22345f]"
                >
                    {loading ? "Saving..." : "Save Installment"}
                </button>

            </div>

        </div>
    );
}