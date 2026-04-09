"use client";

import { Gift, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetReferralStatsQuery } from "@/redux/api/referralApi";

export default function ReferralBanner() {
    const { data } = useGetReferralStatsQuery();
    const [canShare, setCanShare] = useState(false);

    useEffect(() => {
        if (typeof navigator !== "undefined" && 'share' in navigator && typeof navigator.share === 'function') {
            setCanShare(true);
        }
    }, []);

    const referralCode = data?.referralCode ?? "";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const link = referralCode ? `${baseUrl}/signup?ref=${referralCode}` : baseUrl;

    const handleShare = async () => {
        const message = `Join using my referral link and get rewards 🎁\n${link}`;
        if (canShare) {
            try {
                await navigator.share({
                    title: "Join Paarsh E-Learning",
                    text: "Join using my referral link and get rewards 🎁",
                    url: link,
                });
                return;
            } catch { /* fall through to WhatsApp */ }
        }
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    };

    return (
        <div className="bg-gradient-to-br from-[#2C4276] to-blue-500 text-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

            {/* LEFT: TEXT */}
            <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-xl shrink-0">
                    <Gift size={28} className="text-white" />
                </div>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold leading-snug">
                        Refer Friends, Earn Rewards!
                    </h1>
                    <p className="text-sm sm:text-base mt-1 opacity-85 max-w-md">
                        Share the gift of learning and be rewarded! Invite your friends to PaarshEdu
                        and both of you will receive exclusive benefits.
                    </p>
                </div>
            </div>

            {/* RIGHT: SHARE BUTTON */}
            <button
                onClick={handleShare}
                className="flex items-center gap-2 bg-white text-[#2C4276] font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition shadow-md whitespace-nowrap w-full sm:w-auto justify-center shrink-0"
            >
                <Share2 size={18} />
                Share Now
            </button>

        </div>
    );
}
