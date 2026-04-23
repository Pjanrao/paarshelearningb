import { api } from "@/redux/api";

export const downloadApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDownloads: builder.query<any[], void>({
            query: () => "/downloads",
            providesTags: ["Downloads"],
        }),
    }),
});

export const { useGetDownloadsQuery } = downloadApi;
