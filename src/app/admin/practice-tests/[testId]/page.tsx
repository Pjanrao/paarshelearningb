import QuestionManagement from "@/components/practice-test/admin/QuestionManagement";

export const metadata = {
  title: "Manage Questions | Practice Test Admin",
  description: "Manage questions for practice tests",
};

export default function QuestionsPage({ params }: { params: { testId: string } }) {
  return <QuestionManagement testId={params.testId} />;
}
