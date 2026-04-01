import { api } from "../api";

export const reportsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getReports: builder.query<any, void>({
            query: () => ({
                url: "/admin/reports",
                method: "GET",
            }),
            providesTags: ["Reports"],
        }),
    }),
    overrideExisting: false,
});

export const { useGetReportsQuery } = reportsApi;
