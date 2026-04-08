"use client";

import { useState } from "react";
import { X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useRequestWithdrawalMutation } from "@/redux/api/referralApi";
import { toast } from "react-hot-toast";

interface WithdrawFundsModalProps {
    isOpen: boolean;
    onClose: () => void;
    maxAmount: number;
}

export default function WithdrawFundsModal({ isOpen, onClose, maxAmount }: WithdrawFundsModalProps) {
    const [amount, setAmount] = useState<string>("");
    const [upiId, setUpiId] = useState<string>("");
    const [isSuccess, setIsSuccess] = useState(false);

    const [requestWithdrawal, { isLoading }] = useRequestWithdrawalMutation();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (Number(amount) > maxAmount) {
            toast.error("Withdrawal amount exceeds balance");
            return;
        }

        try {
            await requestWithdrawal({ amount: Number(amount), upiId }).unwrap();
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setAmount("");
                setUpiId("");
            }, 2000);
        } catch (err: any) {
            toast.error(err?.data?.error || "Failed to process withdrawal");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
                {isSuccess ? (
                    <div className="p-12 text-center space-y-4">
                        <div className="inline-flex p-4 bg-green-50 rounded-full border border-green-200 mb-4">
                            <CheckCircle2 className="w-12 h-12 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#1e293b]">Request Submitted!</h3>
                        <p className="text-gray-500 text-sm">Your withdrawal request is being processed.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-bold text-[#1e293b]">Withdraw Funds</h3>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#1e293b]">Amount (₹)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        required
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setAmount(maxAmount.toString())}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#3B82F6] hover:text-[#2C4276]"
                                    >
                                        MAX
                                    </button>
                                </div>
                                <p className="text-[11px] text-gray-400">Available: ₹{maxAmount.toLocaleString()}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#1e293b]">UPI ID</label>
                                <input
                                    type="text"
                                    required
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    placeholder="username@upi"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] transition-all"
                                />
                            </div>

                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-3 text-xs text-[#2C4276]">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <p>Funds will be transferred to your UPI ID within 24-48 business hours.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm uppercase tracking-wider"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </div>
                                ) : (
                                    "Confirm Withdrawal"
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
