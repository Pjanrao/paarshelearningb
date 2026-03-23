"use client";

import { useState } from "react";
import BatchFormModal from "@/components/dashboard/batches/BatchFormModal";
import BatchViewModal from "@/components/dashboard/batches/BatchViewModal";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import {
    useGetBatchesQuery,
    useDeleteBatchMutation
} from "@/redux/api/batchApi";

export default function Page() {

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [viewData, setViewData] = useState<any>(null);

    // 🔥 FILTER
    const [showFilter, setShowFilter] = useState(false);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const limit = 5;

    // ✅ REDUX DATA
    const { data = [], refetch } = useGetBatchesQuery();
    const [deleteBatchApi] = useDeleteBatchMutation();

    const batches = data || [];

    // ✅ SEARCH
    let filtered = batches.filter((b: any) =>
        b.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.courseId?.name?.toLowerCase().includes(search.toLowerCase())
    );

    // ✅ DATE FILTER
    if (fromDate && toDate) {
        filtered = filtered.filter((b: any) => {
            const start = new Date(b.startDate);
            return start >= new Date(fromDate) && start <= new Date(toDate);
        });
    }

    // ✅ PAGINATION
    const paginated = filtered.slice((page - 1) * limit, page * limit);
    const totalPages = Math.ceil(filtered.length / limit);

    // ✅ DELETE (FIXED)
    const deleteBatch = async (id: string) => {
        if (!confirm("Delete this batch?")) return;
        await deleteBatchApi(id);
        refetch(); // refresh
    };

    // ✅ STATUS
    const getStatusBadge = (status: string) => {
        if (status === "Active") return "bg-green-100 text-green-600";
        if (status === "Upcoming") return "bg-yellow-100 text-yellow-600";
        return "bg-gray-200 text-gray-600";
    };

    // ✅ EXPORT
    const handleExport = () => {
        const csvRows = [["Batch", "Course", "Students", "Start", "End", "Status"]];

        filtered.forEach((b: any) => {
            csvRows.push([
                b.name,
                b.courseId?.name || "",
                b.students?.length || 0,
                new Date(b.startDate).toLocaleDateString(),
                new Date(b.endDate).toLocaleDateString(),
                b.status
            ]);
        });

        const csvContent =
            "data:text/csv;charset=utf-8," +
            csvRows.map(e => e.join(",")).join("\n");

        const link = document.createElement("a");
        link.href = encodeURI(csvContent);
        link.download = "batches.csv";
        link.click();
    };

    return (
        <div className="p-6">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-semibold text-[#2C4276]">
                    Batch Management
                </h1>
                <div className="flex gap-3">

                    <button
                        onClick={() => {
                            console.log("clicked");
                            setEditData(null);
                            setShowModal(true);
                        }}
                        className="bg-[#2C4276] text-white px-5 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Plus size={16} /> Add Batch
                    </button>
                </div>
            </div>

            {/* SEARCH + ACTIONS */}
            <div className="flex justify-between items-center mb-4">

                <input
                    type="text"
                    placeholder="Search batch or course..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-4 py-2 rounded-lg w-[300px]"
                />

                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        className="bg-gray-200 px-4 py-2 rounded-lg"
                    >
                        Export
                    </button>

                    <button
                        onClick={() => setShowFilter(true)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg"
                    >
                        Filter Date
                    </button>
                </div>

            </div>

            {/* 🔥 FILTER POPUP */}
            {showFilter && (
                <div className="fixed inset-0 z-40">

                    <div
                        className="absolute inset-0 bg-black/20"
                        onClick={() => setShowFilter(false)}
                    />

                    <div className="absolute right-6 top-[230px]">
                        <div className="bg-white w-[350px] rounded-xl shadow-xl p-5 relative">

                            <button
                                onClick={() => setShowFilter(false)}
                                className="absolute top-3 right-3 text-gray-400"
                            >
                                ✕
                            </button>

                            <h3 className="font-semibold text-gray-600 mb-4">
                                SELECT RANGE
                            </h3>

                            <label className="text-sm text-gray-500">START DATE</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="border p-2 w-full rounded mt-1 mb-3"
                            />

                            <label className="text-sm text-gray-500">END DATE</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="border p-2 w-full rounded mt-1 mb-4"
                            />

                            <button
                                onClick={() => {
                                    setFromDate("");
                                    setToDate("");
                                }}
                                className="w-full bg-gray-200 py-2 rounded"
                            >
                                Clear All Filters
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">

                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="p-3 text-left">Batch</th>
                            <th className="p-3 text-left">Course</th>
                            <th className="p-3 text-left">Students</th>
                            <th className="p-3 text-left">Start</th>
                            <th className="p-3 text-left">End</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginated.map((b: any) => (
                            <tr key={b._id} className="border-t">

                                <td className="p-3">{b.name}</td>
                                <td className="p-3">{b.courseId?.name}</td>
                                <td className="p-3">{b.students?.length}</td>

                                <td className="p-3">
                                    {new Date(b.startDate).toLocaleDateString()}
                                </td>

                                <td className="p-3">
                                    {new Date(b.endDate).toLocaleDateString()}
                                </td>

                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(b.status)}`}>
                                        {b.status}
                                    </span>
                                </td>

                                <td className="p-3 flex gap-3">

                                    <button onClick={() => setViewData(b)} className="bg-gray-200 p-2 rounded-full">
                                        <Eye size={16} />
                                    </button>

                                    <button
                                        onClick={() => {
                                            setEditData(b);
                                            setShowModal(true);
                                        }}
                                        className="bg-gray-200 p-2 rounded-full"
                                    >
                                        <Pencil size={16} />
                                    </button>

                                    <button
                                        onClick={() => deleteBatch(b._id)}
                                        className="bg-red-100 text-red-600 p-2 rounded-full"
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            {/* PAGINATION */}
            <div className="px-6 py-4 border-t bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4 mt-4">

                {/* LEFT TEXT */}
                <div className="text-sm text-gray-600 font-medium order-2 md:order-1">
                    Showing{" "}
                    <span className="font-bold text-gray-900">
                        {(page - 1) * limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-bold text-gray-900">
                        {Math.min(page * limit, filtered.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-gray-900">
                        {filtered.length}
                    </span>{" "}
                    batches
                </div>

                {/* RIGHT CONTROLS */}
                <div className="flex items-center gap-2 order-1 md:order-2">

                    {/* PREVIOUS */}
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 text-sm font-bold rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm active:scale-95"
                    >
                        Previous
                    </button>

                    {/* PAGE NUMBERS */}
                    <div className="hidden sm:flex items-center gap-1">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {

                            let pageNum;

                            if (totalPages <= 5) pageNum = i + 1;
                            else if (page <= 3) pageNum = i + 1;
                            else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                            else pageNum = page - 2 + i;

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95 ${page === pageNum
                                            ? "bg-[#2C4276] text-white"
                                            : "border bg-white hover:bg-gray-50 text-gray-700"
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    {/* MOBILE VIEW */}
                    <div className="sm:hidden text-sm font-bold px-3 py-2 border rounded-lg bg-white">
                        {page} / {totalPages}
                    </div>

                    {/* NEXT */}
                    <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 text-sm font-bold rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm active:scale-95"
                    >
                        Next
                    </button>

                </div>
            </div>

            {/* MODALS */}
            {showModal && (
                <>
                    {console.log("Modal Opened")} {/* ✅ debug */}
                    <BatchFormModal
                        close={() => setShowModal(false)}
                        refresh={refetch} // ✅ FIXED
                        batch={editData}
                    />
                </>
            )}

            {viewData && (
                <BatchViewModal
                    batch={viewData}
                    close={() => setViewData(null)}
                />
            )}

        </div>
    );
}