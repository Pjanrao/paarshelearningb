import { api } from "../api";


export const jobApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // JOBS
        getJobs: builder.query<any[], boolean | void>({
            query: (all = false) => `/jobs${all ? "?all=true" : ""}`,
            providesTags: ["Jobs"],
        }),

        getJobById: builder.query<any, string>({
            query: (id) => `/jobs/${id}`,
            providesTags: (result, error, id) => [{ type: "Jobs", id }],
        }),

        createJob: builder.mutation<any, any>({
            query: (data) => ({
                url: "/jobs",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Jobs"],
        }),

        updateJob: builder.mutation<any, { id: string | string[];[key: string]: any }>({
            query: ({ id, ...data }) => ({
                url: `/jobs/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ["Jobs"],
        }),

        deleteJob: builder.mutation<any, string>({
            query: (id) => ({
                url: `/jobs/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Jobs"],
        }),

        // APPLICATIONS
        applyJob: builder.mutation<any, any>({
            query: (data) => ({
                url: "/applications",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Applications"],
        }),

        getApplications: builder.query<any[], void>({
            query: () => "/applications",
            providesTags: ["Applications"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetJobsQuery,
    useGetJobByIdQuery,
    useCreateJobMutation,
    useUpdateJobMutation,
    useDeleteJobMutation,
    useApplyJobMutation,
    useGetApplicationsQuery,
} = jobApi;
