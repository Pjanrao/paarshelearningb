"use client";

import { useGetReferralStatsQuery } from "@/redux/api/referralApi";


export default function ReferralLinkCard() {
    const { data } = useGetReferralStatsQuery();

    const referralCode = data?.referralCode || "----";
    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/signup?ref=${referralCode}`;

    const copy = () => {
        navigator.clipboard.writeText(link);
        alert("Copied!");
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow space-y-4">

            <h2 className="font-semibold text-lg">Your Referral Details</h2>

            <div>
                <p className="text-sm text-gray-500">Referral Code</p>
                <div className="flex justify-between bg-gray-100 p-3 rounded">
                    <span>{referralCode}</span>
                </div>
            </div>

            <div>
                <p className="text-sm text-gray-500">Referral Link</p>
                <div className="flex justify-between bg-gray-100 p-3 rounded">
                    <span className="truncate">{link}</span>
                    <button onClick={copy} className="text-blue-500 ml-2">Copy</button>
                </div>
            </div>

            <button className="w-full bg-[#2C4276] text-white py-2 rounded-lg hover:bg-blue-600">
                Share Now
            </button>

        </div>
    );
}