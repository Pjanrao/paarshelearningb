import QuestionManagement from "@/components/practice-test/admin/QuestionManagement";

export const metadata = {
  title: "Manage Questions | Practice Test Admin",
  description: "Manage questions for practice tests",
};

export default async function QuestionsPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  return <QuestionManagement testId={testId} />;
}
