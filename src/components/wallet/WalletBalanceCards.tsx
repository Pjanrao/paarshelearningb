"use client";

import { Wallet, Clock, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface WalletBalanceCardsProps {
    balance: number;
    pending: number;
    onWithdrawClick: () => void;
}

export default function WalletBalanceCards({ balance, pending, onWithdrawClick }: WalletBalanceCardsProps) {
    return (
        <div className="grid md:grid-cols-2 gap-5 mb-6">
            {/* Current Balance Card */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden"
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 p-2.5 rounded-lg text-blue-600 border border-blue-200">
                            <Wallet size={22} />
                        </div>
                        <span className="text-xs font-semibold text-[#2C4276] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                            Current Balance
                        </span>
                    </div>

                    <h3 className="text-4xl font-bold text-[#3B82F6] mb-1">
                        ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </h3>
                    <p className="text-gray-500 text-xs font-medium">Available for withdrawal</p>
                </div>

                <button
                    onClick={onWithdrawClick}
                    className="w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 uppercase tracking-wider border-t border-blue-400"
                >
                    Withdraw Funds
                    <ArrowUpRight size={16} />
                </button>
            </motion.div>

            {/* Pending Withdrawals Card */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden"
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-orange-100 p-2.5 rounded-lg text-orange-600 border border-orange-200">
                            <Clock size={22} />
                        </div>
                        <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                            Pending Withdrawals
                        </span>
                    </div>

                    <h3 className="text-4xl font-bold text-[#1e293b] mb-1">
                        ₹{pending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </h3>
                    <p className="text-gray-500 text-xs font-medium">Processing in progress</p>
                </div>

                <button
                    className="w-full py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm transition-colors uppercase tracking-wider border-t border-orange-400"
                >
                    View Details
                </button>
            </motion.div>
        </div>
    );
}
