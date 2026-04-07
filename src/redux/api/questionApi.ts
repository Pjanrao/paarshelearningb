import { api } from "../api";

export interface Question {
  _id: string;
  testId: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  marks: number;
  createdAt: string;
  updatedAt: string;
}

export const questionApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getQuestionsByTestId: builder.query<Question[], string>({
      query: (testId) => `/questions?testId=${testId}`,
      providesTags: (result, error, testId) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "PracticeQuestions" as const,
                id: _id,
              })),
              { type: "PracticeQuestions", id: `LIST-${testId}` },
            ]
          : [{ type: "PracticeQuestions", id: `LIST-${testId}` }],
    }),

    addQuestion: builder.mutation<Question, Partial<Question>>({
      query: (data) => ({
        url: "/questions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { testId }) => [
        { type: "PracticeQuestions", id: `LIST-${testId}` },
        "PracticeTests", // To update totalQuestions count
      ],
    }),

    updateQuestion: builder.mutation<
      Question,
      { id: string; data: Partial<Question> }
    >({
      query: ({ id, data }) => ({
        url: `/questions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id, data }) => [
        { type: "PracticeQuestions", id },
        { type: "PracticeQuestions", id: `LIST-${data.testId}` },
      ],
    }),

    deleteQuestion: builder.mutation<
      { success: boolean },
      { id: string; testId: string }
    >({
      query: ({ id }) => ({
        url: `/questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id, testId }) => [
        { type: "PracticeQuestions", id },
        { type: "PracticeQuestions", id: `LIST-${testId}` },
        "PracticeTests", // To update totalQuestions count
      ],
    }),
  }),
});

export const {
  useGetQuestionsByTestIdQuery,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionApi;
