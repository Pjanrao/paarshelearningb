"use client";

import React, { useEffect, useState } from "react";
import { Loader2, FileText, ChevronRight, CheckCircle, ShieldAlert, AlertTriangle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";
import SignatureCanvas from "@/components/SignatureCanvas";

export default function MyConsentPage() {
    const [pendingForms, setPendingForms] = useState<any[]>([]);
    const [acceptedForms, setAcceptedForms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedForm, setSelectedForm] = useState<any>(null);
    const [acceptingId, setAcceptingId] = useState<string | null>(null);
    const [signatures, setSignatures] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        try {
            const res = await axios.get("/api/student/consent-forms");
            if (res.data.success) {
                setPendingForms(res.data.pendingForms || []);
                setAcceptedForms(res.data.acceptedForms || []);
            }
        } catch (error: any) {
            toast.error("Failed to fetch your consent forms");
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (formId: string) => {
        const signature = signatures[formId];
        if (!signature) {
            return toast.error("Please provide a digital signature before accepting.");
        }

        setAcceptingId(formId);
        try {
            const res = await axios.post("/api/student/consent-forms/accept", { formId, signature });
            if (res.data.success) {
                toast.success("Consent form accepted successfully!");
                // Clear state signature
                setSignatures(prev => {
                    const next = { ...prev };
                    delete next[formId];
                    return next;
                });
                // Refresh the data
                await fetchForms();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to accept consent form");
        } finally {
            setAcceptingId(null);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-50 h-full min-h-screen">
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin text-[#2C4276]" size={40} />
                </div>
            </div>
        );
    }

    const hasPending = pendingForms.length > 0;
    const hasAccepted = acceptedForms.length > 0;
    const isEmpty = !hasPending && !hasAccepted;

    return (
        <div className="bg-gray-50 h-full min-h-screen">
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#2C4276]">My Consent Documents</h1>
                    <p className="text-gray-500 mt-1">Review and accept consent forms, or view previously accepted documents.</p>
                </div>

                {isEmpty && (
                    <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                        <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">No Documents Yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            You have no consent forms at this time. When an administrator shares a document with you, it will appear here for your review and acceptance.
                        </p>
                    </div>
                )}

                {/* ── Pending Consent Forms ── */}
                {hasPending && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                            <h2 className="text-lg font-bold text-gray-800">Pending Consent Forms</h2>
                            <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                {pendingForms.length} pending
                            </span>
                        </div>

                        {pendingForms.map((form) => (
                            <div
                                key={form.id}
                                className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden"
                            >
                                {/* Form Header */}
                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                            <ShieldAlert size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg">{form.title}</h3>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Shared with you on {format(new Date(form.sharedAt), 'MMMM dd, yyyy')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-100 w-fit px-3 py-1.5 rounded-lg">
                                        <AlertTriangle size={14} />
                                        <span>Action Required</span>
                                    </div>
                                </div>

                                {/* Form Content */}
                                <div className="px-6 py-6 lg:px-8 space-y-6">
                                    <div
                                        className="prose max-w-none text-gray-700 leading-relaxed max-h-[300px] overflow-y-auto pr-2 border-b pb-6"
                                        dangerouslySetInnerHTML={{ __html: form.content }}
                                    />
                                    <div className="max-w-md">
                                        <SignatureCanvas
                                            onChange={(sig) => setSignatures(prev => ({ ...prev, [form.id]: sig }))}
                                        />
                                    </div>
                                </div>

                                {/* Accept Footer */}
                                <div className="bg-gray-50 border-t px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <p className="text-sm text-gray-500 text-center sm:text-left">
                                        By clicking Accept, you acknowledge that you have read, understood, and agreed to the contents of this document.
                                    </p>
                                    <button
                                        onClick={() => handleAccept(form.id)}
                                        disabled={acceptingId === form.id || !signatures[form.id]}
                                        className="w-full sm:w-auto bg-[#2C4276] hover:bg-[#1f3159] text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2.5 transition shadow-lg shadow-blue-900/15 disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
                                    >
                                        {acceptingId === form.id ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <CheckCircle size={20} />
                                        )}
                                        {acceptingId === form.id ? "Processing..." : "Accept"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Accepted Consent Forms ── */}
                {hasAccepted && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <h2 className="text-lg font-bold text-gray-800">Accepted Documents</h2>
                            <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                {acceptedForms.length} accepted
                            </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* List of Forms */}
                            <div className="lg:col-span-1 space-y-3">
                                {acceptedForms.map((form) => (
                                    <button
                                        key={form.id}
                                        onClick={() => setSelectedForm(form)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all ${selectedForm?.id === form.id
                                            ? "border-[#2C4276] bg-blue-50/50 shadow-sm"
                                            : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-gray-800 break-words line-clamp-2 pr-2">{form.title}</h3>
                                            {selectedForm?.id === form.id && <ChevronRight size={18} className="text-[#2C4276] shrink-0" />}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 w-fit px-2 py-1 rounded">
                                            <CheckCircle size={14} />
                                            <span>Accepted: {format(new Date(form.acceptedAt), 'MMM dd, yyyy')}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Document Content View */}
                            <div className="lg:col-span-2">
                                {selectedForm ? (
                                    <div className="bg-white rounded-xl shadow-sm border p-6 lg:p-8">
                                        <div className="mb-6 border-b pb-6">
                                            <h2 className="text-xl font-bold text-[#2C4276] mb-2">{selectedForm.title}</h2>
                                            <p className="text-sm text-gray-600">
                                                You officially accepted this document on <span className="font-semibold">{format(new Date(selectedForm.acceptedAt), 'MMMM dd, yyyy')}</span>.
                                            </p>
                                        </div>
                                        <div
                                            className="prose max-w-none text-gray-800"
                                            dangerouslySetInnerHTML={{ __html: selectedForm.content }}
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 h-full min-h-[300px] flex flex-col items-center justify-center p-6 text-center">
                                        <FileText size={48} className="text-gray-300 mb-4" />
                                        <p className="text-gray-500 font-medium">Select a document from the left to view its contents.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
