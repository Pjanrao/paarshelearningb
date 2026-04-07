import StudentTestList from "@/components/practice-test/student/StudentTestList";

export const metadata = {
  title: "Available Practice Tests | Student Dashboard",
  description: "View and take practice tests",
};

export default function StudentTestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#2C4276] uppercase tracking-tight">Available Practice Tests</h1>
          <p className="text-gray-500 font-medium">Practice your skills and track your progress</p>
        </div>
      </div>
      <StudentTestList />
    </div>
  );
}
