import TestInterface from "@/components/practice-test/student/TestInterface";

export const metadata = {
  title: "Test in Progress | Student Dashboard",
  description: "Taking your practice test",
};

export default async function StudentTestInteractionPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  return (
      <TestInterface testId={testId} />
  );
}
