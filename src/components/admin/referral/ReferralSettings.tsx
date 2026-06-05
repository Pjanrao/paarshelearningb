import { useState } from "react";
import {
    useGetReferralSettingsQuery,
    useUpdateReferralSettingsMutation,
} from "@/redux/api/referralAdminApi";

import { IndianRupee, Gift, Users, X, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ReferralSettings() {
    const { data, refetch, isLoading: isFetching } = useGetReferralSettingsQuery();
    const [updateSettings, { isLoading: isUpdating }] = useUpdateReferralSettingsMutation();

    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const [form, setForm] = useState({
        discountPercentage: 0,
        cashbackAmount: 0,
        maxReferrals: "Unlimited",
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
        setErrors({});
        setOpen(true);
    };

    const validate = () => {
        const newErrors: any = {};
        if (form.cashbackAmount < 0) newErrors.cashbackAmount = "Amount cannot be negative";
        if (form.newUserReward < 0) newErrors.newUserReward = "Reward cannot be negative";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        try {
            await updateSettings(form).unwrap();
            refetch();
            toast.success("Referral settings updated successfully");
            setOpen(false);
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Failed to update settings. Please try again.");
        }
    };

    return (
        <>
            <div className="bg-gradient-to-br from-[#2C4276] to-[#405D9B] text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />

                <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight">Referral Program</h2>
                            <p className="text-blue-100/70 text-sm mt-1">Configure rewards and incentives for user referrals</p>
                        </div>

                        <button
                            onClick={handleOpen}
                            className="bg-white text-[#2C4276] px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all shadow-lg active:scale-95 flex items-center gap-2"
                        >
                            <span>Change Rules</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg group hover:bg-white/15 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/10 rounded-xl">
                                    <IndianRupee className="text-white" size={24} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Cashback</span>
                            </div>
                            <p className="text-sm text-white/60 mb-1">Referrer Earns</p>
                            <h3 className="text-3xl font-black tabular-nums">
                                ₹{data?.cashbackAmount || 0}
                            </h3>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg group hover:bg-white/15 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/10 rounded-xl">
                                    <Gift className="text-white" size={24} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Welcome Reward</span>
                            </div>
                            <p className="text-sm text-white/60 mb-1">New User Gets</p>
                            <h3 className="text-3xl font-black tabular-nums">
                                ₹{data?.newUserReward || 0}
                            </h3>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg group hover:bg-white/15 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/10 rounded-xl">
                                    <Users className="text-white" size={24} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Limit</span>
                            </div>
                            <p className="text-sm text-white/60 mb-1">Max Referrals</p>
                            <h3 className="text-3xl font-black uppercase">
                                Unlimited
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <div className="fixed inset-0 bg-[#2C4276]/40 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-[#2C4276]">Reward Configuration</h2>
                                    <p className="text-xs text-gray-400">Update incentives for the referral program</p>
                                </div>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-gray-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                                        Referrer Cashback (₹) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <IndianRupee size={16} />
                                        </div>
                                        <input
                                            type="number"
                                            value={form.cashbackAmount}
                                            onChange={(e) => {
                                                setForm({ ...form, cashbackAmount: Number(e.target.value) });
                                                if (errors.cashbackAmount) setErrors({ ...errors, cashbackAmount: "" });
                                            }}
                                            className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-2xl outline-none focus:ring-4 focus:ring-[#2C4276]/10 transition-all font-semibold ${errors.cashbackAmount ? 'border-red-500 bg-red-50' : 'border-gray-100'}`}
                                            placeholder="0"
                                        />
                                    </div>
                                    {errors.cashbackAmount && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.cashbackAmount}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                                        New User Welcome Bonus (₹) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Gift size={16} />
                                        </div>
                                        <input
                                            type="number"
                                            value={form.newUserReward}
                                            onChange={(e) => {
                                                setForm({ ...form, newUserReward: Number(e.target.value) });
                                                if (errors.newUserReward) setErrors({ ...errors, newUserReward: "" });
                                            }}
                                            className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-2xl outline-none focus:ring-4 focus:ring-[#2C4276]/10 transition-all font-semibold ${errors.newUserReward ? 'border-red-500 bg-red-50' : 'border-gray-100'}`}
                                            placeholder="0"
                                        />
                                    </div>
                                    {errors.newUserReward && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.newUserReward}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                                        Maximum Referrals
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Users size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            value="Unlimited"
                                            disabled
                                            className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-transparent rounded-2xl text-gray-400 cursor-not-allowed font-semibold"
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 italic ml-1">Currently restricted to unlimited</p>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isUpdating}
                                        className="flex-[2] py-4 bg-[#2C4276] text-white rounded-2xl font-bold shadow-lg shadow-[#2C4276]/20 hover:opacity-95 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isUpdating ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                        <span>Update Program</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}