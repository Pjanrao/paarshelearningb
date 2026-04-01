import { api } from "../api";

export const paymentApi = api.injectEndpoints({
    endpoints: (builder) => ({

        getPayments: builder.query<any[], void>({
            query: () => "/payments",
            providesTags: ["Payments"],
        }),

        // addPayment: builder.mutation({
        //     query: (data) => ({
        //         url: "/payments",
        //         method: "POST",
        //         body: data,
        //         formData: true, 

        //     }),
        //     invalidatesTags: ["Payments"],
        // }),
        addPayment: builder.mutation({
            query: (data) => ({
                url: "/payments",
                method: "POST",
                body: data,
            }),
            transformErrorResponse: (response: any) => {
                return response?.data || { error: "Unknown error" };
            },
            invalidatesTags: ["Payments"],
        }),
        addInstallment: builder.mutation({
            query: (data) => ({
                url: "/payments/installments",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Payments"],
        }),
        deletePayment: builder.mutation({
            query: (id: string) => ({
                url: `/payments/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Payments"],
        }),

        updatePayment: builder.mutation({
            query: ({ id, data }) => ({
                url: `/payments/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Payments"],
        }),

    }),
    overrideExisting: false,
});

export const {
    useGetPaymentsQuery,
    useAddPaymentMutation,
    useAddInstallmentMutation,
    useDeletePaymentMutation,
    useUpdatePaymentMutation,

} = paymentApi;