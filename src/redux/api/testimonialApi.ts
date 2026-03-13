import { api } from "../api";

export const testimonialApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTestimonials: builder.query<any, void>({
      query: () => ({
        url: "/admin/testimonial",
        method: "GET",
      }),
      providesTags: ["Testimonials"],
    }),

    createTestimonial: builder.mutation<any, any>({
      query: (body) => ({
        url: "/admin/testimonial",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Testimonials"],
    }),

    updateTestimonial: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/admin/testimonial/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Testimonials"],
    }),

    deleteTestimonial: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/testimonial/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Testimonials"],
    }),
  }),
});

export const {
  useGetTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} = testimonialApi;