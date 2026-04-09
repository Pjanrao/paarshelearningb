"use client";

import { useGetReferralStatsQuery } from "@/redux/api/referralApi";

export default function ReferralStats() {
    const { data } = useGetReferralStatsQuery();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
                <p className="text-gray-500 text-sm font-medium">Friends Referred</p>
                <h2 className="text-3xl font-bold text-[#2C4276] mt-1">
                    {data?.totalReferrals ?? 0}
                </h2>
            </div>

            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
                <p className="text-gray-500 text-sm font-medium">Total Earned</p>
                <h2 className="text-3xl font-bold text-green-600 mt-1">
                    ₹{data?.totalEarned ?? 0}
                </h2>
            </div>

            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
                <p className="text-gray-500 text-sm font-medium">Pending Rewards</p>
                <h2 className="text-3xl font-bold text-orange-500 mt-1">
                    ₹{data?.pending ?? 0}
                </h2>
            </div>

        </div>
    );
}


// "use client";

// import { useGetReferralStatsQuery } from "@/redux/api/referralApi";


// export default function ReferralStats() {
//     const { data } = useGetReferralStatsQuery();

//     return (
//         <div className="grid md:grid-cols-3 gap-4">

//             <div className="bg-white p-5 rounded-xl shadow">
//                 <p className="text-gray-500 text-sm">Friends Referred</p>
//                 <h2 className="text-2xl font-bold text-[#2C4276]">
//                     {data?.totalReferrals || 0}
//                 </h2>
//             </div>

//             <div className="bg-white p-5 rounded-xl shadow">
//                 <p className="text-gray-500 text-sm">Total Earned</p>
//                 <h2 className="text-2xl font-bold text-green-600">
//                     ₹{data?.totalEarned || 0}
//                 </h2>
//             </div>

//             <div className="bg-white p-5 rounded-xl shadow">
//                 <p className="text-gray-500 text-sm">Pending Rewards</p>
//                 <h2 className="text-2xl font-bold text-orange-500">
//                     ₹{data?.pending || 0}
//                 </h2>
//             </div>

//         </div>
//     );
// }