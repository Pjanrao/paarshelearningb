"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TeacherSignInForm from "@/components/auth/TeacherSignInForm";
import Image from "next/image";

export default function TeacherSignInPage() {
    return (
        <div className="flex min-h-screen items-center justify-center font-body text-black relative bg-[#f4f7fb] overflow-hidden">

            {/* Background aesthetic blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100 mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-teal-100 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-100 mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
            </div>

            <Link
                href="/"
                className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 text-gray-500 hover:text-[#2C4276] transition-all font-medium text-sm z-50 group"
            >
                <div className="p-2.5 rounded-full bg-white/80 backdrop-blur shadow-sm border border-gray-200 group-hover:border-[#2C4276]/30 group-hover:bg-white transition-all transform group-hover:-translate-x-1">
                    <ArrowLeft size={18} strokeWidth={2.5} />
                </div>
                <span className="hidden sm:inline font-bold">Back to Home</span>
            </Link>

            <div className="z-10 w-full max-w-[420px] px-4">
                <TeacherSignInForm />
            </div>
        </div>
    );
}
