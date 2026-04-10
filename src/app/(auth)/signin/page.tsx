"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SignInForm from "@/components/auth/SignInForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/50 p-4 sm:p-6 lg:p-8 font-body text-black relative">
      <Link
        href="/"
        className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 text-gray-500 hover:text-[#2C4276] transition-all font-medium text-sm group"
      >
        <div className="p-2 rounded-full bg-white shadow-sm border border-gray-100 group-hover:border-[#2C4276]/20 group-hover:bg-blue-50 transition-all">
          <ArrowLeft size={18} />
        </div>
        <span className="hidden sm:inline">Back to Home</span>
      </Link>

      <SignInForm isAdmin={false} />
    </div>
  );
}