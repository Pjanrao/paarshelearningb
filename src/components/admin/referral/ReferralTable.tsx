"use client";

import { useGetReferralUsersAdminQuery } from "@/redux/api/referralAdminApi";
import { useState, useEffect } from "react";
import ReferralViewModal from "./ReferralViewModal";
import Pagination from "@/components/Common/Pagination";


export default function ReferralTable() {
    const { data = [], isLoading } = useGetReferralUsersAdminQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [itemsPerPage, setItemsPerPage] = useState<number | "all">(10);

    const [sortType, setSortType] = useState("none"); // name | amount

    // 🔍 SEARCH
    let filteredData = data.filter((user: any) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    // 📊 SORTING
    if (sortType === "name") {
        filteredData = [...filteredData].sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    if (sortType === "amount") {
        filteredData = [...filteredData].sort(
            (a, b) => b.totalAmount - a.totalAmount
        );
    }

    // 🔄 RESET PAGE
    useEffect(() => {
        setCurrentPage(1);
    }, [search, sortType, itemsPerPage]);

    // 📄 PAGINATION
    const effectiveLimit = itemsPerPage === "all" ? filteredData.length : itemsPerPage;
    const startIndex = (currentPage - 1) * effectiveLimit;
    const paginatedData = filteredData.slice(
        startIndex,
        startIndex + effectiveLimit
    );

    const totalPages = itemsPerPage === "all" ? 1 : Math.ceil(filteredData.length / effectiveLimit);

    // 📥 EXPORT CSV
    const handleExport = () => {
        const headers = ["Name", "Email", "Mobile", "Amount"];
        const rows = filteredData.map((u: any) => [
            u.name,
            u.email,
            u.contact,
            u.totalAmount,
        ]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers, ...rows].map((e) => e.join(",")).join("\n");

        const link = document.createElement("a");
        link.href = encodeURI(csvContent);
        link.download = "referrals.csv";
        link.click();
    };

    return (
        <div className="bg-white p-5 rounded-2xl shadow">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">

                <h2 className="text-lg font-semibold">Referral Users</h2>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto">

                    {/* SORT */}
                    <select
                        onChange={(e) => setSortType(e.target.value)}
                        className="border px-3 py-2 rounded-lg text-sm flex-1 sm:flex-none"
                    >
                        <option value="none">Sort</option>
                        <option value="name">Name</option>
                        <option value="amount">Amount</option>
                    </select>


                    {/* EXPORT */}
                    <button
                        onClick={handleExport}
                        className="bg-gray-200 px-3 py-2 rounded-lg text-sm flex-1 sm:flex-none"
                    >
                        Export
                    </button>

                    {/* SEARCH */}
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-3 py-2 rounded-lg text-sm w-full sm:w-auto"
                    />

                </div>
            </div>

            {/* LOADING */}
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-separate border-spacing-y-2 min-w-[1000px]">

                            {/* HEADER */}
                            <thead className="text-gray-500 text-left">
                                <tr className="text-xs uppercase">
                                    <th className="px-4 py-2">#</th>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Email</th>
                                    <th className="px-4 py-2">Mobile</th>
                                    <th className="px-4 py-2">Referral Code</th>
                                    <th className="px-4 py-2 text-center">Completed Referrals</th>
                                    <th className="px-4 py-2 text-center">Pending Referrals</th>
                                    <th className="px-4 py-2 text-center">Total Referral Amount</th>
                                    <th className="px-4 py-2 text-center">Actions</th>
                                </tr>
                            </thead>

                            {/* BODY */}
                            <tbody>
                                {paginatedData.map((user: any, index: number) => (
                                    <tr
                                        key={user._id}
                                        className="bg-white shadow-sm rounded-xl hover:bg-gray-50 transition"
                                    >

                                        {/* INDEX */}
                                        <td className="px-4 py-3">
                                            {startIndex + index + 1}
                                        </td>

                                        {/* NAME */}
                                        <td className="px-4 py-3 font-semibold text-gray-800">
                                            {user.name}
                                        </td>

                                        {/* EMAIL */}
                                        <td className="px-4 py-3 text-gray-600">
                                            {user.email}
                                        </td>

                                        {/* MOBILE */}
                                        <td className="px-4 py-3 text-gray-600">
                                            {user.contact}
                                        </td>

                                        {/* CODE */}
                                        <td className="px-4 py-3 text-blue-600 font-medium cursor-pointer">
                                            {user.referralCode}
                                        </td>

                                        {/* COMPLETED */}
                                        <td className="px-4 py-3 text-center font-medium">
                                            {user.completed}
                                        </td>

                                        {/* PENDING */}
                                        <td className="px-4 py-3 text-center font-medium text-orange-500">
                                            {user.pending}
                                        </td>

                                        {/* AMOUNT */}
                                        <td className="px-4 py-3 text-center font-semibold text-green-600">
                                            ₹{user.totalAmount}
                                        </td>

                                        {/* ACTION */}
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2 whitespace-nowrap min-w-[120px]">
                                                <button
                                                    onClick={() => setSelectedUser(user._id)}
                                                    className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-full transition"
                                                    title="View Referral"
                                                >
                                                    👁
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>

                    {/* PAGINATION */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredData.length}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={(val) => {
                            setItemsPerPage(val);
                            setCurrentPage(1);
                        }}
                        itemName="referrals"
                    />
                </>
            )}

            {/* 👁 VIEW MODAL */}
            {/* {selectedUser && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

                    <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg">

                        <h2 className="text-lg font-semibold mb-4">
                            Referral Details
                        </h2>

                        <p><b>Name:</b> {selectedUser.name}</p>
                        <p><b>Email:</b> {selectedUser.email}</p>
                        <p><b>Mobile:</b> {selectedUser.contact}</p>
                        <p><b>Code:</b> {selectedUser.referralCode}</p>
                        <p><b>Total Earned:</b> ₹{selectedUser.totalAmount}</p>

                        <button
                            onClick={() => setSelectedUser(null)}
                            className="mt-4 bg-[#2C4276] text-white px-4 py-2 rounded"
                        >
                            Close
                        </button>

                    </div>

                </div>
            )} */}
            {selectedUser && (
                <ReferralViewModal
                    userId={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </div>
    );
}