"use client";

import {
    useGetAllWithdrawalsAdminQuery,
} from "@/redux/api/referralAdminApi";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Eye, Pencil, Trash2 } from "lucide-react";
import WithdrawalViewModal from "./WithdrawalViewModal";
import WithdrawalEditModal from "./WithdrawalEditModal";
import DeleteWithdrawalDialog from "./DeleteWithdrawalDialog";

export default function WithdrawalTable() {
    const { data = [], isLoading } = useGetAllWithdrawalsAdminQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState<number | "all">(10);
    
    // Modal States
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setOpenEdit] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [selectedWithdrawal, setSelectedWithdrawal] = useState<any | null>(null);

    // FILTER
    let filteredData = data.filter((w: any) => {
        const nameMatch = w.studentId?.name
            ?.toLowerCase()
            .includes(search.toLowerCase());
        const emailMatch = w.studentId?.email
            ?.toLowerCase()
            .includes(search.toLowerCase());
        const upiMatch = w.upiId
            ?.toLowerCase()
            .includes(search.toLowerCase());
        const statusMatch =
            filterStatus === "all" || w.status === filterStatus;
        return (nameMatch || emailMatch || upiMatch) && statusMatch;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [search, filterStatus, itemsPerPage]);

    // PAGINATION
    const effectiveLimit = itemsPerPage === "all" ? filteredData.length : itemsPerPage;
    const startIndex = (currentPage - 1) * effectiveLimit;
    const paginatedData = filteredData.slice(
        startIndex,
        startIndex + effectiveLimit
    );
    const totalPages = itemsPerPage === "all" ? 1 : Math.ceil(filteredData.length / effectiveLimit);


    // STATUS BADGE
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-700";
            case "rejected":
                return "bg-red-100 text-red-700";
            default:
                return "bg-orange-100 text-orange-700";
        }
    };

    // EXPORT CSV
    const handleExport = () => {
        const headers = ["Student", "Email", "Amount", "UPI ID", "Status", "Date"];
        const rows = filteredData.map((w: any) => [
            w.studentId?.name || "N/A",
            w.studentId?.email || "N/A",
            w.amount,
            w.upiId,
            w.status,
            format(new Date(w.createdAt), "dd-MM-yyyy"),
        ]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers, ...rows].map((e) => e.join(",")).join("\n");

        const link = document.createElement("a");
        link.href = encodeURI(csvContent);
        link.download = "withdrawals.csv";
        link.click();
    };

    // STATS
    const totalPending = data.filter((w: any) => w.status === "pending").length;
    const totalApproved = data.filter((w: any) => w.status === "approved").length;
    const totalRejected = data.filter((w: any) => w.status === "rejected").length;
    const totalPendingAmount = data
        .filter((w: any) => w.status === "pending")
        .reduce((sum: number, w: any) => sum + (w.amount || 0), 0);

    return (
        <>
            <div className="space-y-6">
            {/* STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow">
                    <p className="text-gray-500 text-sm">Total Requests</p>
                    <h2 className="text-2xl font-bold text-[#2C4276]">
                        {data.length}
                    </h2>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow">
                    <p className="text-gray-500 text-sm">Pending</p>
                    <h2 className="text-2xl font-bold text-orange-500">
                        {totalPending}
                    </h2>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow">
                    <p className="text-gray-500 text-sm">Approved</p>
                    <h2 className="text-2xl font-bold text-green-600">
                        {totalApproved}
                    </h2>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow">
                    <p className="text-gray-500 text-sm">Pending Amount</p>
                    <h2 className="text-2xl font-bold text-[#2C4276]">
                        ₹{totalPendingAmount.toLocaleString()}
                    </h2>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white p-5 rounded-2xl shadow">
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                    <h2 className="text-lg font-semibold">
                        Withdrawal Requests
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        <select
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="border px-3 py-2 rounded-lg text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        <div className="flex items-center gap-1">
                            <label className="text-sm text-gray-500">Show:</label>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setItemsPerPage(val === "all" ? "all" : Number(val));
                                    setCurrentPage(1);
                                }}
                                className="border px-2 py-2 rounded-lg text-sm"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value="all">All</option>
                            </select>
                        </div>

                        <button
                            onClick={handleExport}
                            className="bg-gray-200 px-3 py-2 rounded-lg text-sm"
                        >
                            Export
                        </button>

                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border px-3 py-2 rounded-lg text-sm"
                        />
                    </div>
                </div>

                {/* TABLE BODY */}
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-separate border-spacing-y-2">
                                <thead className="text-gray-500 text-left">
                                    <tr className="text-xs uppercase">
                                        <th className="px-4 py-2">#</th>
                                        <th className="px-4 py-2">Student</th>
                                        <th className="px-4 py-2">Email</th>
                                        <th className="px-4 py-2">Amount</th>
                                        <th className="px-4 py-2">UPI ID</th>
                                        <th className="px-4 py-2">Date</th>
                                        <th className="px-4 py-2 text-center">
                                            Status
                                        </th>
                                        <th className="px-4 py-2 text-center">
                                            Actions
                                            
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.map(
                                        (w: any, index: number) => (
                                            <tr
                                                key={w._id}
                                                className="bg-white shadow-sm rounded-xl hover:bg-gray-50 transition"
                                            >
                                                <td className="px-4 py-3">
                                                    {startIndex + index + 1}
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-gray-800">
                                                    {w.studentId?.name ||
                                                        "N/A"}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {w.studentId?.email ||
                                                        "N/A"}
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-green-600">
                                                    ₹
                                                    {w.amount?.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                                                    {w.upiId}
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">
                                                    {format(
                                                        new Date(w.createdAt),
                                                        "dd MMM yyyy"
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(w.status)}`}
                                                    >
                                                        {w.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            w.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedWithdrawal(w);
                                                                setViewOpen(true);
                                                            }}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                            title="View Details"
                                                        >
                                                            <Eye size={18} />
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                setSelectedWithdrawal(w);
                                                                setOpenEdit(true);
                                                            }}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                            title="Edit Withdrawal"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>

                                                        <button
                                                            onClick={() => setDeleteId(w._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                            title="Delete Request"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}

                                    {paginatedData.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="text-center py-8 text-gray-400"
                                            >
                                                No withdrawal requests found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        <div className="flex justify-between items-center mt-4">
                            <p className="text-sm text-gray-500">
                                Showing {startIndex + 1} to{" "}
                                {Math.min(
                                    startIndex + effectiveLimit,
                                    filteredData.length
                                )}{" "}
                                of {filteredData.length}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        setCurrentPage((p) => p - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button className="px-3 py-1 bg-[#2C4276] text-white rounded">
                                    {currentPage}
                                </button>
                                <button
                                    onClick={() =>
                                        setCurrentPage((p) => p + 1)
                                    }
                                    disabled={
                                        currentPage === totalPages ||
                                        totalPages === 0
                                    }
                                    className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>

        {/* MODALS */}
        <WithdrawalViewModal
            open={viewOpen}
            setOpen={setViewOpen}
            withdrawal={selectedWithdrawal}
        />

        <WithdrawalEditModal
            open={editOpen}
            setOpen={setOpenEdit}
            withdrawal={selectedWithdrawal}
        />

        <DeleteWithdrawalDialog
            deleteId={deleteId}
            setDeleteId={setDeleteId}
        />
    </>
    );
}
