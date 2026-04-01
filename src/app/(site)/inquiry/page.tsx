// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { ChevronRight, Send, Mail, Phone, MapPin } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";

// /**
//  * Inquiry Page
//  * Dedicated page for user inquiries with a comprehensive form
//  * Color Scheme:
//  * Primary: #2B4278 (Dark Blue)
//  * Secondary: #01A0E2 (Bright Blue/Cyan)
//  */
// const InquiryPage = () => {
//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         phone: "",
//         course: "",
//         message: "",
//     });
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsSubmitting(true);

//         try {
//             const loadingToast = toast.loading("Sending your inquiry...");

//             const response = await fetch("/api/inquiry", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ ...formData, source: "Inquiry Page" }),
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 toast.success(result.message || "Inquiry submitted successfully!", { id: loadingToast });
//                 setFormData({
//                     name: "",
//                     email: "",
//                     phone: "",
//                     course: "",
//                     message: "",
//                 });
//             } else {
//                 toast.error(result.error || "Failed to submit inquiry.", { id: loadingToast });
//             }
//         } catch (error) {
//             console.error("Inquiry error:", error);
//             toast.error("An error occurred. Please try again.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className="bg-white dark:bg-[#0f172a] transition-colors duration-300">
//             {/* Hero Section */}
//             <section className="relative w-full bg-gradient-to-b from-[#01A0E2]/5 to-white dark:from-slate-900 dark:to-[#0f172a] pt-20 pb-12 md:pt-32 md:pb-24 overflow-hidden">
//                 {/* Abstract Background Shapes */}
//                 <div className="absolute top-0 right-0 w-1/2 h-full bg-[#2B4278]/5 skew-x-12 transform translate-x-32 pointer-events-none"></div>
//                 <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#01A0E2]/5 rounded-full blur-3xl pointer-events-none"></div>

//                 <div className="container mx-auto px-4 max-w-7xl relative z-10">
//                     <div className="text-center max-w-3xl mx-auto">
//                         <nav className="flex items-center justify-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6 font-medium">
//                             <Link href="/" className="hover:text-[#01A0E2] transition-colors">Home</Link>
//                             <ChevronRight size={14} className="opacity-50" />
//                             <span className="text-gray-600 dark:text-gray-300">Inquiry</span>
//                         </nav>

//                         <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-[#2B4278] dark:text-white mb-4 md:mb-6 leading-tight">
//                             Send Us an <span className="text-[#01A0E2]">Inquiry</span>
//                         </h1>

//                         <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
//                             Have questions about our courses? Fill out the form below and our team will get back to you within 24 hours.
//                         </p>
//                     </div>
//                 </div>
//             </section>

//             {/* Main Content */}
//             <main className="container mx-auto px-4 max-w-4xl py-8 md:py-16 lg:py-24">
//                 <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 lg:p-12 border border-slate-100 dark:border-white/5 shadow-2xl shadow-[#2B4278]/5 dark:shadow-none">
//                     <div className="space-y-4 md:space-y-6 mb-8">
//                         <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#01A0E2]/10 dark:bg-[#01A0E2]/20 rounded-full border border-[#01A0E2]/20">
//                             <span className="w-2 h-2 bg-[#01A0E2] rounded-full animate-pulse"></span>
//                             <span className="text-xs font-bold text-[#01A0E2] uppercase tracking-widest">Inquiry Form</span>
//                         </div>

//                         <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#2B4278] dark:text-white leading-tight">
//                             Get In <span className="text-[#01A0E2]">Touch</span>
//                         </h2>
//                         <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg leading-relaxed">
//                             Fill out the form below and our counselor will get back to you within 24 hours.
//                         </p>
//                     </div>

//                     <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
//                         <div className="grid md:grid-cols-2 gap-4 md:gap-6">
//                             <div className="space-y-2">
//                                 <label className="text-sm font-bold text-[#2B4278] dark:text-slate-300 ml-2">Your Name *</label>
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     value={formData.name}
//                                     onChange={handleChange}
//                                     placeholder="Full name"
//                                     required
//                                     className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-[#01A0E2] focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-slate-300 text-sm md:text-base"
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <label className="text-sm font-bold text-[#2B4278] dark:text-slate-300 ml-2">Email Address *</label>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     placeholder="Email"
//                                     required
//                                     className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-[#01A0E2] focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-slate-300 text-sm md:text-base"
//                                 />
//                             </div>
//                         </div>

