"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { User, Mail, IndianRupee, CreditCard, Calendar, Activity, Info } from "lucide-react";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    withdrawal: any | null;
}

export default function WithdrawalViewModal({ open, setOpen, withdrawal }: Props) {
    if (!withdrawal) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved": return "text-green-600 bg-green-50 border-green-100";
            case "rejected": return "text-red-600 bg-red-50 border-red-100";
            default: return "text-orange-600 bg-orange-50 border-orange-100";
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#2C4276] flex items-center gap-2">
                        <Info size={20} />
                        Withdrawal Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Student Info */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <User size={18} className="text-gray-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Student Name</p>
                                <p className="text-sm font-medium text-gray-900">{withdrawal.studentId?.name || "N/A"}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Mail size={18} className="text-gray-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Email Address</p>
                                <p className="text-sm font-medium text-gray-900">{withdrawal.studentId?.email || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Transaction Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <IndianRupee size={18} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Amount</p>
                                <p className="text-sm font-bold text-[#2C4276]">₹{withdrawal.amount?.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-orange-50 rounded-lg">
                                <Activity size={18} className="text-orange-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Status</p>
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getStatusColor(withdrawal.status)}`}>
                                    {withdrawal.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <CreditCard size={18} className="text-gray-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">UPI ID / Payment Info</p>
                                <p className="text-sm font-mono text-gray-900 break-all">{withdrawal.upiId || "No Payment ID provided"}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Calendar size={18} className="text-gray-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Request Date</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {format(new Date(withdrawal.createdAt), "PPP p")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {withdrawal.remarks && (
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Remarks</p>
                            <p className="text-sm text-gray-700 italic">"{withdrawal.remarks}"</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <button
                        onClick={() => setOpen(false)}
                        className="px-6 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
