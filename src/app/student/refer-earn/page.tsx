"use client";

// @ts-ignore
import ReferralBanner from "@/components/referral/ReferralBanner";
import ReferralStats from "@/components/referral/ReferralStats";
import ReferralLinkCard from "@/components/referral/ReferralLinkCard";
import ReferralList from "@/components/referral/ReferralList";
import HowItWorks from "@/components/referral/HowItWorks";
import RewardsSection from "@/components/referral/RewardsSection";


export default function ReferEarnPage() {
    return (
        <div className="p-4 sm:p-6 space-y-6">

            {/* HERO BANNER */}
            <ReferralBanner />

            {/* STATS */}
            <ReferralStats />

            {/* HOW IT WORKS + REFERRAL DETAILS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <HowItWorks />
                <ReferralLinkCard />
            </div>

            {/* YOUR REFERRALS TABLE */}
            <ReferralList />

            {/* REWARDS CARDS */}
            <RewardsSection />

        </div>
    );
}