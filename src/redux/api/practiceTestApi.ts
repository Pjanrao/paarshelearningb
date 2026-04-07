import { api } from "../api";

export interface PracticeTest {
  _id: string;
  name: string;
  courseIds: any[];
  skill: string;
  level: "Easy" | "Intermediate" | "Hard";
  duration: number;
  totalQuestions: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

interface GetTestsResponse {
  tests: PracticeTest[];
  total: number;
  totalPages: number;
  currentPage: number;
}

interface GetTestsParams {
  page?: number;
  limit?: number;
  search?: string;
  courseId?: string;
  status?: string;
}

export interface TestAttemptLog {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    contact?: string;
    batchName: string;
  };
  testId: {
    _id: string;
    name: string;
    duration: number;
  };
  score: number;
  totalMarks: number;
  startedAt: string;
  submittedAt?: string;
  status: "completed" | "timeout";
  createdAt: string;
}

export interface GetTestLogsResponse {
  testLogs: TestAttemptLog[];
  pagination: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    hasMore: boolean;
  };
}

export interface GetTestLogsParams {
  page?: number;
  limit?: number;
  studentName?: string;
  testName?: string;
  status?: string;
  date?: string;
}


export const practiceTestApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPracticeTests: builder.query<GetTestsResponse, GetTestsParams>({
      query: (params) => ({
        url: "/tests",
        params,
      }),
      providesTags: ["PracticeTests"],
    }),

    getPracticeTestById: builder.query<PracticeTest, string>({
      query: (id) => `/tests/${id}`,
      providesTags: (result, error, id) => [{ type: "PracticeTests", id }],
    }),

    createPracticeTest: builder.mutation<PracticeTest, Partial<PracticeTest>>({
      query: (data) => ({
        url: "/tests",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PracticeTests"],
    }),

    updatePracticeTest: builder.mutation<
      PracticeTest,
      { id: string; data: Partial<PracticeTest> }
    >({
      query: ({ id, data }) => ({
        url: `/tests/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "PracticeTests",
        { type: "PracticeTests", id },
      ],
    }),

    deletePracticeTest: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/tests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PracticeTests"],
    }),

    getStudentTests: builder.query<PracticeTest[], void>({
      query: () => "/student/tests",
      providesTags: ["PracticeTests"],
    }),

    getTestAttempts: builder.query<TestAttemptLog[], string>({
      query: (testId) => `/admin/practice-tests/${testId}/attempts`,
      providesTags: (result, error, id) => [{ type: "PracticeTests", id }],
    }),

    getGlobalPracticeTestLogs: builder.query<GetTestLogsResponse, GetTestLogsParams>({
      query: (params) => ({
        url: "/admin/practice-tests/attempts",
        params,
      }),
      providesTags: ["PracticeTests"],
    }),

    deleteGlobalPracticeTestLog: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/admin/practice-tests/attempts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PracticeTests"],
    }),

    bulkUploadQuestions: builder.mutation<
      { success: boolean; message: string; count: number },
      { testId: string; fileContent: string; fileType: "csv" | "json" }
    >({
      query: (data) => ({
        url: "/admin/practice-tests/questions/bulk-upload",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PracticeTests"],
    }),
  }),
});

export const {
  useGetPracticeTestsQuery,
  useGetPracticeTestByIdQuery,
  useCreatePracticeTestMutation,
  useUpdatePracticeTestMutation,
  useDeletePracticeTestMutation,
  useGetStudentTestsQuery,
  useGetTestAttemptsQuery,
  useGetGlobalPracticeTestLogsQuery,
  useDeleteGlobalPracticeTestLogMutation,
  useBulkUploadQuestionsMutation,
} = practiceTestApi;
