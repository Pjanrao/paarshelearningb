"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsCollapsed(true); // ✅ closed on mobile
    }
  }, []);

  const { token, role } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!token && !role) {
      // Small timeout to allow hydration if it hasn't finished (should be fast though)
      const timer = setTimeout(() => {
        if (!token && !role) {
          router.push("/signin");
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [token, role, router]);

  if (!role) {
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
        role={role}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Sidebar + Content below header */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          role={role}
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
