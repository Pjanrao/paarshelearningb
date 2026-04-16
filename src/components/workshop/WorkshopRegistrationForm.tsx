"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";

interface Props {
    workshopId: string;
    workshopTitle: string;
    onSuccess?: () => void;
}

export default function WorkshopRegistrationForm({ workshopId, workshopTitle, onSuccess }: Props) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        currentStatus: "Student",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/workshops/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, workshopId }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Successfully registered for the workshop!");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    currentStatus: "Student",
                    message: "",
                });
                if (onSuccess) onSuccess();
            } else {
                toast.error(data.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            toast.error("An error occurred. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-dark_border p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-[#2C4276] dark:text-white mb-2">Join Workshop</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Fill in your details to reserve your spot for <span className="text-blue-600 font-semibold">{workshopTitle}</span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <div className="relative">
                        <Input
                            required
                            placeholder="John Doe"
                            className="pl-10 h-12 bg-gray-50 dark:bg-darkmode border-gray-200 dark:border-gray-700 rounded-xl focus:ring-blue-600"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <Icon icon="solar:user-bold" className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Input
                                required
                                type="email"
                                placeholder="john@example.com"
                                className="pl-10 h-12 bg-gray-50 dark:bg-darkmode border-gray-200 dark:border-gray-700 rounded-xl focus:ring-blue-600"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <Icon icon="solar:letter-bold" className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                        <div className="relative">
                            <Input
                                required
                                placeholder="91XXXXXXXX"
                                className="pl-10 h-12 bg-gray-50 dark:bg-darkmode border-gray-200 dark:border-gray-700 rounded-xl focus:ring-blue-600"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                            <Icon icon="solar:phone-bold" className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Status</label>
                    <Select 
                        value={formData.currentStatus} 
                        onValueChange={(val) => setFormData({ ...formData, currentStatus: val })}
                    >
                        <SelectTrigger className="h-12 bg-gray-50 dark:bg-darkmode border-gray-200 dark:border-gray-700 rounded-xl">
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-darkmode border-gray-200 dark:border-gray-700">
                            <SelectItem value="Student">Student</SelectItem>
                            <SelectItem value="Working Professional">Working Professional</SelectItem>
                            <SelectItem value="Job Seeker">Job Seeker</SelectItem>
                            <SelectItem value="Entrepreneur">Entrepreneur</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Message (Optional)</label>
                    <Textarea
                        placeholder="Any specific questions for the instructor?"
                        className="bg-gray-50 dark:bg-darkmode border-gray-200 dark:border-gray-700 rounded-xl focus:ring-blue-600 min-h-[100px]"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                </div>

                <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            <span>Registering...</span>
                        </div>
                    ) : (
                        "Confirm Registration"
                    )}
                </Button>

                <p className="text-center text-[10px] text-gray-400 mt-4 uppercase font-bold tracking-widest">
                    Secured by Paarsh Enterprise Encryption
                </p>
            </form>
        </div>
    );
}
