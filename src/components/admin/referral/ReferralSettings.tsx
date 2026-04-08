"use client";

import { useState } from "react";
import {
    useGetReferralSettingsQuery,
    useUpdateReferralSettingsMutation,
} from "@/redux/api/referralAdminApi";

export default function ReferralSettings() {
    const { data, refetch } = useGetReferralSettingsQuery();
    const [updateSettings] = useUpdateReferralSettingsMutation();

    const [open, setOpen] = useState(false);

    const [form, setForm] = useState({
        discount: 0,
        cashbackAmount: 0,
        maxReferrals: "",
        creditDays: 0,
    });

    const handleOpen = () => {
        setForm({
            discount: data?.discount || 0,
            cashbackAmount: data?.cashbackAmount || 0,
            maxReferrals: data?.maxReferrals || "",
            creditDays: data?.creditDays || 0,
        });
        setOpen(true);
    };

    const handleSave = async () => {
        try {
            await updateSettings(form).unwrap();

            refetch();

            alert("Settings updated successfully");
            setOpen(false);
        } catch (error) {
            console.error("Update failed:", error);
            alert("Something went wrong");
        }
    };

    return (
        <>
            {/* MAIN CARD */}
            <div className="bg-gradient-to-r from-[#2C4276] to-blue-600 text-white p-6 rounded-2xl shadow">

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Referral Settings</h2>

                    <button
                        onClick={handleOpen}
                        className="bg-white text-[#2C4276] px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        Edit Settings
                    </button>
                </div>

                <div className="grid md:grid-cols-4 gap-4">

                    {/* Discount */}
                    <div className="bg-white/10 p-4 rounded-xl">
                        <p className="text-sm opacity-80">Discount Percentage</p>
                        <h3 className="text-lg font-semibold">
                            {data?.discount !== undefined ? `${data.discount}%` : "%"}
                        </h3>
                    </div>

                    {/* Cashback */}
                    <div className="bg-white/10 p-4 rounded-xl">
                        <p className="text-sm opacity-80">Cashback Amount</p>
                        <h3 className="text-lg font-semibold">
                            {data?.cashbackAmount ? `₹${data.cashbackAmount}` : "₹"}
                        </h3>
                    </div>

                    {/* Max Referrals */}
                    <div className="bg-white/10 p-4 rounded-xl">
                        <p className="text-sm opacity-80">Maximum Referrals</p>
                        <h3 className="text-lg font-semibold">
                            {data?.maxReferrals || "Unlimited"}
                        </h3>
                    </div>

                    {/* Credit Days */}
                    <div className="bg-white/10 p-4 rounded-xl">
                        <p className="text-sm opacity-80">Reward Credit Days</p>
                        <h3 className="text-lg font-semibold">
                            {data?.creditDays !== undefined
                                ? `${data.creditDays} day`
                                : "0 day"}
                        </h3>
                    </div>

                </div>
            </div>

            {/* MODAL */}
            {open && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

                    <div className="bg-white w-[500px] rounded-xl p-6 shadow-lg">

                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">
                                Edit Referral Settings
                            </h2>

                            <button onClick={() => setOpen(false)}>✕</button>
                        </div>

                        {/* FORM */}
                        <div className="space-y-4">

                            <div>
                                <label className="text-sm text-gray-600">
                                    Discount Percentage (%)
                                </label>
                                <input
                                    type="number"
                                    value={form.discount}
                                    onChange={(e) =>
                                        setForm({ ...form, discount: Number(e.target.value) })
                                    }
                                    className="w-full border p-2 rounded mt-1"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">
                                    Cashback Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    value={form.cashbackAmount}
                                    onChange={(e) =>
                                        setForm({ ...form, cashbackAmount: Number(e.target.value) })
                                    }
                                    className="w-full border p-2 rounded mt-1"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">
                                    Maximum Referrals (0 for unlimited)
                                </label>
                                <input
                                    type="text"
                                    value={form.maxReferrals}
                                    onChange={(e) =>
                                        setForm({ ...form, maxReferrals: e.target.value })
                                    }
                                    className="w-full border p-2 rounded mt-1"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">
                                    Reward Credit Days
                                </label>
                                <input
                                    type="number"
                                    value={form.creditDays}
                                    onChange={(e) =>
                                        setForm({ ...form, creditDays: Number(e.target.value) })
                                    }
                                    className="w-full border p-2 rounded mt-1"
                                />
                            </div>

                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-end gap-3 mt-6">

                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-black text-white rounded"
                            >
                                Update Settings
                            </button>

                        </div>

                    </div>
                </div>
            )}
        </>
    );
}