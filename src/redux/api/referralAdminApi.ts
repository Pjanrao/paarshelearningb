import { api } from "@/redux/api";

export const referralAdminApi = api.injectEndpoints({
    endpoints: (builder) => ({

        getReferralUsersAdmin: builder.query<any, void>({
            query: () => "/admin/referral/users",
            providesTags: ["Referral"],
        }),

        getReferralStatsAdmin: builder.query<any, void>({
            query: () => "/admin/referral/stats",
            providesTags: ["ReferralStats"],
        }),

        getReferralSettings: builder.query<any, void>({
            query: () => "/admin/referral/settings",
            providesTags: ["ReferralSettings"],
        }),

        updateReferralSettings: builder.mutation({
            query: (data) => ({
                url: "/admin/referral/settings",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ReferralSettings"], // ✅ ADD THIS
        }),

    }),
});


// ✅ 🔥 ADD THIS (VERY IMPORTANT)
export const {
    useGetReferralStatsAdminQuery,
    useGetReferralUsersAdminQuery,
    useGetReferralSettingsQuery,   // ✅ THIS FIXES YOUR ERROR
    useUpdateReferralSettingsMutation,
} = referralAdminApi;