"use client";

import { useState } from "react";
import AddInstallmentModal from "./AddInstallmentModal";
import InstallmentHistoryModal from "./InstallmentHistoryModal";
import ViewPaymentModal from "./ViewPaymentModal";
import EditPaymentModal from "./EditPaymentModal";
import { useDeletePaymentMutation } from "@/redux/api/paymentApi";
import { toast } from "sonner";

import {
    PlusCircle,
    History,
    Eye,
    Pencil,
    Trash2,
    X
} from "lucide-react";

export default function PaymentTable({ payments = [], loading }: any) {

    const [installmentPayment, setInstallmentPayment] = useState<any>(null);
    const [historyPayment, setHistoryPayment] = useState<any>(null);
    const [viewPayment, setViewPayment] = useState<any>(null);
    const [editPayment, setEditPayment] = useState<any>(null);

    // ✅ NEW STATE FOR POPUP
    const [deleteItem, setDeleteItem] = useState<any>(null);

    const [deletePaymentApi] = useDeletePaymentMutation();

    const getStatus = (p: any) => {
        if (p.remainingAmount === 0) return "Paid";
        return "Partial";
    };

    /* ================= DELETE ================= */
    const handleDelete = async () => {

        const promise = deletePaymentApi(deleteItem._id).unwrap();

        toast.promise(promise, {
            loading: "Deleting payment...",
            success: "Payment deleted successfully ✅",
            error: "Failed to delete payment ❌",
        });

        try {
            await promise;
            setDeleteItem(null);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="text-center p-6">Loading payments...</div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">

            <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[800px]">

                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-3 text-left">Student</th>
                            <th className="p-3 text-left">Course</th>
                            <th className="p-3 text-left">Total Fee</th>
                            <th className="p-3 text-left">Paid</th>
                            <th className="p-3 text-left">Remaining</th>
                            <th className="p-3 text-left">Mode</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Actions</th>
                            <th className="p-3 text-left">Date</th>
                        </tr>
                    </thead>

                    <tbody>

                        {payments.length === 0 && (
                            <tr>
                                <td colSpan={9} className="text-center p-6 text-gray-500">
                                    No payments found
                                </td>
                            </tr>
                        )}

                        {payments.map((p: any) => {

                            const installmentTotal =
                                p.installments?.reduce(
                                    (sum: number, i: any) => sum + Number(i.amount || 0),
                                    0
                                ) || 0;

                            const totalPaid = p.paidAmount + installmentTotal;

                            return (
                                <tr key={p._id} className="border-b hover:bg-gray-50">

                                    <td className="p-3">{p.studentId?.name ?? "-"}</td>
                                    <td className="p-3">{p.courseId?.name ?? "-"}</td>

                                    <td className="p-3">₹{p.totalAmount}</td>

                                    <td className="p-3 text-green-600 font-semibold">
                                        ₹{totalPaid}
                                    </td>

                                    <td className="p-3 text-red-600 font-semibold">
                                        ₹{p.remainingAmount}
                                    </td>

                                    <td className="p-3">{p.paymentMode}</td>

                                    <td className="p-3">
                                        {getStatus(p) === "Paid" ? (
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                                                Paid
                                            </span>
                                        ) : (
                                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                                                Partial
                                            </span>
                                        )}
                                    </td>

                                    <td className="p-3 flex gap-2 items-center">

                                        {p.remainingAmount > 0 && (
                                            <button
                                                onClick={() => setInstallmentPayment(p)}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 text-blue-600"
                                            >
                                                <PlusCircle size={16} />
                                            </button>
                                        )}

                                        <button
                                            onClick={() => setHistoryPayment(p)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 text-blue-600"
                                        >
                                            <History size={16} />
                                        </button>

                                        <button
                                            onClick={() => setViewPayment(p)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 text-blue-600"
                                        >
                                            <Eye size={16} />
                                        </button>

                                        <button
                                            onClick={() => setEditPayment(p)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 text-blue-600"
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        {/* ✅ DELETE BUTTON */}
                                        <button
                                            onClick={() => setDeleteItem(p)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-red-600"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                    </td>

                                    <td className="p-3">
                                        {p.createdAt
                                            ? new Date(p.createdAt).toLocaleDateString()
                                            : "-"}
                                    </td>

                                </tr>
                            );
                        })}

                    </tbody>

                </table>
            </div>

            {/* ================= DELETE POPUP ================= */}
            {deleteItem && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white w-[380px] rounded-xl shadow-xl p-6 relative">

                        {/* CLOSE */}
                        <button
                            onClick={() => setDeleteItem(null)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-black"
                        >
                            <X size={18} />
                        </button>

                        <h2 className="text-lg font-semibold mb-2">
                            Delete Payment
                        </h2>

                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete this payment? This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">

                            <button
                                onClick={() => setDeleteItem(null)}
                                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                            >
                                Delete
                            </button>

                        </div>

                    </div>
                </div>
            )}

            {/* MODALS */}
            {installmentPayment && (
                <AddInstallmentModal
                    payment={installmentPayment}
                    close={() => setInstallmentPayment(null)}
                />
            )}

            {historyPayment && (
                <InstallmentHistoryModal
                    payment={historyPayment}
                    close={() => setHistoryPayment(null)}
                />
            )}

            {viewPayment && (
                <ViewPaymentModal
                    payment={viewPayment}
                    close={() => setViewPayment(null)}
                />
            )}

            {editPayment && (
                <EditPaymentModal
                    payment={editPayment}
                    close={() => setEditPayment(null)}
                />
            )}

        </div>
    );
}