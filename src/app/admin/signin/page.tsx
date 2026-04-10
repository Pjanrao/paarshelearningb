"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SignInForm from "@/components/auth/SignInForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-[#2C4276] p-4 sm:p-6 lg:p-8 font-body text-white relative">
      <Link
        href="/"
        className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 text-gray-300 hover:text-white transition-all font-medium text-sm group"
      >
        <div className="p-2 rounded-full bg-white/10 shadow-sm border border-white/20 group-hover:border-white/40 group-hover:bg-white/20 transition-all">
          <ArrowLeft size={18} />
        </div>
        <span className="hidden sm:inline">Back to Website</span>
      </Link>

      <SignInForm isAdmin={true} />
    </div>
  );
}
