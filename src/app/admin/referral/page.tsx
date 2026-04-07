"use client";

import ReferralSettings from "@/components/admin/referral/ReferralSettings";
import ReferralStats from "@/components/admin/referral/ReferralStats";
import ReferralTable from "@/components/admin/referral/ReferralTable";

export default function ReferralAdminPage() {
    return (
        <div className="p-6 space-y-6">

            <ReferralSettings />

            <ReferralStats />

            <ReferralTable />

        </div>
    );
}