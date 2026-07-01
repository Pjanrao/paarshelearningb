"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Search, CheckCircle, Download, X } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";

export default function ConsentResponsesPage() {
    const [responses, setResponses] = useState<any[]>([]);
    const [filteredResponses, setFilteredResponses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

    useEffect(() => {
        fetchResponses();
    }, []);

    const fetchResponses = async () => {
        try {
            const res = await axios.get("/api/admin/consent-forms/responses");
            if (res.data.success) {
                setResponses(res.data.responses);
                setFilteredResponses(res.data.responses);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to fetch consent responses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredResponses(responses);
            return;
        }

        const q = searchQuery.toLowerCase();
        const filtered = responses.filter(r =>
            r.studentName?.toLowerCase().includes(q) ||
            r.studentEmail?.toLowerCase().includes(q) ||
            r.formTitle?.toLowerCase().includes(q)
        );
        setFilteredResponses(filtered);
    }, [searchQuery, responses]);

    const handleExportCsv = () => {
        if (filteredResponses.length === 0) {
            toast.error("No data to export");
            return;
        }

        const headers = ["Student Name", "Email", "Contact", "Total Forms Accepted", "Latest Accepted Date"];
        const rows = filteredResponses.map(r => [
            r.studentName || "N/A",
            r.studentEmail || "N/A",
            r.studentContact || "N/A",
            r.acceptedForms?.length?.toString() || "0",
            r.latestAcceptedAt ? format(new Date(r.latestAcceptedAt), 'MMM dd, yyyy HH:mm') : "N/A"
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.map(cell => `"${cell}"`).join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "consent_responses.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-gray-50 h-full min-h-screen">
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/consent-forms" className="p-2 bg-white rounded-xl shadow-sm border text-gray-500 hover:text-[#2C4276] transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-[#2C4276]">Consent Track Record</h1>
                            <p className="text-gray-500 mt-1">View users who have accepted the consent forms.</p>
                        </div>
                    </div>

                    <button
                        onClick={handleExportCsv}
                        className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-gray-50 transition shadow-sm"
                    >
                        <Download size={18} />
                        Export CSV
                    </button>
                </div>

                {/* Toolbar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by student name, email, or form..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] transition-all"
                        />
                    </div>
                    <div className="text-sm font-medium text-gray-500 bg-gray-50 px-4 py-2 rounded-lg border">
                        Total Responses: <span className="text-[#2C4276] font-bold">{filteredResponses.length}</span>
                    </div>
                </div>

                {/* Main Content */}
                {loading ? (
                    <div className="flex justify-center items-center py-20 bg-white rounded-xl shadow-sm border">
                        <Loader2 className="animate-spin text-[#2C4276]" size={40} />
                    </div>
                ) : filteredResponses.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                        <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Responses Found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            {searchQuery ? "No responses match your current search query." : "Nobody has accepted any consent forms yet."}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Student Info</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Forms Accepted</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Latest Acceptance</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y relative">
                                    {filteredResponses.map((response) => (
                                        <tr key={response._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                        {(response.studentName || "U").charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-800">{response.studentName}</div>
                                                        <div className="text-xs text-gray-500">{response.studentEmail}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-800 bg-gray-100 inline-flex items-center justify-center min-w-8 h-8 rounded-full text-sm border shadow-sm">
                                                    {response.acceptedForms?.length || 0}
                                                </div>
                                                <div className="mt-2">
                                                    <button
                                                        onClick={() => setSelectedStudent(response)}
                                                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-semibold flex items-center gap-1 transition"
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 font-medium">
                                                {format(new Date(response.latestAcceptedAt), 'MMM dd, yyyy')}
                                                <div className="text-xs text-gray-400 mt-1 whitespace-nowrap">
                                                    {format(new Date(response.latestAcceptedAt), 'hh:mm a')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-bold w-max">
                                                    <CheckCircle size={14} /> Accepted
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Student Details Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 flex flex-col space-y-4 relative animate-in fade-in zoom-in duration-200 max-h-[90vh]">
                        <button
                            onClick={() => setSelectedStudent(null)}
                            className="absolute right-4 top-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                        >
                            <X size={20} />
                        </button>

                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Accepted Consent Forms</h3>
                            <p className="text-xs text-gray-500 mt-1">Student: <span className="font-semibold text-gray-700">{selectedStudent.studentName}</span> • {selectedStudent.studentEmail}</p>
                        </div>

                        <div className="overflow-y-auto space-y-4 pr-1 py-1 custom-scrollbar">
                            {(selectedStudent.acceptedForms || []).map((form: any) => (
                                <div key={form.formId} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                                    <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                                        <div className="font-semibold text-gray-800 text-sm">{form.formTitle}</div>
                                        <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md border">{format(new Date(form.acceptedAt), 'MMM dd, yyyy • hh:mm a')}</div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Digital Signature</h4>
                                        {form.signature ? (
                                            <div className="border border-dashed border-gray-200 bg-gray-50/50 rounded-lg p-4 flex items-center justify-center min-h-[120px]">
                                                <img
                                                    src={form.signature}
                                                    alt={`Signature for ${form.formTitle}`}
                                                    className="max-h-24 object-contain select-none pointer-events-none"
                                                />
                                            </div>
                                        ) : (
                                            <div className="text-sm text-gray-400 italic bg-gray-50 p-4 rounded-lg text-center border border-dashed">
                                                No signature provided for this document.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end pt-2 border-t mt-4">
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-lg text-sm transition"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
