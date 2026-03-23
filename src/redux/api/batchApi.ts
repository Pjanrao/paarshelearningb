import { api } from "../api";

export const batchApi = api.injectEndpoints({
    endpoints: (builder) => ({

        getBatches: builder.query<any[], string | void>({
            query: (courseId) => ({
                url: "/batches",
                params: courseId ? { courseId } : {},
            }),
            providesTags: ["Batch"],
        }),

        addBatch: builder.mutation<any, any>({
            query: (body) => ({
                url: "/batches",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Batch"],
        }),

        updateBatch: builder.mutation<any, { id: string; body: any }>({
            query: ({ id, body }) => ({
                url: `/batches/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Batch"],
        }),

        deleteBatch: builder.mutation<any, string>({
            query: (id) => ({
                url: `/batches/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Batch"],
        }),

    }),
});

export const {
    useGetBatchesQuery,
    useAddBatchMutation,
    useUpdateBatchMutation,
    useDeleteBatchMutation,
} = batchApi;