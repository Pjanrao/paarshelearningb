"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { validateEmail } from "@/utils/validation";
import { useDispatch } from "react-redux";
import { setAuth } from "@/redux/authSlice";

export default function LoginPage() {
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

    // Frontend validation
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
      const res = await axios.post(`${apiUrl}/api/login`, { email, password });
      const data = res.data;

      toast.success("Login successful!");

      // Update Redux and localStorage (Admin Panel Support)
      dispatch(setAuth({
        token: data.token,
        role: data.role,
        user: { name: data.name, email: data.email, contact: data.contact, image: data.image }
      }));
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email, contact: data.contact, image: data.image, role: data.role }));

      // Cookies for Middleware/SSR
      document.cookie = `token=${data.token}; path=/; Max-Age=86400`;
      document.cookie = `role=${data.role}; path=/; Max-Age=86400`;

      if (returnUrl) {
        router.push(returnUrl);
      } else if (data.role === "admin") {
        router.push("/admin");
      } else if (data.role === "teacher") {
        router.push("/teacher");
      } else if (data.role === "student") {
        router.push("/student");
      } else {
        router.push("/");
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md">

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
            <h1 className="text-lg sm:text-xl font-bold text-[#2C4276] mt-4">Sign In</h1>
            <p className="text-gray-500 mt-2 text-center text-sm">
              Please enter your details to sign in to your account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5" noValidate autoComplete="off">
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
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="w-full text-black pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276] focus:border-transparent transition-all"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#2FA8E1] hover:text-[#2C4276] hover:underline font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#2C4276]/60">
                  <Lock size={18} />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full text-black pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276] focus:border-transparent transition-all"
                  autoComplete="new-password"
                  required
                  minLength={6}
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2C4276] hover:bg-[#1e2e54] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign In <LogIn size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600 font-medium">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-[#2FA8E1] font-bold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}