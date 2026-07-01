"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Send, Check } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { format } from "date-fns";

export default function ViewConsentFormPage() {
    const params = useParams();
    const [form, setForm] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [emailOrId, setEmailOrId] = useState("");
    const [generatedLink, setGeneratedLink] = useState("");
    const [generating, setGenerating] = useState(false);
    const [studentName, setStudentName] = useState("");

    useEffect(() => {
        if (params.id) fetchForm();
    }, [params.id]);

    const fetchForm = async () => {
        try {
            const res = await axios.get(`/api/admin/consent-forms/${params.id}`);
            if (res.data.success) {
                setForm(res.data.form);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to fetch consent form");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateLink = async () => {
        if (!emailOrId.trim()) {
            return toast.error("Please enter a Student ID or Email");
        }

        setGenerating(true);
        setGeneratedLink("");
        setStudentName("");

        try {
            // Check if input looks like an email or ID
            const isEmail = emailOrId.includes("@");
            const payload = isEmail ? { email: emailOrId } : { userId: emailOrId };

            const res = await axios.post(`/api/admin/consent-forms/${params.id}/share`, payload);

            if (res.data.success) {
                setGeneratedLink(res.data.sharedLink || "shared");
                setStudentName(res.data.studentName);
                toast.success("Consent form shared successfully!");
                setEmailOrId("");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to share consent form");
        } finally {
            setGenerating(false);
        }
    };



    if (loading) {
        return (
            <div className="bg-gray-50 h-full min-h-screen">
                <div className="flex justify-center items-center py-20 min-h-screen">
                    <Loader2 className="animate-spin text-[#2C4276]" size={40} />
                </div>
            </div>
        );
    }

    if (!form) return null;

    return (
        <div className="bg-gray-50 h-full min-h-screen">
            <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/consent-forms"
                        className="bg-white hover:bg-gray-50 border text-gray-700 p-2 rounded-lg transition"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-[#2C4276]">{form.title}</h1>
                        <p className="text-gray-500 mt-1">Created on {format(new Date(form.createdAt), 'MMMM dd, yyyy')}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6 lg:p-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Document Content</h3>
                        <div
                            className="prose max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: form.content }}
                        />
                    </div>

                    <div className="space-y-6">
                        <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-6">
                            <h3 className="text-lg font-bold text-[#2C4276] mb-2 flex items-center gap-2">
                                <Send size={20} />
                                Share with Student
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">Send an email notification to a student with a link to review and accept this consent form in their dashboard.</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Student Email or ID</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. student@example.com"
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#2C4276]"
                                        value={emailOrId}
                                        onChange={(e) => setEmailOrId(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={handleGenerateLink}
                                    disabled={generating || !emailOrId.trim()}
                                    className="w-full bg-[#2C4276] hover:bg-[#1f3159] text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition disabled:opacity-70"
                                >
                                    {generating ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                    Send Email Notification
                                </button>
                            </div>

                            {generatedLink && (
                                <div className="mt-6 pt-6 border-t border-blue-200 space-y-4">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <Check size={18} className="text-green-600" />
                                            <span className="text-sm font-bold text-green-800">Shared Successfully</span>
                                        </div>
                                        <p className="text-xs text-green-600">
                                            Email notification sent to <span className="font-semibold">{studentName}</span>.
                                        </p>
                                    </div>

                                    {generatedLink !== "shared" && (
                                        <div className="bg-white border rounded-lg p-3 space-y-2 shadow-sm">
                                            <span className="block text-xs font-bold text-gray-705 mb-1">Copy Share Link:</span>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    className="w-full bg-gray-50 border rounded px-2.5 py-1.5 text-xs font-mono text-gray-600 outline-none focus:border-[#2C4276]"
                                                    value={generatedLink}
                                                    onClick={(e) => (e.target as HTMLInputElement).select()}
                                                />
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(generatedLink);
                                                        toast.success("Link copied to clipboard!");
                                                    }}
                                                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded text-xs font-semibold shrink-0 transition"
                                                >
                                                    Copy Link
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
