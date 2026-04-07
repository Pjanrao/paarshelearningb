import { api } from "@/redux/api";

export const referralApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // ✅ Referral List (table)
        getReferralList: builder.query<any, void>({
            query: () => "/referral/my-referrals",
            providesTags: ["Referral"],
        }),

        // ✅ Referral Stats (code + earnings)
        getReferralStats: builder.query<any, void>({
            query: () => "/referral/stats",
            providesTags: ["ReferralStats"],
        }),

    }),
});

// ✅ EXPORT HOOKS
export const {
    useGetReferralListQuery,   // 🔥 renamed (better meaning)
    useGetReferralStatsQuery,
} = referralApi;