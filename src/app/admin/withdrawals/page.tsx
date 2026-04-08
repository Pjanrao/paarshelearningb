"use client";

import WithdrawalTable from "@/components/admin/withdrawal/WithdrawalTable";

export default function AdminWithdrawalsPage() {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#1e293b]">
                    Withdrawal Management
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Review and process student withdrawal requests
                </p>
            </div>

            <WithdrawalTable />
        </div>
    );
}
