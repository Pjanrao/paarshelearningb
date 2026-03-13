"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { validateEmail } from "@/utils/validation";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            toast.error("Please enter a valid email address.");
            setIsLoading(false);
            return;
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
            await axios.post(`${apiUrl}/api/auth/forgot-password`, { email });
            setIsSubmitted(true);
            toast.success("Reset link sent!");
        } catch (err: any) {
            console.error("Forgot password error:", err);
            const message = err?.response?.data?.message || "Failed to send reset link. Please try again later.";
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/50 p-4 sm:p-6 lg:p-8 font-body">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-blue-50">
                    <div className="flex flex-col items-center mb-6 sm:mb-8">
                        <div className="relative w-full max-w-[240px] sm:max-w-[280px] aspect-[280/75]">
                            <Image
                                src="/images/logo/logo-wide.webp"
                                alt="Paarsh E-learning"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        {!isSubmitted && (
                            <>
                                <h1 className="text-lg sm:text-xl font-bold text-[#2C4276] text-center mt-4">Reset Password</h1>
                                <p className="text-gray-500 mt-2 text-center text-sm px-2 sm:px-4">
                                    Enter your email address and we&apos;ll send you a link to reset your password.
                                </p>
                            </>
                        )}
                    </div>

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#2C4276]/60">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full text-black pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276] focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#2C4276] hover:bg-[#1e2e54] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    "Send Reset Link"
                                )}
                            </button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-4"
                        >
                            <div className="flex justify-center mb-4 text-green-500">
                                <CheckCircle2 size={48} />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Check your email</h2>
                            <p className="text-gray-500 mt-2 text-sm">
                                We've sent a password reset link to <br />
                                <span className="font-medium text-gray-900">{email}</span>
                            </p>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="mt-6 text-[#2FA8E1] font-semibold hover:underline text-sm"
                            >
                                Didn't receive email? Try again
                            </button>
                        </motion.div>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <Link
                            href="/signin"
                            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#2C4276] transition-colors text-sm font-medium"
                        >
                            <ArrowLeft size={16} /> Back to Sign In
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
