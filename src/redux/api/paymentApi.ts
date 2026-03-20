import { api } from "../api";

export const paymentApi = api.injectEndpoints({
    endpoints: (builder) => ({

        getPayments: builder.query<any[], void>({
            query: () => "/payments",
            providesTags: ["Payments"],
        }),

        addPayment: builder.mutation({
            query: (data) => ({
                url: "/payments",
                method: "POST",
                body: data,
            }),
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

    }),
    overrideExisting: false,
});

export const {
    useGetPaymentsQuery,
    useAddPaymentMutation,
    useAddInstallmentMutation,
} = paymentApi;