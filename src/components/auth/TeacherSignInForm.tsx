"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, LogIn, Loader2, Eye, EyeOff, BookOpenCheck } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { validateEmail } from "@/utils/validation";
import { useDispatch } from "react-redux";
import { setTeacherAuth } from "@/redux/authSlice";
import { useSiteImages } from "@/hooks/useSiteImages";

export default function TeacherSignInForm() {
    const { getImageUrl } = useSiteImages();
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const returnUrl = searchParams.get("returnUrl");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const form = e.currentTarget;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;

        if (!validateEmail(email)) {
            toast.error("Please enter a valid email address.");
            setError("Please enter a valid email address.");
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            setError("Password must be at least 6 characters.");
            setIsLoading(false);
            return;
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
            let res = await axios.post(`${apiUrl}/api/login`, { email, password });
            let data = res.data;

            if (data.warning === "already_logged_in") {
                const confirmed = window.confirm(data.message);
                if (confirmed) {
                    res = await axios.post(`${apiUrl}/api/login`, { email, password, force: true });
                    data = res.data;
                } else {
                    setIsLoading(false);
                    return;
                }
            }

            if (data.role !== "teacher") {
                const errorMsg = "Access denied. Teacher credentials required.";
                toast.error(errorMsg);
                setError(errorMsg);
                setIsLoading(false);
                return;
            }

            toast.success("Faculty Login successful!");

            dispatch(setTeacherAuth({
                token: data.token,
                role: data.role,
                user: { _id: data._id, name: data.name, email: data.email, contact: data.contact, image: data.image }
            }));

            localStorage.setItem("teacherToken", data.token);
            localStorage.setItem("teacherRole", data.role);
            localStorage.setItem("teacherUser", JSON.stringify({ _id: data._id, name: data.name, email: data.email, contact: data.contact, image: data.image, role: data.role }));

            document.cookie = `teacherToken=${data.token}; path=/; Max-Age=86400`;
            document.cookie = `teacherRole=${data.role}; path=/; Max-Age=86400`;

            if (returnUrl) {
                router.push(returnUrl);
            } else {
                router.push("/teacher");
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || "Login failed. Please check your credentials.";
            if (message !== "User not found") {
                console.error("Login error:", error);
            }
            setError(message);
            if (message !== "User not found") {
                toast.error(message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-[420px]"
        >
            <div className="relative p-8 sm:p-10 rounded-[32px] bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.4)] text-black overflow-hidden z-10">

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-[100px] -z-10 mix-blend-multiply opacity-50 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-100 rounded-tr-[100px] -z-10 mix-blend-multiply opacity-50 blur-2xl"></div>

                <div className="flex flex-col items-center mb-8 relative z-20">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2C4276] to-blue-500 shadow-lg shadow-blue-500/30 flex items-center justify-center mb-6 transform -rotate-6">
                        <BookOpenCheck size={32} className="text-white transform rotate-6" />
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C4276] tracking-tight">Faculty Portal</h1>
                    <p className="text-gray-500 mt-2 text-center text-sm font-medium tracking-wide">
                        Manage your courses, students, and progress seamlessly.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5" noValidate autoComplete="off">
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="bg-red-50/80 backdrop-blur-sm text-red-600 p-3 rounded-xl border border-red-100 text-sm text-center font-medium shadow-sm"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-2 group">
                        <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2C4276] transition-colors">
                                <Mail size={18} strokeWidth={2.5} />
                            </div>
                            <input
                                name="email"
                                type="email"
                                placeholder="faculty@paarsh.com"
                                className="w-full text-black pl-11 pr-4 py-3.5 bg-gray-50/50 hover:bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:bg-white focus:border-[#2C4276] focus:ring-4 focus:ring-[#2C4276]/10 transition-all font-medium placeholder:font-normal placeholder:text-gray-400"
                                autoComplete="off"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2 group">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-bold text-gray-700">Password</label>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2C4276] transition-colors">
                                <Lock size={18} strokeWidth={2.5} />
                            </div>
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full text-black pl-11 pr-12 py-3.5 bg-gray-50/50 hover:bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:bg-white focus:border-[#2C4276] focus:ring-4 focus:ring-[#2C4276]/10 transition-all font-medium tracking-wide placeholder:tracking-normal placeholder:font-normal placeholder:text-gray-400"
                                autoComplete="new-password"
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-1 pr-3 pl-3 flex items-center text-gray-400 hover:text-[#2C4276] hover:bg-gray-100 my-2 rounded-xl transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full relative group overflow-hidden bg-[#2C4276] text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_5px_15px_rgba(44,66,118,0.3)] hover:shadow-[0_8px_20px_rgba(44,66,118,0.4)] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[0_5px_15px_rgba(44,66,118,0.3)] mt-6"
                    >
                        {/* Glossy overlay */}
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-2xl"></div>

                        <span className="relative z-10 flex items-center gap-2">
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Enter Dashboard <LogIn size={20} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </span>
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center flex flex-col gap-3">
                    <Link href="/forgot-password" className="text-sm font-semibold text-gray-500 hover:text-[#2C4276] transition-colors">
                        Forgot your password?
                    </Link>
                    <p className="text-gray-600 font-medium text-sm">
                        Not registered yet?{" "}
                        <Link
                            href="/teacher/register"
                            className="text-[#2FA8E1] font-bold hover:text-blue-600 hover:underline underline-offset-2 transition-all"
                        >
                            Apply as Faculty
                        </Link>
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
