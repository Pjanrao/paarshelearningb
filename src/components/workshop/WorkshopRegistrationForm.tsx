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

const COUNTRY_CODES = [
    { code: '+91', country: '🇮🇳', name: 'India' },
    { code: '+1', country: '🇺🇸', name: 'USA/Canada' },
    { code: '+44', country: '🇬🇧', name: 'UK' },
    { code: '+61', country: '🇦🇺', name: 'Australia' },
    { code: '+971', country: '🇦🇪', name: 'UAE' },
];

export default function WorkshopRegistrationForm({ workshopId, workshopTitle, onSuccess }: Props) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        countryCode: "+91",
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
                body: JSON.stringify({ ...formData, phone: `${formData.countryCode}${formData.phone}`, workshopId }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Successfully registered for the workshop!");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    countryCode: "+91",
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

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <div className="relative">
                        <Input
                            required
                            placeholder="John Doe"
                            className="pl-10 h-10 bg-gray-50 dark:bg-darkmode border-gray-200 dark:border-gray-700 rounded-xl focus:ring-blue-600"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <Icon icon="solar:user-bold" className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Input
                                required
                                type="email"
                                placeholder="john@example.com"
                                className="pl-10 h-10 bg-gray-50 dark:bg-darkmode border-gray-200 dark:border-gray-700 rounded-xl focus:ring-blue-600"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <Icon icon="solar:letter-bold" className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                        <div className="flex w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-darkmode overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 transition-all h-10">
                            <div className="relative border-r border-gray-200 dark:border-gray-700 shrink-0 h-full">
                                <select
                                    value={formData.countryCode}
                                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                                    className="appearance-none bg-transparent pl-3 pr-6 py-2 outline-none cursor-pointer text-sm w-full h-full font-medium min-w-[50px] text-gray-700 dark:text-gray-300"
                                >
                                    {COUNTRY_CODES.map((country) => (
                                        <option key={country.code} value={country.code}>
                                            {country.country}
                                        </option>
                                    ))}
                                </select>
                                <Icon icon="solar:alt-arrow-down-linear" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" width="14" />
                            </div>
                            <div className="shrink-0 flex items-center justify-center px-2 bg-gray-200/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-semibold border-r border-gray-200 dark:border-gray-700 text-sm min-w-[45px]">
                                {formData.countryCode}
                            </div>
                            <input
                                type="text"
                                required
                                placeholder="Mobile Number"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                maxLength={10}
                                className="w-full px-3 py-2 bg-transparent outline-none font-medium placeholder:text-gray-400 text-sm text-gray-700 dark:text-gray-300"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Status</label>
                    <Select
                        value={formData.currentStatus}
                        onValueChange={(val) => setFormData({ ...formData, currentStatus: val })}
                    >
                        <SelectTrigger className="h-10 bg-gray-50 dark:bg-darkmode border-gray-200 dark:border-gray-700 rounded-xl">
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
                        className="bg-gray-50 dark:bg-darkmode border-gray-200 dark:border-gray-700 rounded-xl focus:ring-blue-600 min-h-[80px] p-3 text-sm"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all transform hover:scale-[1.02] active:scale-[0.98]"
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


            </form>
        </div>
    );
}
