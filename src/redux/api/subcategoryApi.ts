import { api } from "../api";

export interface Subcategory {
  _id: string;
  name: string;
  description: string;
  keywords: string[];
  category: {
    _id: string;
    name: string;
  };
   isActive: boolean
  createdAt: string;
  updatedAt: string;
}

export interface SubcategoryPayload {
  category: string;
  name: string;
  description: string;
  keywords: string[];
}

export const subcategoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubcategories: builder.query<Subcategory[], void>({
      query: () => "/subcategories",
      providesTags: ["Subcategory"],
    }),

    createSubcategory: builder.mutation<
      Subcategory,
      SubcategoryPayload
    >({
      query: (data) => ({
        url: "/subcategories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subcategory"],
    }),

    updateSubcategory: builder.mutation<
      Subcategory,
      { id: string; data: SubcategoryPayload }
    >({
      query: ({ id, data }) => ({
        url: `/subcategories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Subcategory"],
    }),

    deleteSubcategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/subcategories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subcategory"],
    }),
  }),
});

export const {
  useGetSubcategoriesQuery,
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
} = subcategoryApi;