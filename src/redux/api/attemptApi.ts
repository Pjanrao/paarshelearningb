import { api } from "../api";

export interface TestAttempt {
  _id: string;
  userId: string;
  testId: any; // Can be object with name etc after populate
  answers: Array<{
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
  }>;
  score: number;
  totalMarks: number;
  startedAt: string;
  submittedAt: string;
  status: "completed" | "timeout";
  createdAt: string;
  updatedAt: string;
}

export const attemptApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    startAttempt: builder.mutation<TestAttempt, { testId: string }>({
      query: (data) => ({
        url: "/attempts/start",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TestAttempts"],
    }),

    submitAttempt: builder.mutation<
      TestAttempt,
      { attemptId: string; answers: any[] }
    >({
      query: (data) => ({
        url: "/attempts/submit",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TestAttempts"],
    }),

    getUserAttempts: builder.query<TestAttempt[], string>({
      query: (userId) => `/attempts/user/${userId}`,
      providesTags: ["TestAttempts"],
    }),

    getAttemptById: builder.query<TestAttempt, string>({
      query: (id) => `/attempts/${id}`,
      providesTags: (result, error, id) => [{ type: "TestAttempts", id }],
    }),
  }),
});

export const {
  useStartAttemptMutation,
  useSubmitAttemptMutation,
  useGetUserAttemptsQuery,
  useGetAttemptByIdQuery,
} = attemptApi;
