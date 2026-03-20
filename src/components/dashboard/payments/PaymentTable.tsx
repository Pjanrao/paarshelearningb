"use client";

import { useState } from "react";
import AddInstallmentModal from "./AddInstallmentModal";
import InstallmentHistoryModal from "./InstallmentHistoryModal";
import ViewPaymentModal from "./ViewPaymentModal";
import EditPaymentModal from "./EditPaymentModal";

import {
    PlusCircle,
    History,
    Eye,
    Pencil,
    Trash2
} from "lucide-react";

export default function PaymentTable({ payments = [], loading }: any) {

    const [installmentPayment, setInstallmentPayment] = useState<any>(null);
    const [historyPayment, setHistoryPayment] = useState<any>(null);
    const [viewPayment, setViewPayment] = useState<any>(null);
    const [editPayment, setEditPayment] = useState<any>(null);

    const getStatus = (p: any) => {
        if (p.remainingAmount === 0) return "Paid";
        return "Partial";
    };

    const deletePayment = async (id: string) => {

        if (!confirm("Are you sure you want to delete this payment?")) return;

        await fetch(`/api/payments/${id}`, {
            method: "DELETE"
        });

        window.location.reload();
    };

    if (loading) {
        return (
            <div className="text-center p-6">Loading payments...</div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">

            <table className="w-full text-sm">

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

                        /* -------- CALCULATE TOTAL PAID -------- */

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

                                {/* PAID AMOUNT (UPDATED) */}
                                <td className="p-3 text-green-600 font-semibold">
                                    ₹{totalPaid}
                                </td>

                                <td className="p-3 text-red-600 font-semibold">
                                    ₹{p.remainingAmount}
                                </td>

                                <td className="p-3">{p.paymentMode}</td>

                                {/* STATUS */}
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

                                {/* ACTIONS */}
                                <td className="p-3 flex gap-2 items-center">

                                    {/* ADD INSTALLMENT */}
                                    {p.remainingAmount > 0 && (
                                        <div className="relative group">

                                            <button
                                                onClick={() => setInstallmentPayment(p)}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 text-blue-600"
                                            >
                                                <PlusCircle size={16} />
                                            </button>

                                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                                                Add Installment
                                            </span>

                                        </div>
                                    )}

                                    {/* HISTORY */}
                                    <div className="relative group">

                                        <button
                                            onClick={() => setHistoryPayment(p)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 text-blue-600"
                                        >
                                            <History size={16} />
                                        </button>

                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                                            Payment History
                                        </span>

                                    </div>

                                    {/* VIEW */}
                                    <div className="relative group">

                                        <button
                                            onClick={() => setViewPayment(p)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 text-blue-600"
                                        >
                                            <Eye size={16} />
                                        </button>

                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                                            View Payment
                                        </span>

                                    </div>

                                    {/* EDIT */}
                                    <div className="relative group">

                                        <button
                                            onClick={() => setEditPayment(p)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 text-blue-600"
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                                            Edit Payment
                                        </span>

                                    </div>

                                    {/* DELETE */}
                                    <div className="relative group">

                                        <button
                                            onClick={() => deletePayment(p._id)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-red-600"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                                            Delete Payment
                                        </span>

                                    </div>

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


// "use client";

// import { useState } from "react";
// import AddInstallmentModal from "./AddInstallmentModal";
// import InstallmentHistoryModal from "./InstallmentHistoryModal";
// import ViewPaymentModal from "./ViewPaymentModal";
// import EditPaymentModal from "./EditPaymentModal";

// import {
//   PlusCircle,
//   History,
//   Eye,
//   Pencil,
//   Trash2
// } from "lucide-react";

// export default function PaymentTable({ payments = [], loading }: any) {

//   const [installmentPayment, setInstallmentPayment] = useState<any>(null);
//   const [historyPayment, setHistoryPayment] = useState<any>(null);
//   const [viewPayment, setViewPayment] = useState<any>(null);
//   const [editPayment, setEditPayment] = useState<any>(null);

//   const getStatus = (p: any) => {
//     if (p.remainingAmount === 0) return "Paid";
//     return "Partial";
//   };

//   const deletePayment = async (id: string) => {

//     if (!confirm("Are you sure you want to delete this payment?")) return;

//     await fetch(`/api/payments/${id}`, {
//       method: "DELETE"
//     });

//     window.location.reload();
//   };

//   if (loading) {
//     return (
//       <div className="text-center p-6">Loading payments...</div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden">

//       <table className="w-full text-sm">

//         <thead className="bg-gray-50 border-b">

//           <tr>
//             <th className="p-3 text-left">Student</th>
//             <th className="p-3 text-left">Course</th>
//             <th className="p-3 text-left">Total Fee</th>
//             <th className="p-3 text-left">Paid</th>
//             <th className="p-3 text-left">Remaining</th>
//             <th className="p-3 text-left">Mode</th>
//             <th className="p-3 text-left">Status</th>
//             <th className="p-3 text-left">Actions</th>
//             <th className="p-3 text-left">Date</th>
//           </tr>

//         </thead>

//         <tbody>

//           {payments.length === 0 && (
//             <tr>
//               <td colSpan={9} className="text-center p-6 text-gray-500">
//                 No payments found
//               </td>
//             </tr>
//           )}

//           {payments.map((p: any) => (

//             <tr key={p._id} className="border-b hover:bg-gray-50">

//               <td className="p-3">{p.studentId?.name ?? "-"}</td>

//               <td className="p-3">{p.courseId?.name ?? "-"}</td>

//               <td className="p-3">₹{p.totalAmount}</td>

//               <td className="p-3 text-green-600 font-semibold">
//                 ₹{p.paidAmount}
//               </td>

//               <td className="p-3 text-red-600 font-semibold">
//                 ₹{p.remainingAmount}
//               </td>

//               <td className="p-3">{p.paymentMode}</td>

//               {/* STATUS */}
//               <td className="p-3">

//                 {getStatus(p) === "Paid" ? (

//                   <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
//                     Paid
//                   </span>

//                 ) : (

//                   <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
//                     Partial
//                   </span>

//                 )}

//               </td>

//               {/* ACTIONS */}
// <td className="p-3 flex gap-2 items-center">

// {/* ADD INSTALLMENT */}
// {p.remainingAmount > 0 && (
// <div className="relative group">

// <button
// onClick={() => setInstallmentPayment(p)}
// className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 text-blue-600"
// >
// <PlusCircle size={16} />
// </button>

// <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
// Add Installment
// </span>

// </div>
// )}

// {/* HISTORY (ALWAYS VISIBLE) */}
// <div className="relative group">

// <button
// onClick={() => setHistoryPayment(p)}
// className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 text-blue-600"
// >
// <History size={16} />
// </button>

// <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
// Payment History
// </span>

// </div>

// {/* VIEW */}
// <div className="relative group">

// <button
// onClick={() => setViewPayment(p)}
// className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 text-blue-600"
// >
// <Eye size={16} />
// </button>

// <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
// View Payment
// </span>

// </div>

// {/* EDIT */}
// <div className="relative group">

// <button
// onClick={() => setEditPayment(p)}
// className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 text-blue-600"
// >
// <Pencil size={16} />
// </button>

// <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
// Edit Payment
// </span>

// </div>

// {/* DELETE */}
// <div className="relative group">

// <button
// onClick={() => deletePayment(p._id)}
// className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-red-600"
// >
// <Trash2 size={16} />
// </button>

// <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
// Delete Payment
// </span>

// </div>

// </td>

//               <td className="p-3">
//                 {p.createdAt
//                   ? new Date(p.createdAt).toLocaleDateString()
//                   : "-"}
//               </td>

//             </tr>

//           ))}

//         </tbody>

//       </table>

//       {/* INSTALLMENT MODAL */}
//       {installmentPayment && (
//         <AddInstallmentModal
//           payment={installmentPayment}
//           close={() => setInstallmentPayment(null)}
//         />
//       )}

//       {/* HISTORY MODAL */}
//       {historyPayment && (
//         <InstallmentHistoryModal
//           payment={historyPayment}
//           close={() => setHistoryPayment(null)}
//         />
//       )}

//       {/* VIEW MODAL */}
//       {viewPayment && (
//         <ViewPaymentModal
//           payment={viewPayment}
//           close={() => setViewPayment(null)}
//         />
//       )}

//       {/* EDIT MODAL */}
//       {editPayment && (
//         <EditPaymentModal
//           payment={editPayment}
//           close={() => setEditPayment(null)}
//         />
//       )}

//     </div>
//   );
// }