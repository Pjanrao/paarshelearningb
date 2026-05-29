"use client";

import { usePathname } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Bypass DashboardLayout (and its auth redirect) for public teacher pages
  if (pathname.startsWith("/teacher/register")) {
    return <>{children}</>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
