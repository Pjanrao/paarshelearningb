"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Send, Mail, Phone, MapPin } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { validateEmail, validatePhone } from "@/utils/validation";


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

            <main className="container mx-auto px-4 max-w-7xl relative z-10 pt-24 pb-8 md:pt-32 lg:pt-16 lg:pb-16">
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
                                    <Link href="mailto:paarshelearning@gmail.com" className="text-lg font-black text-[#2B4278] dark:text-white hover:text-[#01A0E2] transition-colors truncate block">paarshelearning@gmail.com</Link>
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
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-8 lg:p-10 mt-3 border border-slate-100 dark:border-white/5 shadow-2xl shadow-[#2B4278]/10 dark:shadow-none relative z-10">
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
                                            <option value="Python Full Stack Development"> Python Full Stack Development</option>
                                            <option value="Data Science">Data Science</option>
                                            <option value="Machine Learning">Machine Learning</option>
                                            <option value="UI/UX Design">UI/UX Design</option>
                                            <option value="Digital Marketing">Digital Marketing</option>
                                            <option value="Mern Stack Development">Mern Stack Development</option>
                                            <option value="Python Programming">Python Programming</option>
                                            <option value="NLP with Deep Learning">NLP with Deep Learning</option>
                                            <option value="Generative AI">Generative AI</option>
                                            <option value="Wordpress Development">Wordpress Development</option>
                                            <option value="Tableau">Tableau</option>
                                            <option value="SQL for Data Science">SQL for Data Science</option>
                                            <option value="Rust Programming">Rust Programming</option>
                                            <option value="React Native Development">React Native Development</option>
                                            <option value="React Development">React Development</option>
                                            <option value="Power BI">Power BI</option>
                                            <option value="PHP Web Development">PHP Web Development</option>
                                            <option value="Mobile App Development">Mobile App Development</option>
                                            <option value="Kotlin Development">Kotlin Development</option>
                                            <option value="Java Programming">Java Programming</option>
                                            <option value="Java Full Stack">Java Full Stack</option>
                                            <option value="ios Development">ios Development</option>
                                            <option value="Full Stack Web Development">Full Stack Web Development</option>
                                            <option value="Front End Development">Front End Development</option>
                                            <option value="Flutter Development">Flutter Development</option>
                                            <option value="Data Architecture">Data Architecture</option>
                                            <option value="Cloud Computing">Cloud Computing</option>
                                            <option value="C++ Programming Language">C++ Programming Language</option>
                                            <option value="C Programming Language">C Programming Language</option>
                                            <option value="Backend Development">Backend Development</option>
                                            <option value="Network Security">Network Security</option>
                                            <option value="Artificial Intelligence">Artificial Intelligence</option>
                                            <option value="Game Development">Game Development</option>
                                            <option value="Chatgpt for Scrum Masters">Chatgpt for Scrum Masters</option>
                                            <option value="API & Automation Testing ">API & Automation Testing </option>
                                            <option value="Software Testing">Software Testing</option>
                                            <option value="Ethical Hacking">Ethical Hacking</option>
                                            <option value="Project Manager">Project Manager</option>
                                            <option value="Salesforce Development">Salesforce Development</option>
                                            <option value="Data Analytics">Data Analytics</option>
                                            <option value=".Net Development">.Net Development</option>
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