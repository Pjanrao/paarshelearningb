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
            invalidatesTags: ["ReferralSettings"],
        }),

        // ✅ ADMIN: Get All Withdrawal Requests
        getAllWithdrawalsAdmin: builder.query<any[], void>({
            query: () => "/admin/withdrawal",
            providesTags: ["Withdrawal"],
        }),

        // ✅ ADMIN: Update Withdrawal Status (Approve/Reject)
        updateWithdrawalStatusAdmin: builder.mutation<any, { id: string; status: string; remarks?: string }>({
            query: ({ id, ...data }) => ({
                url: `/admin/withdrawal/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Withdrawal", "ReferralStats"],
        }),

        // ✅ ADMIN: Delete Withdrawal Request
        deleteWithdrawalAdmin: builder.mutation<any, string>({
            query: (id) => ({
                url: `/admin/withdrawal/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Withdrawal", "ReferralStats"],
        }),

    }),
});


// ✅ 🔥 ADD THIS (VERY IMPORTANT)
export const {
    useGetReferralStatsAdminQuery,
    useGetReferralUsersAdminQuery,
    useGetReferralSettingsQuery,
    useUpdateReferralSettingsMutation,
    useGetAllWithdrawalsAdminQuery,
    useUpdateWithdrawalStatusAdminMutation,
    useDeleteWithdrawalAdminMutation,
} = referralAdminApi;