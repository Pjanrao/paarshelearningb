import { api } from "../api";

export const placementApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getPlacements: builder.query<{ placements: any[]; total: number }, { search?: string; status?: string; page?: number; limit?: number }>({
            query: (params) => ({
                url: "/admin/placement",
                method: "GET",
                params,
            }),
            providesTags: ["Placements"],
        }),

        createPlacement: builder.mutation<any, any>({
            query: (body) => ({
                url: "/admin/placement",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Placements"],
        }),

        updatePlacement: builder.mutation<any, { id: string; data: any }>({
            query: ({ id, data }) => ({
                url: `/admin/placement/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Placements"],
        }),

        deletePlacement: builder.mutation<any, string>({
            query: (id) => ({
                url: `/admin/placement/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Placements"],
        }),

        getPlacementStats: builder.query<any, void>({
            query: () => ({
                url: "/admin/placement/stats",
                method: "GET",
            }),
            providesTags: ["Placements"],
        }),
    }),
});

export const {
    useGetPlacementsQuery,
    useCreatePlacementMutation,
    useUpdatePlacementMutation,
    useDeletePlacementMutation,
    useGetPlacementStatsQuery,
} = placementApi;
