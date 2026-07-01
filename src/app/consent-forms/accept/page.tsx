"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, ShieldCheck, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import SignatureCanvas from "@/components/SignatureCanvas";

export default function PublicConsentAcceptPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [loading, setLoading] = useState(true);
    const [verifyingToken, setVerifyingToken] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [signature, setSignature] = useState("");

    const [consentForm, setConsentForm] = useState<any>(null);
    const [student, setStudent] = useState<any>(null);
    const [alreadyAccepted, setAlreadyAccepted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Access token is missing. Please make sure you are using the correct link shared with you.");
            setVerifyingToken(false);
            setLoading(false);
            return;
        }

        verifyTokenAndFetchDetails();
    }, [token]);

    const verifyTokenAndFetchDetails = async () => {
        try {
            const res = await axios.get(`/api/consent-forms/accept?token=${token}`);
            if (res.data.success) {
                setConsentForm(res.data.form);
                setStudent(res.data.student);
                setAlreadyAccepted(res.data.alreadyAccepted);
                if (res.data.alreadyAccepted) {
                    toast.info("You have already accepted this consent form!");
                }
            } else {
                setError(res.data.error || "Invalid shared link");
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Invalid or expired share link. Please contact the administrator.");
        } finally {
            setVerifyingToken(false);
            setLoading(false);
        }
    };

    const handleAcceptSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        if (!signature) {
            return toast.error("Please draw your signature to accept the document.");
        }

        setSubmitting(true);
        try {
            const res = await axios.post("/api/consent-forms/accept", {
                token,
                signature
            });

            if (res.data.success) {
                setIsSuccess(true);
                toast.success("Document accepted successfully!");
            } else {
                toast.error(res.data.error || "Failed to accept the document");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Error signing document");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl border shadow-xl flex flex-col items-center justify-center space-y-4 max-w-sm w-full">
                    <Loader2 className="animate-spin text-[#2C4276]" size={40} />
                    <p className="text-gray-500 font-medium animate-pulse text-sm">Verifying secure key...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-xl max-w-md w-full text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                        <AlertCircle size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Verification Failed</h3>
                        <p className="text-gray-500 text-sm mt-2">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isSuccess || alreadyAccepted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl border border-green-100 shadow-xl max-w-md w-full text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">
                            {alreadyAccepted ? "Already Accepted" : "Acceptance Confirmed"}
                        </h3>
                        <p className="text-gray-500 text-sm mt-2">
                            Hi <span className="font-semibold">{student?.name}</span>, you have successfully acknowledged and accepted the document:
                        </p>
                        <div className="mt-3 bg-gray-50 border p-3 rounded-lg font-semibold text-gray-700 text-sm">
                            {consentForm?.title}
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">
                        This verification has been sealed. You may close this tab or return to your student dashboard.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header card */}
                <div className="bg-[#2C4276] text-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                            <ShieldCheck size={28} className="text-blue-300" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold">Secure Acceptance Portal</h1>
                            <p className="text-blue-200 text-xs md:text-sm mt-0.5">Please review the shared document and provide your signature.</p>
                        </div>
                    </div>

                    <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 text-xs w-max shrink-0">
                        <span className="font-semibold text-blue-200">Reviewing as:</span> {student?.name}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Document container */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border p-6 md:p-8 flex flex-col space-y-6">
                        <div className="border-b pb-4 flex items-center gap-2">
                            <FileText size={20} className="text-gray-400" />
                            <h2 className="text-lg font-bold text-gray-800">{consentForm?.title}</h2>
                        </div>
                        <div
                            className="prose max-w-none text-gray-700 leading-relaxed text-sm max-h-[500px] overflow-y-auto pr-2"
                            dangerouslySetInnerHTML={{ __html: consentForm?.content }}
                        />
                    </div>

                    {/* Signature drawer box */}
                    <div className="bg-white rounded-2xl shadow-md border p-6 h-fit space-y-6">
                        <div>
                            <h3 className="text-base font-bold text-gray-800 border-b pb-3">Agreement Acknowledgment</h3>
                            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                                Review the terms carefully. Use the box below to sign with your mouse, trackpad, or finger.
                            </p>
                        </div>

                        <form onSubmit={handleAcceptSubmit} className="space-y-6">
                            <SignatureCanvas onChange={(sig) => setSignature(sig)} />

                            <div className="space-y-3">
                                <button
                                    type="submit"
                                    disabled={submitting || !signature}
                                    className="w-full bg-[#2C4276] hover:bg-[#1f3159] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    {submitting ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <CheckCircle2 size={18} />
                                    )}
                                    Accept & Sign Document
                                </button>

                                <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                                    By signing, you execute a binding signature acknowledging the document content.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
