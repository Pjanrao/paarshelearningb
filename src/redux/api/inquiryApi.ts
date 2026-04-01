import { api } from "../api";

export const inquiryApi = api.injectEndpoints({
  endpoints: (builder) => ({

    createInquiry: builder.mutation<any, any>({
      query: (data) => ({
        url: "/inquiry",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Inquiry"],
    }),

    getInquiries: builder.query<
      any,
      {
        search?: string;
        page?: number;
        limit?: number;
        startDate?: string;
        endDate?: string;
      }
    >({
      query: ({
        search = "",
        page = 1,
        limit = 10,
        startDate,
        endDate,
      }) => {
        const params = new URLSearchParams({
          search,
          page: page.toString(),
          limit: limit.toString(),
        });

        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        return `/inquiry?${params.toString()}`;
      },
      providesTags: ["Inquiry"],
    }),

    getInquiryById: builder.query<any, string>({
      query: (id) => `/inquiry/${id}`,
      providesTags: ["Inquiry"],
    }),

    updateInquiry: builder.mutation<any, { id: string } & any>({
      query: ({ id, ...data }) => ({
        url: `/inquiry/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Inquiry"],
    }),

    deleteInquiry: builder.mutation<any, string>({
      query: (id) => ({
        url: `/inquiry/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Inquiry"],
    }),

  }),

  overrideExisting: false,
});

export const {
  useCreateInquiryMutation,
  useGetInquiriesQuery,
  useGetInquiryByIdQuery,
  useUpdateInquiryMutation,
  useDeleteInquiryMutation,
} = inquiryApi;