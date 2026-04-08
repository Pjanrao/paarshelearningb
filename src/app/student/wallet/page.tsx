"use client";

import { useState } from "react";
import { useGetWalletStatsQuery } from "@/redux/api/referralApi";
import WalletBalanceCards from "@/components/wallet/WalletBalanceCards";
import WithdrawalHistory from "@/components/wallet/WithdrawalHistory";
import WithdrawFundsModal from "@/components/wallet/WithdrawFundsModal";
import { Info } from "lucide-react";
import Link from "next/link";

export default function StudentWalletPage() {
    const { data: wallet } = useGetWalletStatsQuery();
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    const balance = wallet?.walletBalance || 0;
    const pendingWithdrawals = wallet?.pendingWithdrawals || 0;

    return (
        <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1e293b] mb-1">
                        Your Wallet
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Manage your balance and withdrawals
                    </p>
                </div>
                <div className="bg-blue-50 text-[#2C4276] px-4 py-2 rounded-lg text-xs font-semibold border border-blue-100 shadow-sm flex items-center gap-2">
                    <Info size={14} />
                    Pro Tip: Ensure your UPI ID is valid for withdrawals
                </div>
            </div>

            {/* Balance Cards */}
            <WalletBalanceCards
                balance={balance}
                pending={pendingWithdrawals}
                onWithdrawClick={() => setIsWithdrawModalOpen(true)}
            />

            {/* Withdrawal History */}
            <WithdrawalHistory />

            {/* Footer Link */}
            <div className="mt-6 text-center">
                <Link
                    href="/student/refer-earn"
                    className="text-sm text-[#2C4276] hover:underline font-medium"
                >
                    ← Back to Refer &amp; Earn
                </Link>
            </div>

            {/* Withdraw Modal */}
            <WithdrawFundsModal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                maxAmount={balance}
            />
        </>
    );
}
