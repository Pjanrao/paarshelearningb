// 


"use client";
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { validateEmail, validatePhone } from "@/utils/validation";

interface EnrollModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseName: string;
}

/**
 * EnrollModal Component
 * Modal for course enrollment with form
 * Color Scheme:
 * Primary: #2B4278 (Dark Blue)
 * Secondary: #01A0E2 (Bright Blue/Cyan)
 */
const EnrollModal = ({ isOpen, onClose, courseName }: EnrollModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: `I am interested in enrolling for the ${courseName} course.`
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(formData.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (!validatePhone(formData.phone)) {
            toast.error("Please enter a valid 10-digit phone number.");
            return;
        }

        // Simulate API call
        toast.success(`Thank you! Your inquiry for ${courseName} has been sent successfully.`);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#2B4278]/60 backdrop-blur-sm"
                    />

                    {/* Modal content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-white dark:bg-gray-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-[#01A0E2]/10 dark:border-gray-800"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#2B4278] to-[#01A0E2] p-8 text-white relative">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <Icon icon="solar:close-circle-linear" className="w-8 h-8" />
                            </button>
                            <h3 className="text-2xl md:text-3xl font-black mb-2">Enroll Now</h3>
                            <p className="opacity-90 font-medium">Start your journey with <span className="font-bold underline decoration-white/30">{courseName}</span></p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                                <div className="relative group">
                                    <Icon icon="solar:user-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#01A0E2] transition-colors" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Enter your name"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent focus:border-[#01A0E2]/30 focus:bg-white dark:focus:bg-gray-950 outline-none transition-all font-medium text-gray-700 dark:text-gray-200"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Email</label>
                                    <div className="relative group">
                                        <Icon icon="solar:letter-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#01A0E2] transition-colors" />
                                        <input
                                            required
                                            type="email"
                                            placeholder="Email address"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent focus:border-[#01A0E2]/30 focus:bg-white dark:focus:bg-gray-950 outline-none transition-all font-medium text-gray-700 dark:text-gray-200"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Phone</label>
                                    <div className="relative group">
                                        <Icon icon="solar:phone-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#01A0E2] transition-colors" />
                                        <input
                                            required
                                            type="tel"
                                            placeholder="Mobile number"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent focus:border-[#01A0E2]/30 focus:bg-white dark:focus:bg-gray-950 outline-none transition-all font-medium text-gray-700 dark:text-gray-200"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Inquiry Message</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent focus:border-[#01A0E2]/30 focus:bg-white dark:focus:bg-gray-950 outline-none transition-all font-medium text-gray-700 dark:text-gray-200 resize-none"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-5 bg-gradient-to-r from-[#2B4278] to-[#01A0E2] hover:from-[#01A0E2] hover:to-[#2B4278] text-white font-black text-xl rounded-2xl shadow-xl shadow-[#01A0E2]/20 transition-all hover:scale-[1.01] active:scale-[0.98] mt-4 flex items-center justify-center gap-3"
                            >
                                Confirm Enrollment
                                <Icon icon="solar:arrow-right-bold" className="w-6 h-6" />
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EnrollModal;