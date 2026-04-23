import { api } from "@/redux/api";

export const activityApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getRecentActivities: builder.query<any[], void>({
            query: () => "/activity",
            providesTags: ["Activity"],
        }),
    }),
});

export const { useGetRecentActivitiesQuery } = activityApi;
