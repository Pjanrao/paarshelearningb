"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Pencil, Trash2 } from "lucide-react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import WorkshopFormModal from "./WorkshopFormModal";

interface Workshop {
    _id?: string;
    title: string;
    instructorName: string;
    date: string;
    time: string;
    duration: string;
    price: number;
    mode: "online" | "offline";
    location?: string;
    meetingLink?: string;
    description: string;
    status: "active" | "inactive";
}

export default function WorkshopManagement() {

    const [workshops, setWorkshops] = useState<Workshop[]>([]);

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [mode, setMode] = useState("");
    const [status, setStatus] = useState("");

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Workshop | null>(null);

    const limit = 5;

    // 🔥 FETCH DATA
    const fetchWorkshops = async () => {
        const res = await fetch("/api/workshops");
        const data: Workshop[] = await res.json();

        let filtered: Workshop[] = data;

        if (search) {
            filtered = filtered.filter((w) =>
                w.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (mode) {
            filtered = filtered.filter((w) => w.mode === mode);
        }

        if (status) {
            filtered = filtered.filter((w) => w.status === status);
        }

        setWorkshops(filtered);
    };

    useEffect(() => {
        fetchWorkshops();
    }, [search, mode, status]);

    const totalPages = Math.ceil(workshops.length / limit);
    const paginatedData = workshops.slice(
        (page - 1) * limit,
        page * limit
    );

    const handleClose = () => {
        setEditing(null);
        setOpen(false);
        fetchWorkshops();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this workshop?")) return;
        try {
            const res = await fetch(`/api/workshops?id=${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchWorkshops();
            } else {
                alert("Failed to delete workshop");
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    return (
        <div className="bg-gray-50 h-full p-4">

            {/* HEADER */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[#2C4276]">
                        Workshop Management
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Manage all workshops
                    </p>
                </div>

                <Button
                    onClick={() => {
                        setEditing(null);
                        setOpen(true);
                    }}
                    className="bg-[#2C4276] hover:bg-[#1f3159] text-white"
                >
                    + Add Workshop
                </Button>
            </div>

            {/* FILTERS */}
            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4 items-center mb-4">

                {/* SEARCH */}
                <div className="relative w-full max-w-md">
                    <Input
                        placeholder="Search workshops..."
                        value={search}
                        onChange={(e) => {
                            setPage(1);
                            setSearch(e.target.value);
                        }}
                        className="pl-10 bg-gray-50 border rounded-xl"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>

                {/* MODE FILTER */}
                <Select
                    value={mode}
                    onValueChange={(val) => {
                        setPage(1);
                        setMode(val === "all" ? "" : val);
                    }}
                >
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Mode" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                </Select>

                {/* STATUS FILTER */}
                <Select
                    value={status}
                    onValueChange={(val) => {
                        setPage(1);
                        setStatus(val === "all" ? "" : val);
                    }}
                >
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>

            </div>

            {/* TABLE */}
            <div className="bg-white rounded-lg shadow-md overflow-auto">

                <table className="w-full text-sm">

                    <thead className="bg-gray-50 border-b text-gray-600 uppercase text-xs sticky top-0">
                        <tr>
                            <th className="p-4 text-left">#</th>
                            <th className="p-4 text-left">Workshop</th>
                            <th className="p-4 text-left">Instructor</th>
                            <th className="p-4 text-left">Date</th>
                            <th className="p-4 text-left">Price</th>
                            <th className="p-4 text-left">Mode</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedData.map((w, index) => (
                            <tr key={w._id} className="border-t hover:bg-gray-50 transition">

                                <td className="p-4">
                                    {(page - 1) * limit + index + 1}
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">

                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2C4276] to-blue-500 flex items-center justify-center text-white font-bold">
                                            {w.title?.charAt(0)}
                                        </div>

                                        <div>
                                            <p className="font-bold text-gray-900">
                                                {w.title}
                                            </p>
                                            <p className="text-[11px] text-gray-500 truncate w-48">
                                                {w.description}
                                            </p>
                                        </div>

                                    </div>
                                </td>

                                <td className="p-4">{w.instructorName}</td>
                                <td className="p-4">{w.date}</td>
                                <td className="p-4 font-semibold">₹ {w.price}</td>

                                <td className="p-4">
                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs">
                                        {w.mode}
                                    </span>
                                </td>

                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border
                    ${w.status === "active"
                                            ? "bg-green-50 text-green-600 border-green-100"
                                            : "bg-red-50 text-red-600 border-red-100"
                                        }`}>
                                        {w.status}
                                    </span>
                                </td>

                                <td className="p-4">
                                    <div className="flex gap-1">

                                        <button
                                            onClick={() => {
                                                setEditing(w);
                                                setOpen(true);
                                            }}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <Pencil size={18} />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(w._id!)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            {/* PAGINATION */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center mt-2">

                <p className="text-sm text-gray-600">
                    Showing {(page - 1) * limit + 1} to{" "}
                    {Math.min(page * limit, workshops.length)} of{" "}
                    {workshops.length}
                </p>

                <div className="flex gap-2">

                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-4 py-2 border rounded-lg text-sm"
                    >
                        Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-10 h-10 rounded-lg ${page === p
                                ? "bg-blue-900 text-white"
                                : "bg-white border"
                                }`}
                        >
                            {p}
                        </button>
                    ))}

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-4 py-2 border rounded-lg text-sm"
                    >
                        Next
                    </button>

                </div>
            </div>

            {/* MODAL */}
            <WorkshopFormModal
                open={open}
                setOpen={setOpen}
                editing={editing}
                onClose={handleClose}
            />

        </div>
    );
}