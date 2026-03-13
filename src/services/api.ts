import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    tagTypes: ["Test"],

    endpoints: (builder) => ({

        createEntranceTest: builder.mutation({
            query: (body) => ({
                url: "/entrance-exam",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Test"],
        }),

        updateEntranceTest: builder.mutation({
            query: ({ testId, ...body }) => ({
                url: `/entrance-exam?testId=${testId}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Test"],
        }),

        deleteEntranceTest: builder.mutation({
            query: ({ testId, collegeId }) => ({
                url: `/entrance-exam?testId=${testId}&collegeId=${collegeId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Test"],
        }),

    }),
});

export const {
    useCreateEntranceTestMutation,
    useUpdateEntranceTestMutation,
    useDeleteEntranceTestMutation,
} = api;