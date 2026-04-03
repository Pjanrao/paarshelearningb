"use client";

import ReferralStats from "@/components/referral/ReferralStats";
import ReferralLinkCard from "@/components/referral/ReferralLinkCard";
import ReferralList from "@/components/referral/ReferralList";
import HowItWorks from "@/components/referral/HowItWorks";
import RewardsSection from "@/components/referral/RewardsSection";

export default function ReferEarnPage() {
    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-[#2C4276] to-blue-500 text-white p-6 rounded-2xl shadow">
                <h1 className="text-2xl font-bold">Refer Friends, Earn Rewards 🎁</h1>
                <p className="text-sm mt-2 opacity-90">
                    Invite your friends and earn cashback when they purchase a course.
                </p>
            </div>

            {/* STATS */}
            <ReferralStats />

            {/* MAIN SECTION */}
            <div className="grid md:grid-cols-2 gap-6">
                <HowItWorks />
                <ReferralLinkCard />
            </div>

            {/* REFERRAL LIST */}
            <ReferralList />

            <RewardsSection />
        </div>
    );
}