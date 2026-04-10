"use client";

import { useState } from "react";
import {
    Search,
    ChevronDown,
    HelpCircle,
    MessageSquare,
    Info,
    ArrowRight
} from "lucide-react";
import Link from "next/link";

interface FAQItem {
    id: number;
    question: string;
    answer: string;
    category: string;
}

export default function FAQPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const categories = ["All", "Account", "Courses", "Certificates", "Billing"];

    const faqs: FAQItem[] = [
        {
            id: 1,
            category: "Account",
            question: "How do I reset my password?",
            answer: "To reset your password, go to the Sign In page and click on the 'Forgot Password' link. Follow the instructions sent to your email to create a new password."
        },
        {
            id: 2,
            category: "Courses",
            question: "Can I download course materials for offline viewing?",
            answer: "Yes, most course materials including videos and PDF resources can be downloaded for offline viewing through our mobile application. Desktop users can download specific resource files from the 'Resources' tab."
        },
        {
            id: 3,
            category: "Certificates",
            question: "How do I get a certificate after completing a course?",
            answer: "Once you have completed all the lessons and passed the final assessment (if applicable), your certificate will be automatically generated. You can view and download it from the 'Certificates' section in your dashboard."
        },
        {
            id: 4,
            category: "Billing",
            question: "What payment methods are accepted?",
            answer: "We accept all major credit/debit cards (Visa, Mastercard, American Express), PayPal, and various regional payment methods depending on your location."
        },
        {
            id: 5,
            category: "Courses",
            question: "How do I contact my instructor?",
            answer: "You can contact your instructor through the 'Q&A' tab in the course learning page or by sending a direct message if they have enabled that feature in their profile."
        }
    ];

    const filteredFaqs = faqs.filter(faq => {
        const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-full bg-white rounded-3xl p-8 lg:p-10 shadow-sm overflow-hidden border border-gray-100">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#2C4276] tracking-tight">Frequently Asked Questions</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Find answers to common questions about our platform
                    </p>
                </div>

                <div className="relative w-full lg:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search FAQs..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] transition-all text-sm text-slate-900 placeholder:text-slate-400 shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeCategory === category
                            ? "bg-[#2C4276] text-white shadow-lg shadow-[#2C4276]/20"
                            : "bg-gray-50 text-slate-600 hover:bg-gray-100"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* FAQ List (Accordion) */}
            <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                    <div
                        key={faq.id}
                        className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all hover:border-[#2C4276]/30"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full flex items-center justify-between p-4 text-left group transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-150 transition-transform"></div>
                                <span className={`text-base font-bold transition-colors ${openIndex === index ? "text-[#2C4276]" : "text-slate-700"
                                    }`}>
                                    {faq.question}
                                </span>
                            </div>
                            <div className={`p-2 rounded-lg bg-gray-50 transition-all ${openIndex === index ? "rotate-180 bg-[#2C4276]/10 text-[#2C4276]" : "text-slate-400"
                                }`}>
                                <ChevronDown size={20} />
                            </div>
                        </button>

                        {openIndex === index && (
                            <div className="px-10 pb-4 animate-in slide-in-from-top-2 duration-300">
                                <p className="text-slate-500 text-sm leading-relaxed border-t border-gray-50 pt-4">
                                    {faq.answer}
                                </p>
                            </div>
                        )}
                    </div>
                ))}

                {filteredFaqs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
                        <HelpCircle size={64} className="text-gray-200 mb-4" />
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em]">No questions found</p>
                    </div>
                )}
            </div>

            {/* Footer Help Section */}
            <div className="mt-12 bg-[#2C4276] rounded-3xl p-4 lg:p-10 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                    <MessageSquare size={120} />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                            <MessageSquare size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tight">Still Have Questions?</h3>
                            <p className="text-blue-100/70 text-base mt-1 max-w-lg font-medium leading-snug">
                                If you couldn't find the answer you were looking for, our support team is here to help you with any questions or concerns.
                            </p>
                        </div>
                    </div>
                    <Link href="/contact-us" className="bg-white text-[#2C4276] px-10 py-4 rounded-2xl text-sm font-black tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10 flex items-center gap-2">
                        CONTACT SUPPORT
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
}