import { api } from "../api";

export const studentlogApi = api.injectEndpoints({
    endpoints: (builder) => ({

        getStudentLog: builder.query<any, void>({
            query: () => ({
                url: "/admin/entrance-exam/student-logs",
                method: "GET",
            }),
            providesTags: ["StudentLog"],
        }),

        getStudentLogById: builder.query<any, string>({
            query: () => ({
                url: "/admin/entrance-exam/student-logs",
                method: "GET",
            }),
            providesTags: ["StudentLog"],
        }),

        updateStudentLog: builder.mutation<any, string>({
            query: (id) => ({
                url: `/admin/entrance-exam/student-logs?id=${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["StudentLog"],
        }),

        deleteStudentLog: builder.mutation<any, string>({
            query: (id) => ({
                url: `/admin/entrance-exam/student-logs?id=${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["StudentLog"],
        }),

    })
})

export const { useGetStudentLogQuery,
    useUpdateStudentLogMutation,
    useDeleteStudentLogMutation,
    useGetStudentLogByIdQuery,
} = studentlogApi;