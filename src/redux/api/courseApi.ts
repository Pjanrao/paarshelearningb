import { api } from "../api";

interface Course {
  _id: string;
  name: string;
  shortDescription: string;
  duration: number;
  fee: number;
  status: string;
  featured?: boolean;
  thumbnail?: string;
  createdAt: string;
  category?: {
    _id: string;
    name: string;
  };
  instructor?: {
    _id: string;
    name: string;
  };
}

interface GetCoursesResponse {
  courses: Course[];
  total: number;
  totalPages: number;
  currentPage: number;
}

interface GetCoursesParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
  status?: string;
  featured?: boolean;
}

export const courseApi = api.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({

    getCourses: builder.query<GetCoursesResponse, GetCoursesParams>({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        category = "",
        sort = "",
        featured,
      }) => ({
        url: "/courses",
        params: { page, limit, search, category, sort, featured },
      }),
      providesTags: ["Courses"],
    }),

    createCourse: builder.mutation<Course, FormData>({
      query: (data) => ({
        url: "/courses",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),

    updateCourse: builder.mutation<
      Course,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/courses/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),

    deleteCourse: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),

    getCourseById: builder.query<Course, string>({
      query: (id) => `/courses/${id}`,
      providesTags: (result, error, id) => [{ type: "Courses", id }],
    }),

  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;