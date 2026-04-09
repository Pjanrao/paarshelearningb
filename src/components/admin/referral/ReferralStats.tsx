"use client";

import { useGetReferralStatsAdminQuery } from "@/redux/api/referralAdminApi";

export default function ReferralStats() {
    const { data, isLoading } = useGetReferralStatsAdminQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    return (
        <div className="bg-white p-5 rounded-2xl shadow">

            <h2 className="text-xl font-semibold mb-4 text-[#2C4276]">
                Referral Overview
            </h2>

            {isLoading ? (
                <p className="text-gray-500">Loading...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-sm text-gray-500">Total Referrals</p>
                        <h3 className="text-2xl font-bold">
                            {data?.totalReferrals || 0}
                        </h3>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-sm text-gray-500">Completed Referrals</p>
                        <h3 className="text-2xl font-bold">
                            {data?.completed || 0}
                        </h3>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <h3 className="text-2xl font-bold text-green-600">
                            ₹{data?.totalAmount || 0}
                        </h3>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-sm text-gray-500">Pending Referrals</p>
                        <h3 className="text-2xl font-bold text-orange-500">
                            {data?.pending || 0}
                        </h3>
                    </div>

                </div>
            )}

        </div>
    );
}


// "use client";

// import { useGetReferralStatsQuery } from "@/redux/api/referralApi";


// export default function ReferralStats() {
//     const { data, isLoading } = useGetReferralStatsQuery();

//     return (
//         <div className="bg-white p-5 rounded-2xl shadow">

//             <h2 className="text-xl font-semibold mb-4 text-[#2C4276]">
//                 Referral Overview
//             </h2>

//             {/* Loading State */}
//             {isLoading ? (
//                 <p className="text-gray-500">Loading...</p>
//             ) : (
//                 <div className="grid md:grid-cols-4 gap-4">

//                     <div className="p-4 rounded-xl bg-gray-50">
//                         <p className="text-sm text-gray-500">Total Referrers</p>
//                         <h3 className="text-2xl font-bold">
//                             {data?.totalReferrers || 0}
//                         </h3>
//                     </div>

//                     <div className="p-4 rounded-xl bg-gray-50">
//                         <p className="text-sm text-gray-500">Completed Referrals</p>
//                         <h3 className="text-2xl font-bold">
//                             {data?.completed || 0}
//                         </h3>
//                     </div>

//                     <div className="p-4 rounded-xl bg-gray-50">
//                         <p className="text-sm text-gray-500">Total Amount</p>
//                         <h3 className="text-2xl font-bold text-green-600">
//                             ₹{data?.totalAmount || 0}
//                         </h3>
//                     </div>

//                     <div className="p-4 rounded-xl bg-gray-50">
//                         <p className="text-sm text-gray-500">Pending Referrals</p>
//                         <h3 className="text-2xl font-bold text-orange-500">
//                             {data?.pending || 0}
//                         </h3>
//                     </div>

//                 </div>
//             )}

//         </div>
//     );
// }