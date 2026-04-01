"use client";

export default function InstallmentHistoryModal({ payment, close }: any) {

    const history = [
        {
            amount: payment.paidAmount || 0,
            paymentMode: payment.paymentMode,
            receipt: payment.receipt || null,
            date: payment.createdAt,
            type: "First Payment",
        },
        ...(payment.installments || []).map((i: any) => ({
            amount: i.amount || 0,
            paymentMode: i.paymentMode,
            receipt: i.receipt,
            date: i.date,
            type: "Installment",
        })),
    ].filter(h => h.amount > 0);

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

            <div className="bg-white p-6 rounded-xl w-[520px] relative max-h-[80vh] overflow-y-auto">

                {/* CLOSE */}
                <button
                    onClick={close}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold mb-4 text-[#2C4276]">
                    Payment History
                </h2>

                <table className="w-full text-sm border">

                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left p-2">Type</th>
                            <th className="text-left p-2">Amount</th>
                            <th className="text-left p-2">Mode</th>
                            <th className="text-left p-2">Receipt</th>
                            <th className="text-left p-2">Date</th>
                        </tr>
                    </thead>

                    <tbody>

                        {history.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center p-4 text-gray-500">
                                    No payment history
                                </td>
                            </tr>
                        )}

                        {history.map((item: any, index: number) => (

                            <tr key={index} className="border-t">

                                <td className="p-2 font-medium">
                                    {item.type}
                                </td>

                                <td className="p-2">
                                    ₹{item.amount}
                                </td>

                                <td className="p-2">
                                    {item.paymentMode}
                                </td>

                                <td className="p-2">

                                    {item.receipt ? (

                                        item.receipt.match(/\.(jpg|jpeg|png)$/) ? (

                                            <img
                                                src={item.receipt}
                                                className="h-10 w-10 object-cover rounded border cursor-pointer"
                                                onClick={() => window.open(item.receipt, "_blank")}
                                            />

                                        ) : (

                                            <a
                                                href={item.receipt}
                                                target="_blank"
                                                className="text-blue-600 underline"
                                            >
                                                View
                                            </a>

                                        )

                                    ) : "-"}

                                </td>

                                <td className="p-2">
                                    {item.date ? new Date(item.date).toLocaleDateString() : "-"}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}