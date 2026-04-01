import { api } from "../api";

export interface Video {
    _id: string;
    title: string;
    description?: string;
    videoUrl: string;
    publicId: string;
    course: string;
    topic: string;
    subtopic: string;
    createdAt: string;
}

export const videoApi = api.injectEndpoints({
    overrideExisting: true,

    endpoints: (builder) => ({
        // ✅ GET VIDEOS (ADMIN)
        getVideos: builder.query<{ videos: Video[] }, string>({
            query: (courseId) => ({
                url: "/videos",
                params: { courseId },
            }),
            providesTags: (result, error, arg) =>
                result?.videos
                    ? [
                        ...result.videos.map(({ _id }) => ({
                            type: "Videos" as const,
                            id: _id,
                        })),
                        { type: "Videos", id: `LIST-${arg}` },
                    ]
                    : [{ type: "Videos", id: `LIST-${arg}` }],
        }),

        // ✅ GET STUDENT VIDEOS
        getStudentVideos: builder.query<{ videos: Video[] }, string>({
            query: (courseId) => ({
                url: "/student/videos",
                params: { courseId },
            }),
            providesTags: (result, error, arg) =>
                result?.videos
                    ? [
                        ...result.videos.map(({ _id }) => ({
                            type: "Videos" as const,
                            id: _id,
                        })),
                        { type: "Videos", id: `STUDENT-LIST-${arg}` },
                    ]
                    : [{ type: "Videos", id: `STUDENT-LIST-${arg}` }],
        }),

        // ✅ UPLOAD VIDEO
        uploadVideo: builder.mutation<Video, FormData>({
            query: (formData) => ({
                url: "/videos",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Videos", id: `LIST-${arg.get("courseId")}` },
            ],
        }),

        // ✅ UPDATE VIDEO
        updateVideo: builder.mutation<Video, { id: string; data: Partial<Video> }>({
            query: ({ id, data }) => ({
                url: `/videos/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id, data }) => [
                { type: "Videos", id },
                { type: "Videos", id: `LIST-${data.course}` },
                { type: "Videos", id: `STUDENT-LIST-${data.course}` }, // Invalidate student cache too
            ],
        }),

        // ✅ DELETE VIDEO
        deleteVideo: builder.mutation<{ message: string }, { id: string; courseId: string }>({
            query: ({ id }) => ({
                url: `/videos/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { id, courseId }) => [
                { type: "Videos", id },
                { type: "Videos", id: `LIST-${courseId}` },
                { type: "Videos", id: `STUDENT-LIST-${courseId}` }
            ],
        }),
    }),
});

export const {
    useGetVideosQuery,
    useGetStudentVideosQuery,
    useUploadVideoMutation,
    useUpdateVideoMutation,
    useDeleteVideoMutation,
} = videoApi;