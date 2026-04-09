"use client";

import { useUpdateWithdrawalStatusAdminMutation } from "@/redux/api/referralAdminApi";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Pencil, CheckCircle, XCircle, Clock } from "lucide-react";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    withdrawal: any | null;
}

export default function WithdrawalEditModal({ open, setOpen, withdrawal }: Props) {
    const [status, setStatus] = useState<string>("");
    const [remarks, setRemarks] = useState<string>("");
    const [updateStatus, { isLoading }] = useUpdateWithdrawalStatusAdminMutation();

    useEffect(() => {
        if (withdrawal) {
            setStatus(withdrawal.status);
            setRemarks(withdrawal.remarks || "");
        }
    }, [withdrawal]);

    const handleSubmit = async () => {
        if (!withdrawal) return;

        try {
            await updateStatus({
                id: withdrawal._id,
                status,
                remarks,
            }).unwrap();
            toast.success("Withdrawal updated successfully");
            setOpen(false);
        } catch (error) {
            toast.error("Failed to update withdrawal");
        }
    };

    if (!withdrawal) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#2C4276] flex items-center gap-2">
                        <Pencil size={20} />
                        Update Withdrawal
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Status Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700">Withdrawal Status</label>
                        <div className="grid grid-cols-1 gap-2">
                            {[
                                { id: "pending", label: "Pending", icon: Clock, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
                                { id: "approved", label: "Approve Payment", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
                                { id: "rejected", label: "Reject Request", icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setStatus(item.id)}
                                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                                        status === item.id 
                                        ? `${item.border} ${item.bg}` 
                                        : "border-gray-100 hover:border-gray-200 bg-white"
                                    }`}
                                >
                                    <item.icon className={status === item.id ? item.color : "text-gray-400"} size={20} />
                                    <span className={`text-sm font-bold ${status === item.id ? "text-gray-900" : "text-gray-500"}`}>
                                        {item.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Remarks */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700">Remarks / Reason</label>
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Add internal remarks or reason for rejection/approval..."
                            className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#2C4276]/20 transition outline-none resize-none"
                            rows={4}
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                    <button
                        onClick={() => setOpen(false)}
                        className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-1 py-3 text-sm font-bold text-white bg-[#2C4276] rounded-xl hover:bg-opacity-90 transition shadow-lg shadow-[#2C4276]/10 disabled:opacity-50"
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