//                         <div className="space-y-2">
//                             <label className="text-sm font-bold text-[#2B4278] dark:text-slate-300 ml-2">Phone Number *</label>
//                             <input
//                                 type="tel"
//                                 name="phone"
//                                 value={formData.phone}
//                                 onChange={handleChange}
//                                 placeholder="Contact Number"
//                                 required
//                                 className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-[#01A0E2] focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-slate-300 text-sm md:text-base"
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <label className="text-sm font-bold text-[#2B4278] dark:text-slate-300 ml-2">Course Interested In</label>
//                             <select
//                                 name="course"
//                                 value={formData.course}
//                                 onChange={handleChange}
//                                 className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-[#01A0E2] focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-sm md:text-base"
//                             >
//                                 <option value="">Select a course</option>
//                                 <option value="Full Stack Development">Full Stack Development</option>
//                                 <option value="Data Science">Data Science</option>
//                                 <option value="Machine Learning">Machine Learning</option>
//                                 <option value="UI/UX Design">UI/UX Design</option>
//                                 <option value="Digital Marketing">Digital Marketing</option>
//                                 <option value="Other">Other</option>
//                             </select>
//                         </div>

//                         <div className="space-y-2">
//                             <label className="text-sm font-bold text-[#2B4278] dark:text-slate-300 ml-2">Your Message *</label>
//                             <textarea
//                                 name="message"
//                                 value={formData.message}
//                                 onChange={handleChange}
//                                 rows={4}
//                                 placeholder="How can we help you?"
//                                 required
//                                 className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-[#01A0E2] focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-slate-300 resize-none text-sm md:text-base"
//                             ></textarea>
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={isSubmitting}
//                             className="w-full bg-[#01A0E2] hover:bg-[#2B4278] text-white font-black py-4 md:py-5 px-8 md:px-10 rounded-xl md:rounded-2xl transition-all flex items-center justify-center gap-2 md:gap-3 shadow-xl shadow-[#01A0E2]/30 active:scale-95 group text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {isSubmitting ? "Sending..." : "Send Inquiry"}
//                             <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
//                         </button>
//                     </form>
//                 </div>

//                 {/* Contact Info Cards */}
//                 <div className="grid md:grid-cols-3 gap-6 mt-12">
//                     <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-white/5 shadow-lg text-center">
//                         <div className="w-12 h-12 bg-[#01A0E2] rounded-xl flex items-center justify-center mx-auto mb-4">
//                             <Phone className="text-white" size={20} />
//                         </div>
//                         <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Call Us</p>
//                         <Link href="tel:+919075201033" className="text-base font-bold text-[#2B4278] dark:text-white hover:text-[#01A0E2] transition-colors">
//                             +91 90752 01033
//                         </Link>
//                     </div>

//                     <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-white/5 shadow-lg text-center">
//                         <div className="w-12 h-12 bg-[#2B4278] rounded-xl flex items-center justify-center mx-auto mb-4">
//                             <Mail className="text-white" size={20} />
//                         </div>
//                         <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Email Us</p>
//                         <Link href="mailto:info@paarshelearning.com" className="text-sm font-bold text-[#2B4278] dark:text-white hover:text-[#01A0E2] transition-colors break-all">
//                             info@paarshelearning.com
//                         </Link>
//                     </div>

//                     <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-white/5 shadow-lg text-center">
//                         <div className="w-12 h-12 bg-[#01A0E2] rounded-xl flex items-center justify-center mx-auto mb-4">
//                             <MapPin className="text-white" size={20} />
//                         </div>
//                         <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Visit Us</p>
//                         <p className="text-sm font-bold text-[#2B4278] dark:text-white">
//                             Pune & Nashik
//                         </p>
//                     </div>
//                 </div>
//             </main>

//             <Toaster position="bottom-right" />
//         </div>
//     );
// };

// export default InquiryPage;




"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Send, Mail, Phone, MapPin } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { validateEmail, validatePhone } from "@/utils/validation";

/**
 * Inquiry Page
 * Dedicated page for user inquiries with a comprehensive form
 * Color Scheme:
 * Primary: #2B4278 (Dark Blue)
 * Secondary: #01A0E2 (Bright Blue/Cyan)
 */
const InquiryPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        course: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "phone") {
            const numericValue = value.replace(/\D/g, "").slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: numericValue }));
            return;
        }

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(formData.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (formData.phone && !validatePhone(formData.phone)) {
            toast.error("Please enter a valid 10-digit phone number.");
            return;
        }

        setIsSubmitting(true);
        const loadingToast = toast.loading("Sending your inquiry...");

        try {
            const response = await fetch("/api/inquiry", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData, type: "Inquiry Form" }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message || "Inquiry submitted successfully!", { id: loadingToast });
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    course: "",
                    message: "",
                });
            } else {
                toast.error(result.error || "Failed to submit inquiry.", { id: loadingToast });
            }
        } catch (error) {
            console.error("Inquiry error:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-[#0f172a] transition-colors duration-300 min-h-screen">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-[#2B4278]/5 dark:bg-[#2B4278]/10 skew-x-12 transform translate-x-32"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#01A0E2]/10 dark:bg-[#01A0E2]/20 rounded-full blur-3xl"></div>
            </div>

            <main className="container mx-auto px-4 max-w-7xl relative z-10 pt-12 pb-8 lg:pt-16 lg:pb-16">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                    {/* Left Column: Info & Hero */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6 md:space-y-10"
                    >
                        <nav className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 font-medium">
                            <Link href="/" className="hover:text-[#01A0E2] transition-colors">Home</Link>
                            <ChevronRight size={14} className="opacity-50" />
                            <span className="text-gray-600 dark:text-gray-300 font-bold">Inquiry</span>
                        </nav>

                        <div className="space-y-2">
                            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-[#2B4278] dark:text-white leading-tight">
                                Send Us an <br></br>
                                <span className="text-[#01A0E2] relative">
                                    Inquiry
                                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 318 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 9C60.5 4.5 151.5 2.5 315 9" stroke="#01A0E2" strokeWidth="6" strokeLinecap="round" />
                                    </svg>
                                </span>
                            </h1>
                            <p className="text-lg mt-4 text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-lg">
                                Let us know your requirements and our career advisors will reach out to assist you with the next steps.
                            </p>
                        </div>

                        {/* Contact Quick Info */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6 pt-4">
                            <div className="flex items-start gap-5 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-xl shadow-[#2B4278]/5 border border-slate-50 dark:border-white/5">
                                <div className="w-12 h-12 bg-[#01A0E2]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Phone className="text-[#01A0E2]" size={22} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Direct Call</p>
                                    <Link href="tel:+919075201033" className="text-lg font-black text-[#2B4278] dark:text-white hover:text-[#01A0E2] transition-colors">+91 90752 01033</Link>
                                </div>
                            </div>

                            <div className="flex items-start gap-5 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-xl shadow-[#2B4278]/5 border border-slate-50 dark:border-white/5">
                                <div className="w-12 h-12 bg-[#2B4278]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Mail className="text-[#2B4278] dark:text-[#a5b4fc]" size={22} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Email Support</p>
                                    <Link href="mailto:info@paarshelearning.com" className="text-lg font-black text-[#2B4278] dark:text-white hover:text-[#01A0E2] transition-colors truncate block">info@paarshelearning.com</Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Inquiry Form Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Form Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-8 lg:p-10 mt-3 border border-slate-100 dark:border-white/5 shadow-2xl shadow-[#2B4278]/10 dark:shadow-none relative z-10 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#01A0E2]/5 rounded-bl-full pointer-events-none"></div>

                            <div className="space-y-3 mb-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#01A0E2]/10 rounded-full">
                                    <span className="w-1.5 h-1.5 bg-[#01A0E2] rounded-full animate-pulse"></span>
                                    <span className="text-[10px] font-bold text-[#01A0E2] uppercase tracking-[0.2em]">Inquiry</span>
                                </div>
                                <h2 className="text-3xl font-black text-[#2B4278] dark:text-white tracking-tight">
                                    Get In <span className="text-[#01A0E2]">Touch</span>
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-[#2B4278] dark:text-slate-400 ml-2 uppercase">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder=""
                                            required
                                            className="w-full px-6 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-[#01A0E2] focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-slate-300 text-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-[#2B4278] dark:text-slate-400 ml-2 uppercase">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder=""
                                            required
                                            className="w-full px-6 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-[#01A0E2] focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-slate-300 text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-[#2B4278] dark:text-slate-400 ml-2 uppercase">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder=""
                                            required
                                            className="w-full px-6 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-[#01A0E2] focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-slate-300 text-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-[#2B4278] dark:text-slate-400 ml-2 uppercase">Interested Course</label>
                                        <select
                                            name="course"
                                            value={formData.course}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-[#01A0E2] focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-sm font-medium appearance-none"
                                        >
                                            <option value="">Select a course</option>
                                            <option value="Full Stack Development">Full Stack Development</option>
                                            <option value="Data Science">Data Science</option>
                                            <option value="Machine Learning">Machine Learning</option>
                                            <option value="UI/UX Design">UI/UX Design</option>
                                            <option value="Digital Marketing">Digital Marketing</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-[#2B4278] dark:text-slate-400 ml-2 uppercase">Message / Requirement</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Tell us what you are looking for..."
                                        required
                                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-[#01A0E2] focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-slate-300 resize-none text-sm font-medium"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-fit bg-[#01A0E2] hover:bg-[#2B4278] text-white font-black py-5 px-10 rounded-[1.5rem] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#01A0E2]/30 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed uppercase text-[13px] tracking-widest mt-4"
                                >
                                    {isSubmitting ? "Sending..." : "Send Inquiry"}
                                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </div>

                        {/* Sub Background Glow for Form */}
                        <div className="absolute -top-10 -right-10 w-full h-full bg-[#01A0E2]/5 blur-[100px] pointer-events-none -z-10"></div>
                    </motion.div>
                </div>
            </main>

            <Toaster position="bottom-right" />
        </div>
    );
};

export default InquiryPage;