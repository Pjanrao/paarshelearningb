"use client";

import { useState, useEffect } from "react";
import { Check, X, Trash2, Star, Search, Loader2 } from "lucide-react";

interface Testimonial {
    _id: string;
    name: string;
    course: string;
    rating: number;
    message: string;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
}

export default function TestimonialsAdminPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/testimonial?admin=true");
            const data = await response.json();
            if (data.success) {
                setTestimonials(data.data);
            }
        } catch (error) {
            console.error("Error fetching testimonials:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        setActionLoading(id);
        try {
            const response = await fetch(`/api/testimonial/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (response.ok) {
                setTestimonials((prev) =>
                    prev.map((t) => (t._id === id ? { ...t, status: status as any } : t))
                );
            }
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setActionLoading(null);
        }
    };

    const deleteTestimonial = async (id: string) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;

        setActionLoading(id);
        try {
            const response = await fetch(`/api/testimonial/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setTestimonials((prev) => prev.filter((t) => t._id !== id));
            }
        } catch (error) {
            console.error("Error deleting testimonial:", error);
        } finally {
            setActionLoading(null);
        }
    };

    const filteredTestimonials = testimonials.filter(
        (t) =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Testimonials Management</h1>
                    <p className="text-gray-500 dark:text-gray-400">Review and moderate student success stories.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search reviews..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-all"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Student</th>
                                <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Message</th>
                                <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Rating</th>
                                <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Status</th>
                                <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
                                        <p className="mt-2 text-gray-500">Loading testimonials...</p>
                                    </td>
                                </tr>
                            ) : filteredTestimonials.length > 0 ? (
                                filteredTestimonials.map((testimonial) => (
                                    <tr key={testimonial._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 dark:text-white">{testimonial.name}</div>
                                            <div className="text-sm text-blue-600 dark:text-blue-400">{testimonial.course}</div>
                                        </td>
                                        <td className="px-6 py-4 max-w-md">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 italic">"{testimonial.message}"</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-0.5">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${testimonial.status === "approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : testimonial.status === "rejected"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}>
                                                {testimonial.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 text-gray-500">
                                                {testimonial.status !== "approved" && (
                                                    <button
                                                        onClick={() => updateStatus(testimonial._id, "approved")}
                                                        disabled={actionLoading === testimonial._id}
                                                        className="p-2 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors cursor-pointer"
                                                        title="Approve"
                                                    >
                                                        <Check className="h-5 w-5" />
                                                    </button>
                                                )}
                                                {testimonial.status !== "rejected" && (
                                                    <button
                                                        onClick={() => updateStatus(testimonial._id, "rejected")}
                                                        disabled={actionLoading === testimonial._id}
                                                        className="p-2 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors cursor-pointer"
                                                        title="Reject"
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteTestimonial(testimonial._id)}
                                                    disabled={actionLoading === testimonial._id}
                                                    className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-500">
                                        No testimonials found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
