import { api } from "../api";

export const entranceTestApi = api.injectEndpoints({
    endpoints: (builder) => ({

        createEntranceTest: builder.mutation<any, any>({
            query: (data) => ({
                url: "/admin/entrance-exam/colleges/test",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["EntranceTests"],
        }),

        getEntranceTests: builder.query<any, string | undefined>({
            query: (collegeId = "all") => ({
                url: `/admin/entrance-exam/colleges/test?collegeId=${collegeId}`,
                method: "GET",
            }),
            providesTags: ["EntranceTests"],
        }),

        updateEntranceTest: builder.mutation<
            any,
            { testId: string } & any
        >({
            query: ({ testId, ...data }) => ({
                url: `/admin/entrance-exam/colleges/test?testId=${testId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["EntranceTests"],
        }),

        deleteEntranceTest: builder.mutation<
            any,
            { testId: string; collegeId: string }
        >({
            query: ({ testId, collegeId }) => ({
                url: `/admin/entrance-exam/colleges/test?testId=${testId}&collegeId=${collegeId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["EntranceTests"],
        }),

    }),

    overrideExisting: false,
});

export const {
    useCreateEntranceTestMutation,
    useGetEntranceTestsQuery,
    useLazyGetEntranceTestsQuery,
    useUpdateEntranceTestMutation,
    useDeleteEntranceTestMutation,
} = entranceTestApi;