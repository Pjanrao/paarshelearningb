import { api } from "../api";

interface Meeting {
    _id: string;
    title: string;
    description: string;
    meetingDate: string;
    startTime: string;
    endTime: string;
    platform: string;
    duration: number;
    meetingLink?: string;
    teacher?: string | {
        _id: string;
        name: string;
    };

    course?: string | {
        _id: string;
        name: string;
    };
}

export const meetingApi = api.injectEndpoints({
    overrideExisting: true,

    endpoints: (builder) => ({

        // ✅ GET ALL
        getMeetings: builder.query<Meeting[], string | void>({
            query: (courseId) => ({
                url: "/meetings",
                params: courseId ? { courseId } : {},
            }),

            // ✅ ADD THIS (VERY IMPORTANT)
            transformResponse: (response: any) => {
                console.log("API RESPONSE:", response); // debug
                return response.meetings || response;
            },

            providesTags: ["Meetings"],
        }),

        // ✅ CREATE
        createMeeting: builder.mutation<Meeting, Partial<Meeting>>({
            query: (data) => ({
                url: "/meetings",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Meetings"],
        }),

        // ✅ UPDATE
        updateMeeting: builder.mutation<
            Meeting,
            { id: string; data: Partial<Meeting> }
        >({
            query: ({ id, data }) => ({
                url: `/meetings/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Meetings"],
        }),

        // ✅ DELETE
        deleteMeeting: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/meetings/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Meetings"], // 🔥 auto refresh
        }),

        // ✅ GET BY ID (optional but useful)
        getMeetingById: builder.query<Meeting, string>({
            query: (id) => `/meetings/${id}`,
            providesTags: (result, error, id) => [
                { type: "Meetings", id },
            ],
        }),

    }),
});

export const {
    useGetMeetingsQuery,
    useCreateMeetingMutation,
    useUpdateMeetingMutation,
    useDeleteMeetingMutation,
    useGetMeetingByIdQuery,
} = meetingApi;