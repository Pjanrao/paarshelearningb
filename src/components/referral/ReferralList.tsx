"use client";

import { useState } from "react";
import { useGetReferralDataQuery } from "@/redux/api/referralApi";

export default function ReferralList() {
    const { data = [] } = useGetReferralDataQuery();
    const [activeTab, setActiveTab] = useState("pending");

    // split data
    const pending = data.filter((r: any) => r.status === "Pending");
    const completed = data.filter((r: any) => r.status === "Completed");

    const currentData = activeTab === "pending" ? pending : completed;

    return (
        <div className="bg-white p-5 rounded-2xl shadow">

            <h2 className="text-xl font-semibold text-center mb-4">
                Your Referrals
            </h2>

            {/* Tabs */}
            <div className="flex gap-6 border-b mb-4 justify-center">
                <button
                    onClick={() => setActiveTab("pending")}
                    className={`pb-2 ${activeTab === "pending"
                        ? "border-b-2 border-[#2C4276] text-[#2C4276] font-medium"
                        : "text-gray-500"
                        }`}
                >
                    Pending ({pending.length})
                </button>

                <button
                    onClick={() => setActiveTab("completed")}
                    className={`pb-2 ${activeTab === "completed"
                        ? "border-b-2 border-[#2C4276] text-[#2C4276] font-medium"
                        : "text-gray-500"
                        }`}
                >
                    Completed ({completed.length})
                </button>
            </div>

            {/* Empty State */}
            {currentData.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    No {activeTab} referrals
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">

                        <thead className="text-gray-500 text-left border-b">
                            <tr>
                                <th className="py-3">Name</th>
                                <th>Email</th>
                                <th>Joined Date</th>
                                <th>Status</th>
                                <th>Reward</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentData.map((ref: any) => (
                                <tr key={ref._id} className="border-b hover:bg-gray-50 transition">

                                    <td className="py-3 font-medium">{ref.name}</td>

                                    <td className="text-gray-500">{ref.email || "-"}</td>

                                    <td className="text-gray-500">
                                        {new Date(ref.createdAt).toLocaleDateString()}
                                    </td>

                                    <td>
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                            {ref.status}
                                        </span>
                                    </td>

                                    <td className="text-green-600 font-semibold">
                                        ₹{ref.reward}
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            )}
        </div>
    );
}