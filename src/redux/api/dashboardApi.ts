import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/admin/dashboard/" }),
    endpoints: (builder) => ({

        getDashboardStats: builder.query<any, void>({
            query: () => "stats",
        }),

    }),
});

export const {
    useGetDashboardStatsQuery,
} = dashboardApi;