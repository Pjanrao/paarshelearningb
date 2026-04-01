"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState, Suspense } from "react";
import toast from "react-hot-toast";
import axios from "axios";

function ResetPasswordForm({ onVisibilityChange }: { onVisibilityChange: (visible: boolean) => void }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation Checks
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
        const hasNumber = /\d/;
        const isOnlyLetters = /^[A-Za-z]+$/;

        if (isOnlyLetters.test(password)) {
            toast.error("Password must contain at least one number and one special character.");
            setError("Password cannot contain only letters.");
            return;
        }

        if (!hasSpecialChar.test(password) || !hasNumber.test(password)) {
            toast.error("Include at least one number and one special character.");
            setError("Include at least one number and one special character.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
            await axios.post(`${apiUrl}/api/auth/reset-password`, { token, password });

            setIsSuccess(true);
            onVisibilityChange(false); 
            toast.success("Password reset successful!");
        } catch (err: any) {
            console.error("Reset password error:", err);
            const message = err?.response?.data?.message || "Failed to reset password. Link may be expired.";
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!token && token !== "dev-mode") {
        return (
            <div className="text-center">
                <h2 className="text-lg font-semibold text-red-600">Invalid Link</h2>
                <p className="text-gray-500 mt-2 text-sm">The password reset link is invalid or has expired.</p>
                <Link href="/signin" className="mt-4 inline-block text-[#2FA8E1] hover:underline font-medium">
                    Go back to Sign In
                </Link>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <div className="flex justify-center mb-4 text-green-500">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-xl font-bold text-[#2C4276]">Password Reset Successful!</h2>
                <p className="text-gray-500 mt-2 text-sm">Your password has been reset successfully. You can now sign in with your new password.</p>
                <Link
                    href="/signin"
                    className="mt-8 w-full inline-block bg-[#2C4276] text-white py-3 rounded-xl font-semibold hover:bg-[#1e2e54] transition-all text-center shadow-md">
                    Sign In Now
                </Link>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#2C4276]/60">
                        <Lock size={18} />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-black pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276] focus:border-transparent transition-all"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#2C4276] focus:outline-none"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#2C4276]/60">
                        <Lock size={18} />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-black pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276] focus:border-transparent transition-all"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2C4276] hover:bg-[#1e2e54] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-70 text-lg"
            >
                {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                ) : (
                    "Reset Password"
                )}
            </button>

        </form>
    );
}

export default function ResetPasswordPage() {
    const [headerVisible, setHeaderVisible] = useState(true);

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
                        {headerVisible && (
                            <>
                                <h1 className="text-lg sm:text-xl font-bold text-[#2C4276] text-center mt-4">Set New Password</h1>
                                <p className="text-gray-500 mt-2 text-center text-sm px-2 sm:px-4">
                                    Please enter your new password below.
                                </p>
                            </>
                        )}
                    </div>

                    <Suspense fallback={<div className="text-center py-8"><Loader2 className="animate-spin mx-auto text-[#2C4276]" size={32} /></div>}>
                        <ResetPasswordForm onVisibilityChange={setHeaderVisible} />
                    </Suspense>

                    {headerVisible && (
                        <div className="text-center mt-5 -mb-5">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-[#2FA8E1] hover:text-[#2C4276] font-semibold transition-colors italic">
                                or (Reset from link)
                            </Link>
                        </div>
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
