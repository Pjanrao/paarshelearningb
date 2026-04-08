"use client";

import { useGetWithdrawalHistoryQuery } from "@/redux/api/referralApi";
import { format } from "date-fns";
import { ArrowDownLeft, Clock, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default function WithdrawalHistory() {
    const { data: withdrawals, isLoading } = useGetWithdrawalHistoryQuery();

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "approved":
                return "text-green-600 bg-green-50 border-green-100";
            case "rejected":
                return "text-red-600 bg-red-50 border-red-100";
            default:
                return "text-orange-600 bg-orange-50 border-orange-100";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "approved": return <CheckCircle2 size={14} />;
            case "rejected": return <XCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-[#1e293b] font-bold text-lg">
                    Recent Withdrawals
                </h3>
            </div>

            {/* Content */}
            <div className="p-4">
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-2 bg-gray-100 rounded w-1/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !withdrawals || withdrawals.length === 0 ? (
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-purple-50/30 border border-purple-100">
                        <div className="bg-purple-100 p-2.5 rounded-lg text-purple-600 border border-purple-200">
                            <ArrowDownLeft size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1e293b] text-sm">No recent withdrawals.</h4>
                            <p className="text-gray-500 text-xs mt-0.5 font-medium">Earn rewards by referring friends</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {withdrawals.map((tx: any) => (
                            <div
                                key={tx._id}
                                className="flex items-center gap-4 p-3 rounded-xl bg-blue-50/30 border border-blue-100 transition-all hover:shadow-sm"
                            >
                                <div className="bg-blue-100 p-2.5 rounded-lg text-blue-600 border border-blue-200">
                                    <ArrowDownLeft size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-[#1e293b] text-sm">
                                            ₹{tx.amount.toLocaleString()}
                                        </h4>
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusStyle(tx.status)}`}>
                                            {getStatusIcon(tx.status)}
                                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <p className="text-gray-500 text-xs font-medium">
                                            {format(new Date(tx.createdAt), "MMM dd, yyyy")}
                                        </p>
                                        <span className="text-gray-300">•</span>
                                        <p className="text-gray-400 text-xs font-mono truncate">
                                            {tx.upiId}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {withdrawals && withdrawals.length > 0 && (
                <div className="border-t border-gray-100 p-3 text-center">
                    <Link
                        href="#"
                        className="text-sm font-semibold text-[#2C4276] hover:underline"
                    >
                        View Full Withdrawal History
                    </Link>
                </div>
            )}
        </div>
    );
}
