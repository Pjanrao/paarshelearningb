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
        if (!navigator.clipboard) {
            // Fallback for non-https / local network testing
            const textArea = document.createElement("textarea");
            textArea.value = link;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                alert("Copied!");
            } catch (err) {
                alert("Failed to copy link, please copy manually.");
            }
            document.body.removeChild(textArea);
        } else {
            navigator.clipboard.writeText(link)
                .then(() => alert("Copied!"))
                .catch(() => alert("Failed to copy using clipboard API"));
        }
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow space-y-4">

            <h2 className="font-semibold text-lg">Your Referral Details</h2>

            <div>
                <p className="text-sm text-gray-500">Referral Code</p>
                <div className="bg-gray-100 p-3 rounded overflow-x-auto whitespace-nowrap">
                    {referralCode}
                </div>
            </div>

            <div>
                <p className="text-sm text-gray-500 mb-1">Referral Link</p>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-100 p-3 rounded gap-3 md:gap-2">
                    <div className="overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-thin">
                        <span className="whitespace-nowrap pr-2">{link}</span>
                    </div>
                    <button onClick={copy} className="bg-blue-100 hover:bg-blue-200 transition text-blue-600 px-4 py-1.5 rounded-lg w-full sm:w-auto shrink-0 font-medium whitespace-nowrap">
                        Copy Link
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