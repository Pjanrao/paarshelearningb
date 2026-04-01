import { api } from "../api";

export const teachersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTeachers: builder.query<any, void>({
      query: () => "/teachers",
      providesTags: ["Teachers"],
    }),

    createTeacher: builder.mutation<any, any>({
      query: (body) => ({
        url: "/teachers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Teachers"],
    }),

    updateTeacher: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/teachers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Teachers"],
    }),

    deleteTeacher: builder.mutation<any, string>({
      query: (id) => ({
        url: `/teachers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Teachers"],
    }),
  }),
});

export const {
  useGetTeachersQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = teachersApi;

