"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsCollapsed(true); // ✅ closed on mobile
    }
  }, []);

  const authState = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const isAdminRoute = pathname.startsWith("/admin");

  const legacyToken = authState.token;
  const legacyRole = authState.role;

  const adminToken = authState.adminToken;
  const adminRole = authState.adminRole;

  const studentToken = authState.studentToken;
  const studentRole = authState.studentRole;

  let activeToken = legacyToken;
  let activeRole = legacyRole;

  if (isAdminRoute) {
    activeToken = adminToken || legacyToken;
    activeRole = adminRole || legacyRole;
  } else {
    activeToken = studentToken || legacyToken;
    activeRole = studentRole || legacyRole;
  }

  useEffect(() => {
    // If on admin sign in, do not redirect
    if (pathname === "/admin/signin" || pathname === "/admin/signin/") {
      return;
    }

    if (!activeToken && !activeRole) {
      // Small timeout to allow hydration if it hasn't finished (should be fast though)
      const timer = setTimeout(() => {
        if (!activeToken && !activeRole) {
          router.push("/signin");
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeToken, activeRole, router, pathname]);

  // BYPASS DASHBOARD SHELL FOR ADMIN SIGN IN PAGE
  if (pathname === "/admin/signin" || pathname === "/admin/signin/") {
    return <>{children}</>;
  }

  if (!activeRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C4276]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* Full-width header on top */}
      <Topbar
        role={activeRole}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Sidebar + Content below header */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          role={activeRole}
          collapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />


        {/* 🔥 ADD THIS OVERLAY HERE */}
        {!isCollapsed && (
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setIsCollapsed(true)}
          />
        )}


        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
