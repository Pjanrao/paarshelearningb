"use client";

import { useUpdateWithdrawalStatusAdminMutation } from "@/redux/api/referralAdminApi";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Wallet, Banknote, CreditCard, ChevronRight, Loader2 } from "lucide-react";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    withdrawal: any | null;
}

export default function WithdrawalPaymentModal({ open, setOpen, withdrawal }: Props) {
    const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
    const [transactionId, setTransactionId] = useState<string>("");
    const [errors, setErrors] = useState<any>({});
    const [updateStatus, { isLoading }] = useUpdateWithdrawalStatusAdminMutation();

    useEffect(() => {
        if (withdrawal) {
            setPaymentMethod(withdrawal.paymentMethod || "Cash");
            setTransactionId(withdrawal.transactionId || "");
            setErrors({});
        }
    }, [withdrawal, open]);

    const handleConfirm = async () => {
        if (!withdrawal?._id) return;

        if (paymentMethod === "UPI" && !transactionId.trim()) {
            setErrors({ transactionId: "Transaction Reference is required for UPI" });
            toast.error("Please provide a transaction reference");
            return;
        }

        try {
            await updateStatus({
                id: withdrawal._id,
                status: "approved",
                paymentMethod,
                transactionId: (paymentMethod === "UPI") ? transactionId : undefined,
                remarks: `Payment details updated via ${paymentMethod}`,
            }).unwrap();

            toast.success(withdrawal.status === "approved" ? "Payment details updated" : "Withdrawal approved");
            setOpen(false);
            setTransactionId("");
        } catch (error: any) {
            console.error("Payment Update Error:", error);
            toast.error(error?.data?.message || "Failed to process payment");
        }
    };

    if (!withdrawal) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md bg-white p-0 overflow-hidden rounded-2xl border-none">
                <div className="bg-[#2C4276] p-6 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Wallet size={24} />
                            Complete Payment
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-white/80 text-sm mt-2 font-medium">
                        Confirming payment for {withdrawal.studentId?.name || "Student"}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                            <p className="text-xs uppercase tracking-wider opacity-70 font-semibold">Amount</p>
                            <p className="text-xl font-black">₹{withdrawal.amount?.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                            <p className="text-xs uppercase tracking-wider opacity-70 font-semibold">UPI ID</p>
                            <p className="text-sm font-bold truncate" title={withdrawal.upiId}>{withdrawal.upiId || "N/A"}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-700">Mode of Payment</label>
                        <Select value={paymentMethod} onValueChange={(val) => {
                            setPaymentMethod(val);
                            setErrors({});
                        }}>
                            <SelectTrigger className="w-full h-14 rounded-xl border-2 focus:ring-[#2C4276]/20 bg-gray-50/50">
                                <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="UPI">UPI</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {paymentMethod === "UPI" && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                Transaction Reference / ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={transactionId}
                                onChange={(e) => {
                                    setTransactionId(e.target.value);
                                    if (errors.transactionId) setErrors({});
                                }}
                                placeholder="Enter Transaction ID or Reference..."
                                className={`w-full border-b-2 py-3 text-lg font-medium outline-none transition-all placeholder:text-gray-200 ${errors.transactionId ? 'border-red-500 bg-red-50' : 'border-gray-100 focus:border-[#2C4276]'}`}
                                autoFocus
                            />
                            {errors.transactionId && <p className="text-[10px] text-red-500 font-bold">{errors.transactionId}</p>}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => setOpen(false)}
                            className="flex-1 py-4 text-sm font-bold text-gray-500 hover:text-gray-700 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className={`flex-[2] py-4 rounded-xl text-white font-black text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${paymentMethod.startsWith("Cash") ? "bg-green-600 hover:bg-green-700 shadow-green-200" : "bg-[#2C4276] hover:opacity-90 shadow-blue-200"
                                } disabled:opacity-50`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span>{withdrawal.status === "approved" ? "Update Details" : "Confirm & Approve"}</span>
                                    <ChevronRight size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
