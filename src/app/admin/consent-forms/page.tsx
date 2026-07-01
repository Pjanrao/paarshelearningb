"use client";

import React, { useEffect, useState } from "react";
import { Plus, Eye, Search, Mail, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";

export default function ConsentFormsPage() {
    const [forms, setForms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        try {
            const res = await axios.get("/api/admin/consent-forms");
            if (res.data.success) {
                setForms(res.data.forms);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to fetch consent forms");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 h-full min-h-screen">
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#2C4276]">Consent Forms</h1>
                        <p className="text-gray-500 mt-1">Create and manage your consent forms and policies.</p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/admin/consent-forms/responses"
                            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition shadow-sm"
                        >
                            View Responses
                        </Link>
                        <Link
                            href="/admin/consent-forms/create"
                            className="bg-[#2C4276] hover:bg-[#1f3159] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition shadow-md"
                        >
                            <Plus size={20} />
                            Create New
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-[#2C4276]" size={40} />
                    </div>
                ) : forms.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                        <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                            <Mail size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Consent Forms Found</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">You haven't created any consent forms yet. Create your first document to start collecting user consents.</p>
                        <Link
                            href="/admin/consent-forms/create"
                            className="bg-[#2C4276] text-white px-6 py-3 rounded-lg font-medium inline-block"
                        >
                            Create First Form
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Document Title</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Date Created</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {forms.map((form) => (
                                        <tr key={form._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-5">
                                                <div className="font-semibold text-gray-800">{form.title}</div>
                                            </td>
                                            <td className="px-6 py-5 text-gray-600">
                                                {format(new Date(form.createdAt), 'MMM dd, yyyy')}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <Link
                                                    href={`/admin/consent-forms/${form._id}`}
                                                    className="inline-flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition"
                                                    title="View & Share"
                                                >
                                                    <Eye size={20} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
