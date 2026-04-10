"use client";

import { useGetReferralStatsQuery } from "@/redux/api/referralApi";
import { useEffect, useState } from "react";
import { Copy, Share2, MessageCircle } from "lucide-react";

export default function ReferralLinkCard() {
    const { data, isLoading } = useGetReferralStatsQuery();
    const [canShare, setCanShare] = useState(false);
    const [codeCopied, setCodeCopied] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    useEffect(() => {
        if (typeof navigator !== "undefined" && 'share' in navigator && typeof navigator.share === 'function') {
            setCanShare(true);
        }
    }, []);

    if (isLoading) return <p className="text-gray-500 text-sm text-center py-4">Loading...</p>;

    const referralCode = data?.referralCode ?? "----";
    const baseUrl =
        typeof window !== "undefined"
            ? window.location.origin
            : (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000");
    const link = `${baseUrl}/signup?ref=${referralCode}`;
    const message = `Join using my referral link and get rewards 🎁\n${link}`;

    const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
        const fallback = () => {
            const el = document.createElement("textarea");
            el.value = text;
            document.body.appendChild(el);
            el.select();
            try { document.execCommand("copy"); setCopied(true); setTimeout(() => setCopied(false), 2000); }
            catch { alert("Please copy manually."); }
            document.body.removeChild(el);
        };
        if (!navigator.clipboard) { fallback(); return; }
        navigator.clipboard.writeText(text)
            .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
            .catch(fallback);
    };

    const shareNative = async () => {
        if (canShare) {
            try {
                await navigator.share({
                    title: "Join Paarsh E-Learning",
                    text: "Join using my referral link and get rewards 🎁",
                    url: link
                });
                return;
            } catch { /* fall through */ }
        }
        // Fallback: WhatsApp
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    };

    const copyMessage = () => copyToClipboard(message, setLinkCopied);

    return (
        <div className="bg-white rounded-2xl shadow p-6 space-y-5">

            <h2 className="text-xl font-bold text-gray-800">Your Referral Details</h2>

            {/* REFERRAL CODE */}
            <div className="space-y-1">
                <label className="text-sm text-gray-500 font-medium">Your Referral Code</label>
                <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 gap-2">
                    <span className="font-bold text-gray-800 text-sm tracking-widest overflow-x-auto whitespace-nowrap">
                        {referralCode}
                    </span>
                    <button
                        onClick={() => copyToClipboard(referralCode, setCodeCopied)}
                        className="shrink-0 text-blue-500 hover:text-blue-700 transition"
                        title="Copy Code"
                    >
                        {codeCopied
                            ? <span className="text-xs text-green-500 font-medium">Copied!</span>
                            : <Copy size={18} />}
                    </button>
                </div>
            </div>

            {/* REFERRAL LINK */}
            <div className="space-y-1">
                <label className="text-sm text-gray-500 font-medium">Your Referral Link</label>
                <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 gap-2">
                    <div className="overflow-x-auto flex-1 min-w-0">
                        <span className="text-sm text-gray-600 whitespace-nowrap">{link}</span>
                    </div>
                    <button
                        onClick={() => copyToClipboard(link, setLinkCopied)}
                        className="shrink-0 text-blue-500 hover:text-blue-700 transition"
                        title="Copy Link"
                    >
                        {linkCopied
                            ? <span className="text-xs text-green-500 font-medium">Copied!</span>
                            : <Copy size={18} />}
                    </button>
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={shareNative}
                    className="flex items-center justify-center gap-2 bg-[#2C4276] hover:bg-[#1a2849] transition text-white px-5 py-3 rounded-xl font-semibold w-full sm:flex-1"
                >
                    <Share2 size={18} />
                    Share via Social Media
                </button>
                <button
                    onClick={copyMessage}
                    className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 transition text-[#2C4276] border border-blue-200 px-5 py-3 rounded-xl font-semibold w-full sm:flex-1"
                >
                    <MessageCircle size={18} />
                    Copy Message
                </button>
            </div>

        </div>
    );
}