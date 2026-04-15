"use client";

import React, { useEffect, useState } from "react";
import { Search, Users, Calendar, Mail, Phone, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function WorkshopRegistrationsPage() {
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchRegistrations = async () => {
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
        fetchRegistrations();
    }, []);

    const filtered = registrations.filter(r => 
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase()) ||
        r.workshopId?.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-[#2C4276]">Workshop Registrations</h1>
                <p className="text-gray-500 text-sm">Monitor and manage students who signed up for workshops</p>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Total Registrations</p>
                        <p className="text-2xl font-bold text-gray-900">{registrations.length}</p>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <Input 
                        placeholder="Search by name, email, or workshop..." 
                        className="pl-10 h-11 bg-gray-50 border-none rounded-xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Registrations Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Student Info</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Workshop</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date Joined</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex justify-center flex-col items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                                            <span className="text-gray-400 font-medium">Loading registrations...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-400">
                                        No registrations found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((reg) => (
                                    <tr key={reg._id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 leading-none mb-1">{reg.name}</span>
                                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                                    <span className="flex items-center gap-1"><Mail size={12} /> {reg.email}</span>
                                                    <span className="flex items-center gap-1"><Phone size={12} /> {reg.phone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-[#2C4276]">{reg.workshopId?.title || "Unknown Workshop"}</span>
                                                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                    <Calendar size={10} /> {reg.workshopId?.date} | {reg.workshopId?.time}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1 bg-yellow-50 text-yellow-600 text-[10px] font-bold rounded-full uppercase tracking-wider border border-yellow-100">
                                                {reg.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-500">
                                            {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : "N/A"}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="p-2 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                <ExternalLink size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
