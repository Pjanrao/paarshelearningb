"use client";

import { useEffect, useState } from "react";

export default function ReferralViewModal({ userId, onClose }: any) {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        if (userId) {
            fetch(`/api/admin/referral/view/${userId}`)
                .then((res) => res.json())
                .then((res) => setData(res));
        }
    }, [userId]);

    if (!userId) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

            {/* MODAL BOX */}
            <div className="bg-white rounded-2xl shadow-xl w-[900px] max-h-[85vh] flex flex-col">

                {/* HEADER */}
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold">
                        Referred Users by {data?.userName}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* TABLE SCROLL AREA */}
                <div className="overflow-y-auto px-6 py-4">

                    <table className="w-full text-sm">

                        {/* TABLE HEADER */}
                        <thead className="sticky top-0 bg-white border-b text-gray-600">
                            <tr>
                                <th className="py-3 text-left">#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Courses</th>
                                <th>Status</th>
                                <th>Reward</th>
                                <th>Amount</th>
                                <th>Date</th>
                            </tr>
                        </thead>

                        {/* TABLE BODY */}
                        <tbody>
                            {data?.referrals?.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-6 text-gray-400">
                                        No referrals found
                                    </td>
                                </tr>
                            ) : (
                                data?.referrals?.map((r: any, i: number) => (
                                    <tr key={r._id} className="border-b hover:bg-gray-50">

                                        <td className="py-3">{i + 1}</td>

                                        <td className="font-medium">{r.name}</td>

                                        <td className="text-gray-600">{r.email}</td>

                                        <td>{r.coursesPurchased}</td>

                                        <td>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${r.status === "Completed"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                                }`}>
                                                {r.status}
                                            </span>
                                        </td>

                                        <td>
                                            <span className={`text-xs font-medium ${r.rewardGiven === "Yes"
                                                ? "text-green-600"
                                                : "text-gray-500"
                                                }`}>
                                                {r.rewardGiven}
                                            </span>
                                        </td>

                                        <td className="text-green-600 font-semibold">
                                            ₹{r.amount}
                                        </td>

                                        <td className="text-gray-500">
                                            {new Date(r.date).toLocaleDateString()}
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                </div>

            </div>
        </div>
    );
}