"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import {
    User,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    BookOpen,
    CalendarDays,
    Laptop,
    Users,
    FileText,
    CreditCard,
    ChevronRight,
    CheckCircle2,
    Send,
    Upload,
    X,
    StickyNote,
} from "lucide-react";
import { motion } from "framer-motion";

interface CourseOption {
    _id: string;
    name: string;
}

export default function CourseRegistrationPage() {
    const [courses, setCourses] = useState<CourseOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [form, setForm] = useState({
        name: "",
        email: "",
        contact: "",
        address: "",
        collegeName: "",
        course: "",
        attendMode: "",
        preferredJoiningDate: "",
        hasLaptop: "",
        referralName: "",
        preferredLocation: "",
        note: "",
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [paymentFile, setPaymentFile] = useState<File | null>(null);

    // Fetch active courses
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch("/api/courses?limit=100");
                if (res.ok) {
                    const data = await res.json();
                    setCourses(
                        (data.courses || [])
                            .filter((c: any) => c.status === "active")
                            .map((c: any) => ({ _id: c._id, name: c.name }))
                    );
                }
            } catch (err) {
                console.error("Failed to fetch courses:", err);
            }
        };
        fetchCourses();
    }, []);

    const validate = (): boolean => {
        const errs: Record<string, string> = {};
        if (!form.name.trim() || form.name.trim().length < 2) errs.name = "Full name is required (min 2 characters).";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "A valid email address is required.";
        if (!/^\d{10}$/.test(form.contact)) errs.contact = "A valid 10-digit contact number is required.";
        if (!form.address.trim() || form.address.trim().length < 5) errs.address = "Address is required (min 5 characters).";
        if (!form.collegeName.trim()) errs.collegeName = "College name is required.";
        if (!form.course) errs.course = "Please select a course.";
        if (!form.attendMode) errs.attendMode = "Please select an attend mode.";
        if (!form.preferredJoiningDate) errs.preferredJoiningDate = "Preferred joining date is required.";
        if (!form.hasLaptop) errs.hasLaptop = "Please specify laptop availability.";

        // File validations
        if (resumeFile) {
            const allowedResume = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "image/jpeg",
                "image/png",
            ];
            if (!allowedResume.includes(resumeFile.type)) errs.resume = "Resume must be PDF, DOC, DOCX, JPG, or PNG.";
            if (resumeFile.size > 5 * 1024 * 1024) errs.resume = "Resume must be under 5MB.";
        }
        if (paymentFile) {
            const allowedPay = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
            if (!allowedPay.includes(paymentFile.type)) errs.paymentScreenshot = "Payment screenshot must be JPG, PNG, WEBP, or PDF.";
            if (paymentFile.size > 5 * 1024 * 1024) errs.paymentScreenshot = "Payment screenshot must be under 5MB.";
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "contact") {
            const numericValue = value.replace(/\D/g, "").slice(0, 10);
            setForm((p) => ({ ...p, [name]: numericValue }));
            return;
        }
        setForm((p) => ({ ...p, [name]: value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Please fix the errors in the form.");
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading("Submitting your registration...");

        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                formData.append(key, value);
            });
            if (resumeFile) formData.append("resume", resumeFile);
            if (paymentFile) formData.append("paymentScreenshot", paymentFile);

            const res = await fetch("/api/course-registrations", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message || "Registration submitted successfully!", { id: loadingToast });
                setSubmitted(true);
            } else {
                toast.error(data.error || "Submission failed. Please try again.", { id: loadingToast });
            }
        } catch (err) {
            toast.error("An error occurred. Please try again.", { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (field: string) =>
        `w-full px-5 py-3.5 rounded-xl border ${errors[field] ? "border-red-400 ring-2 ring-red-100" : "border-slate-200 dark:border-slate-700"} bg-white dark:bg-slate-900/50 outline-none focus:ring-2 focus:ring-[#01A0E2]/30 focus:border-[#01A0E2] transition-all text-sm text-slate-800 dark:text-white placeholder:text-slate-400`;

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#01A0E2]/5 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-slate-100 dark:border-slate-800"
                >
                    <div className="w-20 h-20 mx-auto bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-[#2B4278] dark:text-white mb-3">Registration Submitted!</h2>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm md:text-base">
                        Your course registration has been submitted successfully. Our team will contact you shortly.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-[#01A0E2] hover:bg-[#2B4278] text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#01A0E2]/20"
                    >
                        Back to Home
                        <ChevronRight size={16} />
                    </Link>
                </motion.div>
                <Toaster position="bottom-right" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#01A0E2]/5 to-white dark:from-slate-950 dark:to-slate-900">
            {/* Hero */}
            <section className="relative w-full pt-24 pb-8 md:pt-32 md:pb-12 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[#2B4278]/5 skew-x-12 transform translate-x-32 pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#01A0E2]/5 rounded-full blur-3xl pointer-events-none" />

                <div className="container mx-auto px-4 max-w-4xl relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <nav className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-4 font-medium">
                            <Link href="/" className="hover:text-[#01A0E2] transition-colors">
                                Home
                            </Link>
                            <ChevronRight size={14} className="opacity-50" />
                            <span className="text-gray-600 dark:text-gray-300">Course Registration</span>
                        </nav>

                        <h1 className="text-3xl md:text-5xl font-black text-[#2B4278] dark:text-white mb-3 leading-tight">
                            Course <span className="text-[#01A0E2]">Registration</span>
                        </h1>
                        <p className="text-base text-gray-500 dark:text-gray-400 max-w-2xl">
                            Fill out the form below to register for your desired course. Our team will get in touch with you shortly to guide you through the next steps.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Form */}
            <section className="container mx-auto px-4 max-w-4xl pb-16 md:pb-24">
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-[#2B4278]/5 border border-slate-100 dark:border-slate-800 overflow-hidden"
                >
                    {/* Section 1: Personal Information */}
                    <div className="p-6 md:p-10 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-[#2B4278] rounded-xl flex items-center justify-center">
                                <User size={18} className="text-white" />
                            </div>
                            <h2 className="text-lg md:text-xl font-black text-[#2B4278] dark:text-white">Personal Information</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block ml-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name" className={inputClass("name")} />
                                {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block ml-1">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter your email" className={inputClass("email")} />
                                {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block ml-1">
                                    Contact Number <span className="text-red-500">*</span>
                                </label>
                                <input name="contact" type="tel" value={form.contact} onChange={handleChange} placeholder="10-digit mobile number" className={inputClass("contact")} />
                                {errors.contact && <p className="text-red-500 text-xs mt-1 ml-1">{errors.contact}</p>}
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block ml-1">
                                    Address <span className="text-red-500">*</span>
                                </label>
                                <input name="address" value={form.address} onChange={handleChange} placeholder="Your address" className={inputClass("address")} />
                                {errors.address && <p className="text-red-500 text-xs mt-1 ml-1">{errors.address}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Academic & Course Details */}
                    <div className="p-6 md:p-10 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-[#01A0E2] rounded-xl flex items-center justify-center">
                                <GraduationCap size={18} className="text-white" />
                            </div>
                            <h2 className="text-lg md:text-xl font-black text-[#2B4278] dark:text-white">Academic &amp; Course Details</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block ml-1">
                                    College Name <span className="text-red-500">*</span>
                                </label>
                                <input name="collegeName" value={form.collegeName} onChange={handleChange} placeholder="Your college name" className={inputClass("collegeName")} />
                                {errors.collegeName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.collegeName}</p>}
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block ml-1">
                                    Course <span className="text-red-500">*</span>
                                </label>
                                <select name="course" value={form.course} onChange={handleChange} className={inputClass("course")}>
                                    <option value="">Select a course</option>
                                    {courses.map((c) => (
                                        <option key={c._id} value={c.name}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.course && <p className="text-red-500 text-xs mt-1 ml-1">{errors.course}</p>}
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block ml-1">
                                    Attend Mode <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-wrap gap-3 mt-1">
                                    {["Online", "Offline", "Hybrid"].map((mode) => (
                                        <button
                                            key={mode}
                                            type="button"
                                            onClick={() => {
                                                setForm((p) => ({ ...p, attendMode: mode }));
                                                if (errors.attendMode) setErrors((p) => ({ ...p, attendMode: "" }));
                                            }}
                                            className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all ${form.attendMode === mode
                                                ? "bg-[#01A0E2] text-white border-[#01A0E2] shadow-lg shadow-[#01A0E2]/20"
                                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-[#01A0E2]/50"
                                                }`}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                                {errors.attendMode && <p className="text-red-500 text-xs mt-1 ml-1">{errors.attendMode}</p>}
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block ml-1">
                                    Preferred Joining Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="preferredJoiningDate"
                                    type="date"
                                    value={form.preferredJoiningDate}
                                    onChange={handleChange}
                                    className={inputClass("preferredJoiningDate")}
                                />
                                {errors.preferredJoiningDate && <p className="text-red-500 text-xs mt-1 ml-1">{errors.preferredJoiningDate}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block ml-1">
                                    Do you have a Laptop? <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-3 mt-1">
                                    {["Yes", "No"].map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => {
                                                setForm((p) => ({ ...p, hasLaptop: opt }));
                                                if (errors.hasLaptop) setErrors((p) => ({ ...p, hasLaptop: "" }));
                                            }}
                                            className={`px-6 py-2.5 rounded-xl text-sm font-bold border transition-all ${form.hasLaptop === opt
                                                ? "bg-[#2B4278] text-white border-[#2B4278] shadow-lg shadow-[#2B4278]/20"
                                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-[#2B4278]/50"
                                                }`}
                                        >
                                            <Laptop size={14} className="inline mr-1.5" />
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                                {errors.hasLaptop && <p className="text-red-500 text-xs mt-1 ml-1">{errors.hasLaptop}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Additional Information */}
                    <div className="p-6 md:p-10 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-[#2B4278]/80 rounded-xl flex items-center justify-center">
                                <StickyNote size={18} className="text-white" />
                            </div>
                            <h2 className="text-lg md:text-xl font-black text-[#2B4278] dark:text-white">Additional Information</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block ml-1">Referral Name</label>
                                <input name="referralName" value={form.referralName} onChange={handleChange} placeholder="If referred by someone" className={inputClass("referralName")} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block ml-1">Preferred Location</label>
                                <select
                                    name="preferredLocation"
                                    value={form.preferredLocation}
                                    onChange={handleChange}
                                    className={inputClass("preferredLocation")}
                                >
                                    <option value="">Select preferred location</option>
                                    <option value="Nashik">Nashik</option>
                                    <option value="Pune">Pune</option>
                                    <option value="Ahmedabad">Ahmedabad</option>
                                    <option value="Hyderabad">Hyderabad</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Surat">Surat</option>
                                    <option value="Bengaluru">Bengaluru</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block ml-1">Note / Remarks</label>
                                <textarea
                                    name="note"
                                    value={form.note}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Any additional information..."
                                    className={`${inputClass("note")} resize-none`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Documents */}
                    <div className="p-6 md:p-10 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-[#01A0E2]/80 rounded-xl flex items-center justify-center">
                                <FileText size={18} className="text-white" />
                            </div>
                            <h2 className="text-lg md:text-xl font-black text-[#2B4278] dark:text-white">Required Documents</h2>
                        </div>

                        <div className="flex justify-center">
                            {/* Resume Upload */}
                            <div className="w-full max-w-md">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block ml-1">Resume</label>
                                <div
                                    className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:border-[#01A0E2]/50 hover:bg-[#01A0E2]/5 ${resumeFile ? "border-green-400 bg-green-50/50 dark:bg-green-900/10" : "border-slate-200 dark:border-slate-700"
                                        }`}
                                    onClick={() => document.getElementById("resumeInput")?.click()}
                                >
                                    <input
                                        id="resumeInput"
                                        type="file"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        className="hidden"
                                        onChange={(e) => {
                                            setResumeFile(e.target.files?.[0] || null);
                                            if (errors.resume) setErrors((p) => ({ ...p, resume: "" }));
                                        }}
                                    />
                                    {resumeFile ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <FileText size={18} className="text-green-500" />
                                            <span className="text-sm font-medium text-green-700 dark:text-green-400 truncate max-w-[180px]">{resumeFile.name}</span>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setResumeFile(null);
                                                }}
                                                className="ml-1 text-red-400 hover:text-red-600"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                                            <p className="text-sm text-slate-500">Click to upload resume</p>
                                            <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX, JPG, PNG (max 5MB)</p>
                                        </>
                                    )}
                                </div>
                                {errors.resume && <p className="text-red-500 text-xs mt-1 ml-1">{errors.resume}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="p-6 md:p-10 bg-slate-50/50 dark:bg-slate-800/30">
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#01A0E2] hover:bg-[#2B4278] text-white font-black py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#01A0E2]/30 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Submit Registration
                                    <Send size={18} />
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.form>
            </section>

            <Toaster position="bottom-right" />
        </div>
    );
}
