import {api} from "../api";

export const studentApi = api.injectEndpoints({
    endpoints: (builder) => ({

        getStudent:builder.query<any,void>({
            query: () => ({
                url: "/admin/entrance-exam/students",
                method: "GET",
            }),
            providesTags: ["Student"],
        }),

        deleteStudent: builder.mutation<any, string>({
            query:(id) => ({
                url: `/admin/entrance-exam/students?Id=${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Student"],
        }),
    }), 

    overrideExisting:false,
});
 
export const{  
     useGetStudentQuery, 
     useDeleteStudentMutation,
} = studentApi;    