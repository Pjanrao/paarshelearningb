import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Toaster } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardLayout>{children}</DashboardLayout>
      <Toaster richColors position="top-right" />
    </>
  );
}