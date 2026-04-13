"use client";

import { useState } from "react";
import {
    useGetReferralSettingsQuery,
    useUpdateReferralSettingsMutation,
} from "@/redux/api/referralAdminApi";

import { IndianRupee, Gift, Users } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function ReferralSettings() {
    const { data, refetch } = useGetReferralSettingsQuery();
    const [updateSettings] = useUpdateReferralSettingsMutation();

    const [open, setOpen] = useState(false);

    const [form, setForm] = useState({
        discountPercentage: 0,
        cashbackAmount: 0,
        maxReferrals: "",
        rewardDays: 0,
        newUserReward: 0,
    });

    const handleOpen = () => {
        setForm({
            discountPercentage: data?.discountPercentage || 0,
            cashbackAmount: data?.cashbackAmount || 0,
            maxReferrals: "Unlimited",
            rewardDays: data?.rewardDays || 0,
            newUserReward: data?.newUserReward || 0,
        });
        setOpen(true);
    };

    const handleSave = async () => {
        try {
            await updateSettings(form).unwrap();
            refetch();
            toast.success("Settings updated successfully");
            setOpen(false);
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Something went wrong");
        }
    };

    return (
        <>
            <Toaster position="top-right" />
            {/* MAIN CARD */}
            <div className="bg-gradient-to-r from-[#2C4276] to-blue-600 text-white p-7 rounded-3xl shadow-lg">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-semibold tracking-wide">
                        Referral Settings
                    </h2>

                    <button
                        onClick={handleOpen}
                        className="bg-white text-[#2C4276] px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transition"
                    >
                        Edit Settings
                    </button>
                </div>

                {/* CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">

                    {/* Cashback */}
                    <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-md flex items-center justify-between hover:scale-[1.02] transition">
                        <div>
                            <p className="text-sm text-white/70">Cashback Amount</p>
                            <h3 className="text-2xl font-bold">
                                ₹{data?.cashbackAmount || 0}
                            </h3>
                        </div>
                        <IndianRupee className="text-white/70" />
                    </div>

                    {/* New User Reward */}
                    <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-md flex items-center justify-between hover:scale-[1.02] transition">
                        <div>
                            <p className="text-sm text-white/70">New User Reward</p>
                            <h3 className="text-2xl font-bold">
                                ₹{data?.newUserReward || 0}
                            </h3>
                        </div>
                        <Gift className="text-white/70" />
                    </div>

                    {/* Max Referrals */}
                    <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-md flex items-center justify-between hover:scale-[1.02] transition">
                        <div>
                            <p className="text-sm text-white/70">Maximum Referrals</p>
                            <h3 className="text-2xl font-bold">
                                Unlimited
                            </h3>
                        </div>
                        <Users className="text-white/70" />
                    </div>

                </div>
            </div>

            {/* MODAL */}
            {open && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

                    <div className="bg-white w-[500px] rounded-2xl p-6 shadow-xl">

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
                                    New User Reward (₹)
                                </label>
                                <input
                                    type="number"
                                    value={form.newUserReward}
                                    onChange={(e) =>
                                        setForm({ ...form, newUserReward: Number(e.target.value) })
                                    }
                                    className="w-full border p-2 rounded mt-1"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">
                                    Maximum Referrals
                                </label>
                                <input
                                    type="text"
                                    value="Unlimited"
                                    disabled
                                    className="w-full border p-2 rounded mt-1 bg-gray-100 text-gray-500 cursor-not-allowed"
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
                                className="px-4 py-2 bg-black text-white rounded hover:opacity-90"
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



// "use client";

// import { useState } from "react";
// import {
//     useGetReferralSettingsQuery,
//     useUpdateReferralSettingsMutation,
// } from "@/redux/api/referralAdminApi";

// export default function ReferralSettings() {
//     const { data, refetch } = useGetReferralSettingsQuery();
//     const [updateSettings] = useUpdateReferralSettingsMutation();

//     const [open, setOpen] = useState(false);

//     const [form, setForm] = useState({
//         discountPercentage: 0,
//         cashbackAmount: 0,
//         maxReferrals: "",
//         rewardDays: 0,
//         newUserReward: 0, // ✅ ADD THIS

//     });

//     const handleOpen = () => {
//         setForm({
//             discountPercentage: data?.discountPercentage || 0,
//             cashbackAmount: data?.cashbackAmount || 0,
//             maxReferrals: data?.maxReferrals || "",
//             rewardDays: data?.rewardDays || 0,
//             newUserReward: data?.newUserReward || 0, // ✅ ADD THIS

//         });
//         setOpen(true);
//     };

//     const handleSave = async () => {
//         try {
//             await updateSettings(form).unwrap();

//             refetch();

//             alert("Settings updated successfully");
//             setOpen(false);
//         } catch (error) {
//             console.error("Update failed:", error);
//             alert("Something went wrong");
//         }
//     };

//     return (
//         <>
//             {/* MAIN CARD */}
//             <div className="bg-gradient-to-r from-[#2C4276] to-blue-600 text-white p-6 rounded-2xl shadow">

//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-bold">Referral Settings</h2>

//                     <button
//                         onClick={handleOpen}
//                         className="bg-white text-[#2C4276] px-4 py-2 rounded-lg text-sm font-medium"
//                     >
//                         Edit Settings
//                     </button>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-4">
//                     {/* Discount */}
//                     {/* <div className="bg-white/10 p-4 rounded-xl">
//                         <p className="text-sm opacity-80">Discount Percentage</p>
//                         <h3 className="text-lg font-semibold">
//                             {data?.discountPercentage !== undefined ? `${data.discountPercentage}%` : "%"}
//                         </h3>
//                     </div> */}

//                     {/* Cashback */}
//                     <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-md hover:scale-[1.02] transition-all duration-200">
//                         <p className="text-sm opacity-80">Cashback Amount</p>
//                         <h3 className="text-lg font-semibold">
//                             {data?.cashbackAmount ? `₹${data.cashbackAmount}` : "₹"}
//                         </h3>
//                     </div>
//                     <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-md hover:scale-[1.02] transition-all duration-200">
//                         <p className="text-sm opacity-80">New User Reward</p>
//                         <h3 className="text-lg font-semibold">
//                             {data?.newUserReward ? `₹${data.newUserReward}` : "₹"}
//                         </h3>
//                     </div>
//                     {/* Max Referrals */}
//                     <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-md hover:scale-[1.02] transition-all duration-200">
//                         <p className="text-sm opacity-80">Maximum Referrals</p>
//                         <h3 className="text-lg font-semibold">
//                             {data?.maxReferrals || "Unlimited"}
//                         </h3>
//                     </div>

//                     {/* Credit Days */}
//                     {/* <div className="bg-white/10 p-4 rounded-xl">
//                         <p className="text-sm opacity-80">Reward Credit Days</p>
//                         <h3 className="text-lg font-semibold">
//                             {data?.rewardDays !== undefined
//                                 ? `${data.rewardDays} day(s)`
//                                 : "0 day"}
//                         </h3>
//                     </div> */}

//                 </div>
//             </div>

//             {/* MODAL */}
//             {open && (
//                 <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

//                     <div className="bg-white w-[500px] rounded-xl p-6 shadow-lg">

//                         {/* HEADER */}
//                         <div className="flex justify-between items-center mb-4">
//                             <h2 className="text-lg font-semibold">
//                                 Edit Referral Settings
//                             </h2>

//                             <button onClick={() => setOpen(false)}>✕</button>
//                         </div>

//                         {/* FORM */}
//                         <div className="space-y-4">

//                             {/* <div>
//                                 <label className="text-sm text-gray-600">
//                                     Discount Percentage (%)
//                                 </label>
//                                 <input
//                                     type="number"
//                                     value={form.discountPercentage}
//                                     onChange={(e) =>
//                                         setForm({ ...form, discountPercentage: Number(e.target.value) })
//                                     }
//                                     className="w-full border p-2 rounded mt-1"
//                                 />
//                             </div> */}

//                             <div>
//                                 <label className="text-sm text-gray-600">
//                                     Cashback Amount (₹)
//                                 </label>
//                                 <input
//                                     type="number"
//                                     value={form.cashbackAmount}
//                                     onChange={(e) =>
//                                         setForm({ ...form, cashbackAmount: Number(e.target.value) })
//                                     }
//                                     className="w-full border p-2 rounded mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="text-sm text-gray-600">
//                                     New User Reward (₹)
//                                 </label>
//                                 <input
//                                     type="number"
//                                     value={form.newUserReward}
//                                     onChange={(e) =>
//                                         setForm({ ...form, newUserReward: Number(e.target.value) })
//                                     }
//                                     className="w-full border p-2 rounded mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="text-sm text-gray-600">
//                                     Maximum Referrals (0 for unlimited)
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={form.maxReferrals}
//                                     onChange={(e) =>
//                                         setForm({ ...form, maxReferrals: e.target.value })
//                                     }
//                                     className="w-full border p-2 rounded mt-1"
//                                 />
//                             </div>

//                             {/* <div>
//                                 <label className="text-sm text-gray-600">
//                                     Reward Credit Days
//                                 </label>
//                                 <input
//                                     type="number"
//                                     value={form.rewardDays}
//                                     onChange={(e) =>
//                                         setForm({ ...form, rewardDays: Number(e.target.value) })
//                                     }
//                                     className="w-full border p-2 rounded mt-1"
//                                 />
//                             </div> */}

//                         </div>

//                         {/* ACTIONS */}
//                         <div className="flex justify-end gap-3 mt-6">

//                             <button
//                                 onClick={() => setOpen(false)}
//                                 className="px-4 py-2 border rounded"
//                             >
//                                 Cancel
//                             </button>

//                             <button
//                                 onClick={handleSave}
//                                 className="px-4 py-2 bg-black text-white rounded"
//                             >
//                                 Update Settings
//                             </button>

//                         </div>

//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }