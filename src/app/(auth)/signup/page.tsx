"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, Phone, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { validateEmail, validatePhone, validateName, validatePassword } from "@/utils/validation";
import { useSiteImages } from "@/hooks/useSiteImages";

interface FormErrors {
    name?: string;
    email?: string;
    contact?: string;
    password?: string;
    confirmPassword?: string;
}

export default function SignupPage() {
    const { getImageUrl } = useSiteImages();
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get("returnUrl");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const refFromUrl = searchParams.get("ref");
    const [referralCode, setReferralCode] = useState("");

    useEffect(() => {
        if (refFromUrl) {
            setReferralCode(refFromUrl);
        }
    }, [refFromUrl]);
    const clearFieldError = (field: keyof FormErrors) => {
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const form = e.currentTarget;
        const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
        const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
        const contact = (form.elements.namedItem("contact") as HTMLInputElement).value.trim();
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;
        const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;

        // Validate all fields
        const newErrors: FormErrors = {};

        if (!validateName(name))
            newErrors.name = "Name must be 2–60 characters (letters only).";

        if (!validateEmail(email))
            newErrors.email = "Please enter a valid email address.";

        if (!validatePhone(contact))
            newErrors.contact = "Contact number must be exactly 10 digits.";

        const passwordCheck = validatePassword(password);
        if (!passwordCheck.valid)
            newErrors.password = passwordCheck.message;

        if (password !== confirmPassword)
            newErrors.confirmPassword = "Passwords do not match.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error("Please fix the errors in the form.");
            return;
        }

        setErrors({});
        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
            const response = await axios.post("/api/register", {
                name,
                email,
                contact,
                password,
                referredBy: referralCode, // 🔥 THIS LINE
            });

            toast.success(response.data.message || "Signup successful! Please sign in.");
            const signinUrl = returnUrl ? `/signin?returnUrl=${encodeURIComponent(returnUrl)}` : "/signin";
            router.push(signinUrl);
        } catch (error: any) {
            console.error("Signup error:", error);
            const message = error?.response?.data?.message || "Signup failed. Please try again.";
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = (field: keyof FormErrors) =>
        `w-full text-black pl-10 pr-3 py-2 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276] focus:border-transparent transition-all ${errors[field] ? "border-red-400 bg-red-50" : "border-gray-200"}`;

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/50 p-4 sm:p-6 lg:p-8 font-body relative">
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
                <div className="bg-white p-5 sm:p-7 rounded-2xl shadow-xl border border-blue-50">
                    <div className="flex flex-col items-center mb-4 sm:mb-6">
                        <div className="relative w-full max-w-[220px] sm:max-w-[260px] aspect-[280/75]">
                            <Image
                                src={getImageUrl("SITE_LOGO", "/images/logo/logo-wide.webp")}
                                alt="Paarsh E-learning"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <h1 className="text-lg sm:text-xl font-bold text-[#2C4276] mt-2">Sign Up</h1>
                        <p className="text-gray-500 mt-1 text-center text-sm">
                            Join Paarsh E-learning today and start your learning journey
                        </p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-3" noValidate>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-2.5 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        {/* Full Name */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#2C4276]/60">
                                    <User size={18} />
                                </div>
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Full Name"
                                    className={inputClass("name")}
                                    required
                                    onChange={() => clearFieldError("name")}
                                />
                            </div>
                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#2C4276]/60">
                                    <Mail size={18} />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className={inputClass("email")}
                                    required
                                    onChange={() => clearFieldError("email")}
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                        </div>

                        {/* Contact */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Contact</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#2C4276]/60">
                                    <Phone size={18} />
                                </div>
                                <input
                                    name="contact"
                                    type="text"
                                    placeholder="Enter 10-digit number"
                                    className={inputClass("contact")}
                                    required
                                    maxLength={10}
                                    onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                        const target = e.target as HTMLInputElement;
                                        target.value = target.value.replace(/[^0-9]/g, "");
                                    }}
                                    onChange={() => clearFieldError("contact")}
                                />
                            </div>
                            {errors.contact && <p className="text-xs text-red-500">{errors.contact}</p>}
                        </div>
                        {/* Referral Code */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Referral Code (Optional)
                            </label>

                            <div className="relative">
                                <input
                                    type="text"
                                    name="referralCode"
                                    value={referralCode}
                                    onChange={(e) => setReferralCode(e.target.value)}
                                    placeholder="Enter referral code"
                                    className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]"
                                />
                            </div>
                        </div>
                        {/* Password */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#2C4276]/60">
                                    <Lock size={18} />
                                </div>
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min 8 chars, uppercase, number, symbol"
                                    className={`${inputClass("password")} pr-10`}
                                    required
                                    onChange={() => clearFieldError("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#2C4276] focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                            <p className="text-xs text-gray-400">Min 8 chars · 1 uppercase · 1 number · 1 special char</p>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#2C4276]/60">
                                    <Lock size={18} />
                                </div>
                                <input
                                    name="confirmPassword"
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Re-enter your password"
                                    className={`${inputClass("confirmPassword")} pr-10`}
                                    required
                                    onChange={() => clearFieldError("confirmPassword")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#2C4276] focus:outline-none"
                                >
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#2C4276] hover:bg-[#1e2e54] text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-md hover:shadow-lg disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        Sign Up <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                        <p className="text-gray-600 font-medium text-sm">
                            Already have an account?{" "}
                            <Link
                                href={returnUrl ? `/signin?returnUrl=${encodeURIComponent(returnUrl)}` : "/signin"}
                                className="text-[#2FA8E1] font-bold hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}


// "use client";

// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import { User, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, Phone, ArrowLeft } from "lucide-react";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { validateEmail, validatePhone, validateName, validatePassword } from "@/utils/validation";

// interface FormErrors {
//     name?: string;
//     email?: string;
//     contact?: string;
//     password?: string;
//     confirmPassword?: string;
// }

// export default function SignupPage() {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const returnUrl = searchParams.get("returnUrl");
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirm, setShowConfirm] = useState(false);
//     const [errors, setErrors] = useState<FormErrors>({});

//     const clearFieldError = (field: keyof FormErrors) => {
//         if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
//     };

//     const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         setError("");

//         const form = e.currentTarget;
//         const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
//         const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
//         const contact = (form.elements.namedItem("contact") as HTMLInputElement).value.trim();
//         const password = (form.elements.namedItem("password") as HTMLInputElement).value;
//         const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;

//         // Validate all fields
//         const newErrors: FormErrors = {};

//         if (!validateName(name))
//             newErrors.name = "Name must be 2–60 characters (letters only).";

//         if (!validateEmail(email))
//             newErrors.email = "Please enter a valid email address.";

//         if (!validatePhone(contact))
//             newErrors.contact = "Contact number must be exactly 10 digits.";

//         const passwordCheck = validatePassword(password);
//         if (!passwordCheck.valid)
//             newErrors.password = passwordCheck.message;

//         if (password !== confirmPassword)
//             newErrors.confirmPassword = "Passwords do not match.";

//         if (Object.keys(newErrors).length > 0) {
//             setErrors(newErrors);
//             toast.error("Please fix the errors in the form.");
//             return;
//         }

//         setErrors({});
//         setIsLoading(true);

//         try {
//             const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
//             const response = await axios.post(`${apiUrl}/api/register`, { name, email, contact, password });

//             toast.success(response.data.message || "Signup successful! Please sign in.");
//             const signinUrl = returnUrl ? `/signin?returnUrl=${encodeURIComponent(returnUrl)}` : "/signin";
//             router.push(signinUrl);
//         } catch (error: any) {
//             console.error("Signup error:", error);
//             const message = error?.response?.data?.message || "Signup failed. Please try again.";
//             setError(message);
//             toast.error(message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const inputClass = (field: keyof FormErrors) =>
//         `w-full text-black pl-10 pr-3 py-2 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276] focus:border-transparent transition-all ${errors[field] ? "border-red-400 bg-red-50" : "border-gray-200"}`;

//     return (
//         <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/50 p-4 sm:p-6 lg:p-8 font-body relative">
//             <Link
//                 href="/"
//                 className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 text-gray-500 hover:text-[#2C4276] transition-all font-medium text-sm group"
//             >
//                 <div className="p-2 rounded-full bg-white shadow-sm border border-gray-100 group-hover:border-[#2C4276]/20 group-hover:bg-blue-50 transition-all">
//                     <ArrowLeft size={18} />
//                 </div>
//                 <span className="hidden sm:inline">Back to Home</span>
//             </Link>
//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="w-full max-w-md">
//                 <div className="bg-white p-5 sm:p-7 rounded-2xl shadow-xl border border-blue-50">
//                     <div className="flex flex-col items-center mb-4 sm:mb-6">
//                         <div className="relative w-full max-w-[220px] sm:max-w-[260px] aspect-[280/75]">
//                             <Image
//                                 src="/images/logo/logo-wide.webp"
//                                 alt="Paarsh E-learning"
//                                 fill
//                                 className="object-contain"
//                                 priority
//                             />
//                         </div>
//                         <h1 className="text-lg sm:text-xl font-bold text-[#2C4276] mt-2">Sign Up</h1>
//                         <p className="text-gray-500 mt-1 text-center text-sm">
//                             Join Paarsh E-learning today and start your learning journey
//                         </p>
//                     </div>

//                     <form onSubmit={handleSignup} className="space-y-3" noValidate>
//                         {error && (
//                             <div className="bg-red-50 text-red-600 p-2.5 rounded-lg text-sm text-center">
//                                 {error}
//                             </div>
//                         )}

//                         {/* Full Name */}
//                         <div className="space-y-1">
//                             <label className="text-sm font-medium text-gray-700">Full Name</label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#2C4276]/60">
//                                     <User size={18} />
//                                 </div>
//                                 <input
//                                     name="name"
//                                     type="text"
//                                     placeholder="Full Name"
//                                     className={inputClass("name")}
//                                     required
//                                     onChange={() => clearFieldError("name")}
//                                 />
//                             </div>
//                             {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
//                         </div>

//                         {/* Email */}
//                         <div className="space-y-1">
//                             <label className="text-sm font-medium text-gray-700">Email Address</label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#2C4276]/60">
//                                     <Mail size={18} />
//                                 </div>
//                                 <input
//                                     name="email"
//                                     type="email"
//                                     placeholder="name@example.com"
//                                     className={inputClass("email")}
//                                     required
//                                     onChange={() => clearFieldError("email")}
//                                 />
//                             </div>
//                             {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
//                         </div>

//                         {/* Contact */}
//                         <div className="space-y-1">
//                             <label className="text-sm font-medium text-gray-700">Contact</label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#2C4276]/60">
//                                     <Phone size={18} />
//                                 </div>
//                                 <input
//                                     name="contact"
//                                     type="text"
//                                     placeholder="Enter 10-digit number"
//                                     className={inputClass("contact")}
//                                     required
//                                     maxLength={10}
//                                     onInput={(e: React.FormEvent<HTMLInputElement>) => {
//                                         const target = e.target as HTMLInputElement;
//                                         target.value = target.value.replace(/[^0-9]/g, "");
//                                     }}
//                                     onChange={() => clearFieldError("contact")}
//                                 />
//                             </div>
//                             {errors.contact && <p className="text-xs text-red-500">{errors.contact}</p>}
//                         </div>

//                         {/* Password */}
//                         <div className="space-y-1">
//                             <label className="text-sm font-medium text-gray-700">Password</label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#2C4276]/60">
//                                     <Lock size={18} />
//                                 </div>
//                                 <input
//                                     name="password"
//                                     type={showPassword ? "text" : "password"}
//                                     placeholder="Min 8 chars, uppercase, number, symbol"
//                                     className={`${inputClass("password")} pr-10`}
//                                     required
//                                     onChange={() => clearFieldError("password")}
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowPassword(!showPassword)}
//                                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#2C4276] focus:outline-none"
//                                 >
//                                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                                 </button>
//                             </div>
//                             {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
//                             <p className="text-xs text-gray-400">Min 8 chars · 1 uppercase · 1 number · 1 special char</p>
//                         </div>

//                         {/* Confirm Password */}
//                         <div className="space-y-1">
//                             <label className="text-sm font-medium text-gray-700">Confirm Password</label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#2C4276]/60">
//                                     <Lock size={18} />
//                                 </div>
//                                 <input
//                                     name="confirmPassword"
//                                     type={showConfirm ? "text" : "password"}
//                                     placeholder="Re-enter your password"
//                                     className={`${inputClass("confirmPassword")} pr-10`}
//                                     required
//                                     onChange={() => clearFieldError("confirmPassword")}
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowConfirm(!showConfirm)}
//                                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#2C4276] focus:outline-none"
//                                 >
//                                     {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
//                                 </button>
//                             </div>
//                             {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
//                         </div>

//                         <div className="pt-2">
//                             <button
//                                 type="submit"
//                                 disabled={isLoading}
//                                 className="w-full bg-[#2C4276] hover:bg-[#1e2e54] text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-md hover:shadow-lg disabled:opacity-70"
//                             >
//                                 {isLoading ? (
//                                     <Loader2 className="animate-spin" size={20} />
//                                 ) : (
//                                     <>
//                                         Sign Up <ArrowRight size={20} />
//                                     </>
//                                 )}
//                             </button>
//                         </div>
//                     </form>

//                     <div className="mt-4 pt-3 border-t border-gray-100 text-center">
//                         <p className="text-gray-600 font-medium text-sm">
//                             Already have an account?{" "}
//                             <Link
//                                 href={returnUrl ? `/signin?returnUrl=${encodeURIComponent(returnUrl)}` : "/signin"}
//                                 className="text-[#2FA8E1] font-bold hover:underline"
//                             >
//                                 Sign in
//                             </Link>
//                         </p>
//                     </div>
//                 </div>
//             </motion.div>
//         </div>
//     );
// }
