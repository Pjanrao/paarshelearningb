"use client";

import { useGetReferralStatsQuery } from "@/redux/api/referralApi";

export default function ReferralLinkCard() {
    const { data, isLoading } = useGetReferralStatsQuery();

    if (isLoading) return <p>Loading...</p>;

    const referralCode = data?.referralCode ?? "----";

    const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const link = `${baseUrl}/signup?ref=${referralCode}`;

    const copy = () => {
        navigator.clipboard.writeText(link);
        alert("Copied!");
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow space-y-4">

            <h2 className="font-semibold text-lg">Your Referral Details</h2>

            <div>
                <p className="text-sm text-gray-500">Referral Code</p>
                <div className="bg-gray-100 p-3 rounded">
                    {referralCode}
                </div>
            </div>

            <div>
                <p className="text-sm text-gray-500">Referral Link</p>
                <div className="flex justify-between bg-gray-100 p-3 rounded">
                    <span className="truncate">{link}</span>
                    <button onClick={copy} className="text-blue-500 ml-2">
                        Copy
                    </button>
                </div>
            </div>

        </div>
    );
}


// "use client";

// import { useGetReferralStatsQuery } from "@/redux/api/referralApi";

// export default function ReferralLinkCard() {
//     const { data, isLoading } = useGetReferralStatsQuery();

//     if (isLoading) return <p>Loading...</p>;

//     const referralCode = data?.referralCode || "----";

//     const baseUrl =
//         process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

//     const link = `${baseUrl}/signup?ref=${referralCode}`;

//     const copy = () => {
//         navigator.clipboard.writeText(link);
//         alert("Copied!");
//     };

//     return (
//         <div className="bg-white p-5 rounded-xl shadow space-y-4">

//             <h2 className="font-semibold text-lg">Your Referral Details</h2>

//             <div>
//                 <p className="text-sm text-gray-500">Referral Code</p>
//                 <div className="flex justify-between bg-gray-100 p-3 rounded">
//                     <span>{referralCode}</span>
//                 </div>
//             </div>

//             <div>
//                 <p className="text-sm text-gray-500">Referral Link</p>
//                 <div className="flex justify-between bg-gray-100 p-3 rounded">
//                     <span className="truncate">{link}</span>
//                     <button onClick={copy} className="text-blue-500 ml-2">
//                         Copy
//                     </button>
//                 </div>
//             </div>

//         </div>
//     );
// }