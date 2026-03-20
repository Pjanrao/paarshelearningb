"use client";

import { X } from "lucide-react";

export default function ViewPaymentModal({ payment, close }: any) {

    const installmentHistory = [
        {
            amount: payment.paidAmount,
            paymentMode: payment.paymentMode,
            date: payment.createdAt,
            receipt: payment.receipt,
            type: "First Payment"
        },
        ...(payment.installments || []).map((i: any) => ({
            ...i,
            type: "Installment"
        }))
    ];

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-[560px] max-h-[85vh] rounded-xl shadow-xl relative overflow-hidden">

                {/* HEADER */}

                <div className="flex justify-between items-center px-5 py-3 border-b">

                    <h2 className="text-lg font-semibold text-gray-800">
                        Payment Details
                    </h2>

                    <button
                        onClick={close}
                        className="text-gray-500 hover:text-gray-800"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* BODY */}

                <div className="p-4 space-y-4 overflow-y-auto max-h-[75vh]">

                    {/* PAYMENT INFORMATION */}

                    <div className="border rounded-lg overflow-hidden">

                        <div className="bg-blue-50 px-4 py-2 font-semibold text-blue-700 text-sm">
                            Payment Information
                        </div>

                        <div className="grid grid-cols-2 text-sm">

                            <div className="p-2 border-b font-medium text-gray-500">
                                Total Amount
                            </div>
                            <div className="p-2 border-b">
                                ₹{payment.totalAmount}
                            </div>

                            <div className="p-2 border-b font-medium text-gray-500">
                                Paid Amount
                            </div>
                            <div className="p-2 border-b">
                                ₹{payment.paidAmount}
                            </div>

                            <div className="p-2 border-b font-medium text-gray-500">
                                Remaining
                            </div>
                            <div className="p-2 border-b">
                                ₹{payment.remainingAmount}
                            </div>

                            <div className="p-2 border-b font-medium text-gray-500">
                                Payment Mode
                            </div>
                            <div className="p-2 border-b">
                                {payment.paymentMode}
                            </div>

                            <div className="p-2 border-b font-medium text-gray-500">
                                Date
                            </div>
                            <div className="p-2 border-b">
                                {payment.createdAt
                                    ? new Date(payment.createdAt).toLocaleString()
                                    : "-"}
                            </div>

                            {/* RECEIPT VIEW */}

                            {payment.paymentMode === "Online" && payment.receipt && (

                                <>
                                    <div className="p-2 font-medium text-gray-500">
                                        Receipt
                                    </div>

                                    <div className="p-2">
                                        <a
                                            href={payment.receipt}
                                            target="_blank"
                                            className="text-blue-600 underline"
                                        >
                                            View Receipt
                                        </a>
                                    </div>
                                </>

                            )}

                        </div>

                    </div>


                    {/* STUDENT INFORMATION */}

                    <div className="border rounded-lg overflow-hidden">

                        <div className="bg-blue-50 px-4 py-2 font-semibold text-blue-700 text-sm">
                            Student Information
                        </div>

                        <div className="grid grid-cols-2 text-sm">

                            <div className="p-2 border-b font-medium text-gray-500">
                                Name
                            </div>
                            <div className="p-2 border-b">
                                {payment.studentId?.name || "-"}
                            </div>

                            <div className="p-2 border-b font-medium text-gray-500">
                                Email
                            </div>
                            <div className="p-2 border-b">
                                {payment.studentId?.email || "-"}
                            </div>

                            <div className="p-2 font-medium text-gray-500">
                                Phone
                            </div>
                            <div className="p-2">
                                {payment.studentId?.phone ||
                                    payment.studentId?.mobile ||
                                    payment.studentId?.contact ||
                                    "-"}
                            </div>

                        </div>

                    </div>


                    {/* COURSE INFORMATION */}

                    <div className="border rounded-lg overflow-hidden">

                        <div className="bg-blue-50 px-4 py-2 font-semibold text-blue-700 text-sm">
                            Course Information
                        </div>

                        <div className="grid grid-cols-2 text-sm">

                            <div className="p-2 border-b font-medium text-gray-500">
                                Course Name
                            </div>
                            <div className="p-2 border-b">
                                {payment.courseId?.name || "-"}
                            </div>

                            <div className="p-2 font-medium text-gray-500">
                                Price
                            </div>
                            <div className="p-2">
                                ₹{payment.totalAmount}
                            </div>

                        </div>

                    </div>


                    {/* INSTALLMENT HISTORY */}

                    <div className="border rounded-lg overflow-hidden">

                        <div className="bg-blue-50 px-4 py-2 font-semibold text-blue-700 text-sm">
                            Installment History
                        </div>

                        {installmentHistory.length > 0 ? (

                            <table className="w-full text-sm">

                                <thead className="bg-gray-50">

                                    <tr>
                                        <th className="p-2 text-left">Date</th>
                                        <th className="p-2 text-left">Amount</th>
                                        <th className="p-2 text-left">Mode</th>
                                        <th className="p-2 text-left">Receipt</th>
                                        <th className="p-2 text-left">Type</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {installmentHistory.map((inst: any, i: number) => (

                                        <tr key={i} className="border-t">

                                            <td className="p-2">
                                                {inst.date
                                                    ? new Date(inst.date).toLocaleDateString()
                                                    : "-"}
                                            </td>

                                            <td className="p-2 text-green-600 font-medium">
                                                ₹{inst.amount}
                                            </td>

                                            <td className="p-2">
                                                {inst.paymentMode}
                                            </td>

                                            <td className="p-2">

                                                {inst.paymentMode === "Online" && inst.receipt ? (

                                                    <a
                                                        href={inst.receipt}
                                                        target="_blank"
                                                        className="text-blue-600 underline text-xs"
                                                    >
                                                        View
                                                    </a>

                                                ) : (

                                                    "-"
                                                )}

                                            </td>

                                            <td className="p-2 text-gray-500 text-xs">
                                                {inst.type}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        ) : (

                            <div className="p-3 text-gray-500 text-sm">
                                No installment history
                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}
// "use client";

// export default function ViewPaymentModal({ payment, close }: any) {
//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

//       <div className="bg-white p-6 rounded-xl w-[500px] relative">

//         <button
//           onClick={close}
//           className="absolute top-3 right-3 text-gray-500"
//         >
//           ✕
//         </button>

//         <h2 className="text-xl font-semibold mb-4">
//           Payment Details
//         </h2>

//         <div className="space-y-2 text-sm">

//           <p><b>Student:</b> {payment.studentId?.name}</p>
//           <p><b>Course:</b> {payment.courseId?.name}</p>
//           <p><b>Total Fee:</b> ₹{payment.totalAmount}</p>
//           <p><b>Paid:</b> ₹{payment.paidAmount}</p>
//           <p><b>Remaining:</b> ₹{payment.remainingAmount}</p>
//           <p><b>Mode:</b> {payment.paymentMode}</p>

//           <p>
//             <b>Date:</b>{" "}
//             {new Date(payment.createdAt).toLocaleDateString()}
//           </p>

//         </div>

//       </div>

//     </div>
//   );
// }