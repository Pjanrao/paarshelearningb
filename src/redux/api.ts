import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";

export const api = createApi({

  reducerPath: "api",
  tagTypes: ["Colleges", "Tests", "Questions", "Students", "Sessions", "Inquiry", "College", "Student", "EntranceTests", "Auth", "StudentLog", "Teachers", "Blogs", "Testimonials", "Reports", "Placements", "Courses", "Category", "Subcategory", "Payments", "Batch", "Meetings", "Videos", "Dashboard"],
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<
      { token: string; role: string },
      { email: string; password: string }
    >({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation<
      { token: string; role: string },
      { name: string; email: string; password: string; contact: string }
    >({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    fetchEntranceColleges: builder.query<{ success: boolean; colleges: any[] }, void>({
      query: () => "/admin/entrance-exam/colleges",
      providesTags: ["Colleges"],
    }),
    createEntranceCollege: builder.mutation<any, Partial<any>>({
      query: (data) => ({
        url: "/admin/entrance-exam/colleges",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Colleges"],
    }),
    updateEntranceCollege: builder.mutation<any, { collegeId: string; data: Partial<any> }>({
      query: ({ collegeId, data }) => ({
        url: `/admin/entrance-exam/colleges?collegeId=${collegeId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Colleges"],
    }),
    deleteEntranceCollege: builder.mutation<any, { collegeId: string }>({
      query: ({ collegeId }) => ({
        url: `/admin/entrance-exam/colleges?collegeId=${collegeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Colleges"],
    }),



    // Entrance Exam Questions
    fetchEntranceQuestions: builder.query<any[], void>({
      query: () => "/admin/entrance-exam-questions",
      providesTags: ["Questions"],
    }),
    bulkUploadEntranceQuestions: builder.mutation<any, {
      fileContent?: string;
      fileType?: string;
      questions?: Array<{
        question: string;
        options: Array<{ text: string; isCorrect: boolean }>;
        correctAnswer: string;
        category: string;
        explanation?: string;
      }>
    }>({
      query: (data) => ({
        url: "/admin/entrance-exam-questions/bulk-upload",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Questions"],
    }),
    updateEntranceQuestion: builder.mutation<any, { id: string } & any>({
      query: ({ id, ...data }) => ({
        url: `/admin/entrance-exam-questions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Questions"],
    }),
    deleteEntranceQuestion: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/entrance-exam-questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Questions"],
    }),

    // Entrance Exam Students & Sessions
    fetchEntranceStudents: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => "/admin/entrance-exam/students",
      providesTags: ["Students"],
    }),
    deleteEntranceStudent: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/admin/entrance-exam/students?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Students"],
    }),
    getEntranceTestSessions: builder.query<any, any>({
      query: (params) => ({
        url: "/admin/entrance-exam/sessions",
        params,
      }),
      providesTags: ["Sessions"],
    }),
    deleteEntranceTestSession: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/admin/entrance-exam/sessions?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sessions"],
    }),
    createEntranceTestSession: builder.mutation<any, { studentId: string; testId: string; collegeId: string; batchName: string; token?: string }>({
      query: ({ token, ...data }) => ({
        url: "/admin/entrance-exam/session",
        method: "POST",
        body: data,
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
      }),
      invalidatesTags: ["Sessions"],
    }),
    getEntranceTestInstruction: builder.query<any, { sessionId: string | null; testId: string | null; collegeId: string | null; token?: string }>({
      query: ({ sessionId, testId, collegeId, token }) => ({
        url: `/admin/entrance-exam/instructions?sessionId=${sessionId}&testId=${testId}&collegeId=${collegeId}`,
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
      }),
      transformResponse: (response: any) => response.data,
    }),
    startEntranceTestSession: builder.mutation<any, { sessionId: string; testId: string; collegeId: string; token?: string }>({
      query: ({ token, ...data }) => ({
        url: "/admin/entrance-exam/start",
        method: "POST",
        body: data,
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
      }),
      invalidatesTags: ["Sessions"],
    }),
    saveEntranceAnswer: builder.mutation<any, { sessionId: string; questionId: string; selectedAnswer: number; token?: string }>({
      query: ({ sessionId, token, ...data }) => ({
        url: `/admin/entrance-exam/session/${sessionId}/answer`,
        method: "PATCH",
        body: data,
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
      }),
    }),
    submitEntranceTest: builder.mutation<any, { sessionId: string | null; answers: any[]; token?: string }>({
      query: ({ sessionId, token, ...data }) => ({
        url: `/admin/entrance-exam/session/${sessionId}/submit`,
        method: "POST",
        body: data,
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
      }),
      invalidatesTags: ["Sessions"],
    }),
    loginEntranceStudent: builder.mutation<
      { token: string; student_access_token: string; student_refresh_token: string; studentId: string; role: string; message: string },
      { email: string; password: string; testId: string; collegeId: string }
    >({
      query: (data) => ({
        url: "/admin/entrance-exam/student/login",
        method: "POST",
        body: data,
      }),
    }),
    registerEntranceStudent: builder.mutation<
      { token: string; student_access_token: string; student_refresh_token: string; studentId: string; role: string; message: string },
      { name: string; email: string; password: string; phone?: string; degree?: string; university?: string; gender?: string; testId: string; collegeId: string }
    >({
      query: (data) => ({
        url: "/admin/entrance-exam/student/register",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useFetchEntranceCollegesQuery,
  useCreateEntranceCollegeMutation,
  useUpdateEntranceCollegeMutation,
  useDeleteEntranceCollegeMutation,

  useFetchEntranceQuestionsQuery,
  useBulkUploadEntranceQuestionsMutation,
  useUpdateEntranceQuestionMutation,
  useDeleteEntranceQuestionMutation,
  useFetchEntranceStudentsQuery,
  useDeleteEntranceStudentMutation,
  useGetEntranceTestSessionsQuery,
  useDeleteEntranceTestSessionMutation,
  useCreateEntranceTestSessionMutation,
  useGetEntranceTestInstructionQuery,
  useStartEntranceTestSessionMutation,
  useSaveEntranceAnswerMutation,
  useSubmitEntranceTestMutation,
  useLoginEntranceStudentMutation,
  useRegisterEntranceStudentMutation,
} = api;