"use client";

import React, { useEffect, useState } from "react";
import { Search, Users, Calendar, Mail, Phone, Eye, Edit, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function WorkshopRegistrationsPage() {
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Pagination State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState<number | "all">(10);

    // Modal States
    const [selectedReg, setSelectedReg] = useState<any>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    // Form Loading State
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/workshops/registrations");
            if (res.ok) {
                const data = await res.json();
                setRegistrations(data);
            }
        } catch (err) {
            console.error("Failed to fetch registrations", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const handleDelete = async () => {
        if (!selectedReg) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/workshops/registrations/${selectedReg._id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setDeleteModalOpen(false);
                fetchRegistrations();
            } else {
                alert("Failed to delete registration");
            }
        } catch (error) {
            console.error("Delete failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedReg) return;
        setIsSubmitting(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const updates = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            currentStatus: formData.get("currentStatus"),
            status: formData.get("status"),
        };

        try {
            const res = await fetch(`/api/workshops/registrations/${selectedReg._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            
            if (res.ok) {
                setEditModalOpen(false);
                fetchRegistrations();
            } else {
                alert("Failed to update registration");
            }
        } catch (error) {
            console.error("Update failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filtered = registrations.filter(r => 
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase()) ||
        r.workshopId?.title.toLowerCase().includes(search.toLowerCase())
    );

    const total = filtered.length;
    const totalPages = limit === "all" ? 1 : Math.ceil(total / limit) || 1;
    const paginated = limit === "all" ? filtered : filtered.slice((page - 1) * limit, page * limit);

    return (
        <div className="bg-gray-50 h-full p-6">
            <div className="mb-6">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#2C4276]">
                            Workshop Registrations
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Monitor and manage students who signed up for workshops
                        </p>
                    </div>
                </div>

                {/* FILTERS */}
                <div className="bg-white rounded-lg shadow-md p-4 mt-6 flex flex-col md:flex-row gap-4 items-center">
                    {/* Search */}
                    <div className="relative w-full max-w-md">
                        <Input
                            placeholder="Search by name, email, or workshop..."
                            value={search}
                            onChange={(e) => {
                                setPage(1);
                                setSearch(e.target.value);
                            }}
                            className="pl-10 bg-gray-50 border rounded-xl"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-lg shadow-md overflow-auto max-h-[calc(100vh-250px)]">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b text-gray-600 uppercase text-xs sticky top-0 z-10">
                        <tr>
                            <th className="p-4 text-left">ID</th>
                            <th className="p-4 text-left">Student Info</th>
                            <th className="p-4 text-left">Workshop</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Date Joined</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="p-6 text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : paginated.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-6 text-center text-gray-400">
                                    No registrations found matching your search.
                                </td>
                            </tr>
                        ) : (
                            paginated.map((reg, index) => (
                                <tr key={reg._id} className="border-t hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        {(page - 1) * (limit === "all" ? total : limit) + index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 leading-none mb-1">{reg.name}</span>
                                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                                <span className="flex items-center gap-1"><Mail size={12} /> {reg.email}</span>
                                                <span className="flex items-center gap-1"><Phone size={12} /> {reg.phone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-[#2C4276]">{reg.workshopId?.title || "Unknown Workshop"}</span>
                                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                <Calendar size={10} /> {reg.workshopId?.date} | {reg.workshopId?.time}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider border 
                                            ${reg.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' 
                                            : reg.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' 
                                            : 'bg-yellow-50 text-yellow-600 border-yellow-100'}`}>
                                            {reg.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500">
                                        {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => { setSelectedReg(reg); setViewModalOpen(true); }} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="View">
                                                <Eye size={18} />
                                            </button>
                                            <button onClick={() => { setSelectedReg(reg); setEditModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => { setSelectedReg(reg); setDeleteModalOpen(true); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="px-6 py-4 mt-4 border bg-white rounded-lg shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Left Side Info */}
                <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-600">
                        Showing {total === 0 ? 0 : (page - 1) * (limit === "all" ? total : limit) + 1} to{" "}
                        {Math.min(page * (limit === "all" ? total : limit), total)} of{" "}
                        {total}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span>Show:</span>
                        <select
                            value={limit}
                            onChange={(e) => {
                                const val = e.target.value;
                                setLimit(val === "all" ? "all" : Number(val));
                                setPage(1);
                            }}
                            className="border px-2 py-1 rounded-lg text-sm bg-white"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value="all">All</option>
                        </select>
                    </div>
                </div>

                {/* Right Side Controls */}
                <div className="flex items-center gap-2">
                    {/* Previous */}
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((prev) => prev - 1)}
                        className={`px-4 py-2 rounded-lg text-sm border transition ${page === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white hover:bg-gray-100"
                            }`}
                    >
                        Previous
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition ${page === p
                                ? "bg-blue-900 text-white shadow-md"
                                : "bg-white border hover:bg-gray-100"
                                }`}
                        >
                            {p}
                        </button>
                    ))}

                    {/* Next */}
                    <button
                        disabled={page === totalPages || totalPages === 0}
                        onClick={() => setPage((prev) => prev + 1)}
                        className={`px-4 py-2 rounded-lg text-sm border transition ${page === totalPages || totalPages === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white hover:bg-gray-100"
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* View Modal */}
            {viewModalOpen && selectedReg && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-xl font-bold text-[#2C4276]">Registration Details</h2>
                            <button onClick={() => setViewModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 text-sm text-gray-600">
                            <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                <span className="font-bold text-gray-800">Workshop:</span>
                                <span className="col-span-2 text-[#01A0E2] font-semibold">{selectedReg.workshopId?.title}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                <span className="font-bold text-gray-800">Name:</span>
                                <span className="col-span-2">{selectedReg.name}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                <span className="font-bold text-gray-800">Email:</span>
                                <span className="col-span-2">{selectedReg.email}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                <span className="font-bold text-gray-800">Phone:</span>
                                <span className="col-span-2">{selectedReg.phone}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                <span className="font-bold text-gray-800">Profession/Status:</span>
                                <span className="col-span-2">{selectedReg.currentStatus}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                <span className="font-bold text-gray-800">Reg. Status:</span>
                                <span className="col-span-2 capitalize">{selectedReg.status}</span>
                            </div>
                            <div className="flex flex-col gap-1 border-b pb-2">
                                <span className="font-bold text-gray-800">Message Provided:</span>
                                <span className="text-gray-500 italic p-3 bg-gray-50 rounded-lg">{selectedReg.message || "No message provided."}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="font-bold text-gray-800">Date Registered:</span>
                                <span className="col-span-2">{new Date(selectedReg.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModalOpen && selectedReg && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-xl font-bold text-[#2C4276]">Edit Registration</h2>
                            <button onClick={() => setEditModalOpen(false)} className="text-gray-400 hover:text-gray-700 disabled:opacity-50" disabled={isSubmitting}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                                    <Input name="name" defaultValue={selectedReg.name} required className="bg-gray-50" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                                        <Input name="email" type="email" defaultValue={selectedReg.email} required className="bg-gray-50" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Phone</label>
                                        <Input name="phone" defaultValue={selectedReg.phone} required className="bg-gray-50" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Current Status</label>
                                        <Input name="currentStatus" defaultValue={selectedReg.currentStatus} className="bg-gray-50" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Registration Status</label>
                                        <select name="status" defaultValue={selectedReg.status} className="w-full h-10 px-3 py-2 rounded-md border border-input bg-gray-50 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50">
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end gap-3">
                                <button type="button" onClick={() => setEditModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition" disabled={isSubmitting}>
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModalOpen && selectedReg && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden text-center">
                        <div className="p-6">
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Registration?</h2>
                            <p className="text-gray-500 text-sm mb-6">
                                Are you sure you want to delete <span className="font-bold text-gray-800">{selectedReg.name}</span>'s registration? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteModalOpen(false)} className="flex-1 px-4 py-2 font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition" disabled={isSubmitting}>
                                    Cancel
                                </button>
                                <button onClick={handleDelete} className="flex-1 px-4 py-2 font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition" disabled={isSubmitting}>
                                    {isSubmitting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
