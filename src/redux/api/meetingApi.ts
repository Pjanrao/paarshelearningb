import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const meetingApi = createApi({
    reducerPath: "meetingApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    endpoints: (builder) => ({

        getMeetings: builder.query({
            query: (courseId) => `/meetings?courseId=${courseId || ""}`,
        }),

        createMeeting: builder.mutation({
            query: (data) => ({
                url: "/meetings",
                method: "POST",
                body: data,
            }),
        }),

        updateMeeting: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/meetings/${id}`,
                method: "PUT",
                body: data,
            }),
        }),

        deleteMeeting: builder.mutation({
            query: (id) => ({
                url: `/meetings/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetMeetingsQuery,
    useCreateMeetingMutation,
    useUpdateMeetingMutation,
    useDeleteMeetingMutation,
} = meetingApi;