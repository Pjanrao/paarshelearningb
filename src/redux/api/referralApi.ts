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

        // ✅ Wallet Stats (real balance + pending withdrawals)
        getWalletStats: builder.query<any, void>({
            query: () => "/wallet/stats",
            providesTags: ["Withdrawal", "ReferralStats"],
        }),

        // ✅ Withdrawal History
        getWithdrawalHistory: builder.query<any[], void>({
            query: () => "/withdrawal",
            providesTags: ["Withdrawal"],
        }),

        // ✅ Request Withdrawal
        requestWithdrawal: builder.mutation<any, { amount: number; upiId: string }>({
            query: (data) => ({
                url: "/withdrawal",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Withdrawal", "ReferralStats"],
        }),

    }),
});

// ✅ EXPORT HOOKS
export const {
    useGetReferralListQuery,
    useGetReferralStatsQuery,
    useGetWalletStatsQuery,
    useGetWithdrawalHistoryQuery,
    useRequestWithdrawalMutation,
} = referralApi;