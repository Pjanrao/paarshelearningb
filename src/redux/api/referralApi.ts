import { api } from "@/redux/api";

export const referralApi = api.injectEndpoints({
    endpoints: (builder) => ({

        getReferralData: builder.query<any, void>({
            query: () => "/referral/my-referrals",
            providesTags: ["Referral"],
        }),

        getReferralStats: builder.query<any, void>({
            query: () => "/referral/stats",
            providesTags: ["ReferralStats"],
        }),

    }),
});

export const {
    useGetReferralDataQuery,
    useGetReferralStatsQuery,
} = referralApi;