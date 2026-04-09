"use client";

import { useState } from "react";
import { useGetPaymentsQuery } from "@/redux/api/paymentApi";
import PaymentTable from "@/components/dashboard/payments/PaymentTable";
import AddPaymentModal from "@/components/dashboard/payments/AddPaymentModal";
import { Plus } from "lucide-react";

export default function PaymentsPage() {

    const { data, isLoading } = useGetPaymentsQuery();

    const payments = data ?? [];

    const [open, setOpen] = useState(false);

    const [search, setSearch] = useState("");

    const [showFilter, setShowFilter] = useState(false);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [page, setPage] = useState(1);

    const limit = 5;

    // SEARCH + FILTER
    const filtered = payments.filter((p: any) => {

        const student = p.studentId?.name?.toLowerCase() || "";
        const course = p.courseId?.name?.toLowerCase() || "";
        const mode = p.paymentMode?.toLowerCase() || "";

        const searchMatch =
            student.includes(search.toLowerCase()) ||
            course.includes(search.toLowerCase()) ||
            mode.includes(search.toLowerCase());

        const created = new Date(p.createdAt);

        const afterStart =
            !startDate || created >= new Date(startDate);

        const beforeEnd =
            !endDate || created <= new Date(endDate);

        return searchMatch && afterStart && beforeEnd;

    });

    // PAGINATION
    const total = filtered.length;

    const pages = Math.ceil(total / limit);

    const start = (page - 1) * limit;

    const paginated = filtered.slice(start, start + limit);

    // EXPORT CSV
    const exportCSV = () => {

        const rows = filtered.map((p: any) => ({
            student: p.studentId?.name,
            course: p.courseId?.name,
            total: p.totalAmount,
            paid: p.paidAmount,
            remaining: p.remainingAmount,
            mode: p.paymentMode
        }));

        const csv =
            "Student,Course,Total,Paid,Remaining,Mode\n" +
            rows
                .map(
                    (r: any) =>
                        `${r.student},${r.course},${r.total},${r.paid},${r.remaining},${r.mode}`
                )
                .join("\n");

        const blob = new Blob([csv]);

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = "payments.csv";
        a.click();

    };

    return (
        <div className="p-6 relative">

            {/* HEADER */}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">

                <h1 className="text-3xl font-bold text-[#2C4276]">
                    Payment Management
                </h1>

                <button
                    onClick={() => setOpen(true)}
                    className="w-full md:w-auto bg-[#2C4276] text-white px-5 py-2.5 rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-md font-semibold active:scale-95 whitespace-nowrap"
                >
                    <Plus size={20} />
                    <span>Add Payment</span>
                </button>

            </div>

            {/* SEARCH + FILTER */}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">

                <input
                    type="text"
                    placeholder="Search student, course or mode..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-4 py-2 rounded-lg w-full sm:w-96"
                />

                <div className="flex flex-wrap gap-2 w-full sm:w-auto">

                    <button
                        onClick={exportCSV}
                        className="bg-gray-200 px-4 py-2 rounded-lg flex-1 sm:flex-none"
                    >
                        Export
                    </button>

                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg flex-1 sm:flex-none"
                    >
                        Filter Date
                    </button>

                </div>

            </div>

            {/* DATE FILTER POPUP */}

            {showFilter && (

                <div className="absolute right-6 top-36 z-50">

                    <div className="bg-white w-[320px] rounded-xl shadow-xl border p-5">

                        <div className="flex justify-between items-center mb-4">

                            <h3 className="text-gray-500 font-semibold text-sm tracking-wide">
                                SELECT RANGE
                            </h3>

                            <button
                                onClick={() => setShowFilter(false)}
                                className="text-gray-400 hover:text-gray-600 text-lg"
                            >
                                ✕
                            </button>

                        </div>

                        {/* START DATE */}

                        <div className="mb-4">

                            <p className="text-xs text-gray-500 mb-1 font-semibold">
                                START DATE
                            </p>

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                            />

                        </div>

                        {/* END DATE */}

                        <div className="mb-4">

                            <p className="text-xs text-gray-500 mb-1 font-semibold">
                                END DATE
                            </p>

                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                            />

                        </div>

                        <button
                            onClick={() => {
                                setStartDate("");
                                setEndDate("");
                            }}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 rounded-lg text-sm"
                        >
                            Clear All Filters
                        </button>

                    </div>

                </div>

            )}

            {/* TABLE */}

            <PaymentTable payments={paginated} loading={isLoading} />

            {/* PAGINATION */}

            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">

                <p className="text-sm text-gray-500 text-center sm:text-left">
                    Showing {start + 1} to {Math.min(start + limit, total)} of {total} payments
                </p>

                <div className="flex flex-wrap justify-center gap-2">

                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="bg-gray-200 px-3 py-1 rounded"
                    >
                        Previous
                    </button>

                    {[...Array(pages)].map((_, i) => (

                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1 rounded ${page === i + 1
                                ? "bg-[#2C4276] text-white"
                                : "bg-gray-200"
                                }`}
                        >
                            {i + 1}
                        </button>

                    ))}

                    <button
                        disabled={page === pages}
                        onClick={() => setPage(page + 1)}
                        className="bg-gray-200 px-3 py-1 rounded"
                    >
                        Next
                    </button>

                </div>

            </div>

            {/* ADD PAYMENT MODAL */}

            {open && <AddPaymentModal close={() => setOpen(false)} />}

        </div>
    );
}