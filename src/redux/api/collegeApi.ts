import { api } from "../api";

export const collegeApi = api.injectEndpoints({
  endpoints: (builder) => ({

    createCollege: builder.mutation<any, any>({
      query: (data) => ({
        url: "/admin/entrance-exam/colleges",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["College"],
    }),

    getColleges: builder.query<any, void>({
      query: () => ({
        url: "/admin/entrance-exam/colleges",
        method: "GET",
      }),
      providesTags: ["College"],
    }),

    updateCollege: builder.mutation<
      any,
      { collegeId: string; name: string; email: string }>({
      query: ({ collegeId, ...data }) => ({
        url: `/admin/entrance-exam/colleges?collegeId=${collegeId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["College"],
    }),

    deleteCollege: builder.mutation<any, string>({
      query: (collegeId) => ({
        url: `/admin/entrance-exam/colleges?collegeId=${collegeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["College"],
    }),

  }),

  overrideExisting: false,
});

export const {
  useCreateCollegeMutation,
  useGetCollegesQuery,
  useUpdateCollegeMutation,
  useDeleteCollegeMutation,
} = collegeApi;