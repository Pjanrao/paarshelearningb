import { api } from "../api";

export const blogApi = api.injectEndpoints({
  endpoints: (builder) => ({

    getBlogs: builder.query<any[], void>({
      query: () => ({
        url: "/admin/blog",
        method: "GET",
      }),
      providesTags: ["Blogs"],
    }),

    getBlogById: builder.query<any, string>({
      query: (id) => ({
        url: `/admin/blog/${id}`,
        method: "GET",
      }),
      providesTags: ["Blogs"],
    }),

    createBlog: builder.mutation<any, any>({
      query: (body) => ({
        url: "/admin/blog",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Blogs"],
    }),

    updateBlog: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/admin/blog/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Blogs"],
    }),

    deleteBlog: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blogs"],
    }),

  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;