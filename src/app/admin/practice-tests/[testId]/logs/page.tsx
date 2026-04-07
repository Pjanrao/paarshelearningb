import TestLogs from "@/components/practice-test/admin/TestLogs";

export const metadata = {
  title: "Test Logs | Admin",
  description: "View practice test logs and student attempts",
};

export default function TestLogsPage({ params }: { params: { testId: string } }) {
  return <TestLogs testId={params.testId} />;
}
