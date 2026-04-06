"use client";

import { useState } from "react";
import { X, Star } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { validateName, validateMessage, isRequired } from "@/utils/validation";

interface TestimonialFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

interface FormErrors {
    name?: string;
    course?: string;
    message?: string;
}

export default function TestimonialFormModal({ isOpen, onClose, onSuccess }: TestimonialFormModalProps) {
    const [form, setForm] = useState({
        name: "",
        course: "",
        message: "",
        rating: 5,
        imageUrl: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!isRequired(form.name))
            newErrors.name = "Full name is required.";
        else if (!validateName(form.name))
            newErrors.name = "Name must be 2–60 characters, letters only.";

        if (!isRequired(form.course))
            newErrors.course = "Course / Role is required.";
        else if (form.course.trim().length < 2)
            newErrors.course = "Course must be at least 2 characters.";

        if (!isRequired(form.message))
            newErrors.message = "Feedback message is required.";
        else if (!validateMessage(form.message, 10))
            newErrors.message = "Message must be at least 10 characters.";
        else if (form.message.trim().length > 1000)
            newErrors.message = "Message must not exceed 1000 characters.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        // Clear the error for this field as the user types
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await fetch("/api/testimonial", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Thank you! Your testimonial has been submitted for review.");
                onClose();
                if (onSuccess) onSuccess();
                setForm({ name: "", course: "", message: "", rating: 5, imageUrl: "" });
                setErrors({});
            } else {
                toast.error(data.error || "Submission failed. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting testimonial:", error);
            toast.error("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200 border border-white/10">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <X className="h-5 w-5 text-gray-400" />
                </button>

                <h2 className="text-2xl font-bold text-blue-950 dark:text-white mb-1">Share Your Story</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Tell us about your learning journey.</p>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. John Doe"
                                value={form.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className={`w-full px-3 py-2 text-sm rounded-lg border ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200 dark:border-gray-700"} dark:bg-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition`}
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>}
                        </div>

                        {/* Course / Role */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Course / Role <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. MERN Stack"
                                value={form.course}
                                onChange={(e) => handleChange("course", e.target.value)}
                                className={`w-full px-3 py-2 text-sm rounded-lg border ${errors.course ? "border-red-400 bg-red-50" : "border-gray-200 dark:border-gray-700"} dark:bg-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition`}
                            />
                            {errors.course && <p className="text-xs text-red-500 mt-0.5">{errors.course}</p>}
                        </div>
                    {/* Image URL (Optional) */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            Image URL <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <input
                            type="url"
                            placeholder="e.g. https://example.com/photo.jpg"
                            value={form.imageUrl}
                            onChange={(e) => handleChange("imageUrl", e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                        />
                    </div>
                    </div>

                    {/* Star Rating */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Your Rating</label>
                        <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setForm({ ...form, rating: star })}
                                    className="focus:outline-none transition-transform active:scale-90"
                                >
                                    <Star
                                        className={`h-6 w-6 ${star <= form.rating
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-200 dark:text-gray-600"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            placeholder="What did you like about the course? (min 10 characters)"
                            value={form.message}
                            onChange={(e) => handleChange("message", e.target.value)}
                            maxLength={1000}
                            className={`w-full px-3 py-2 text-sm rounded-lg border ${errors.message ? "border-red-400 bg-red-50" : "border-gray-200 dark:border-gray-700"} dark:bg-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition min-h-[80px]`}
                        />
                        <div className="flex justify-between items-center">
                            {errors.message
                                ? <p className="text-xs text-red-500">{errors.message}</p>
                                : <span />
                            }
                            <span className="text-xs text-gray-400">{form.message.length}/1000</span>
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-900 text-white font-bold text-base shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {loading ? "Submitting..." : "Post Testimonial"}
                    </button>
                </form>
            </div>
            <Toaster position="bottom-right" />
        </div>
    );
}
