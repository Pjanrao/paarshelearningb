"use client";

import { useCreateJobMutation } from "@/redux/api/jobApi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save } from "lucide-react";



export default function AddJob() {
    const router = useRouter();

    const [createJob, { isLoading }] = useCreateJobMutation();
    const [form, setForm] = useState({
        title: "",
        company: "",
        location: "",
        type: "Full-time",
        salary: "",
        description: "",
        requirements: "",

        // ✅ NEW
        workMode: "Remote",
        responsibilities: "",
        skills: "",
        education: "",
        isActive: true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createJob({
                title: form.title,
                company: form.company,
                location: form.location,
                salary: form.salary,
                description: form.description,

                // ✅ IMPORTANT (THIS WAS MISSING EFFECTIVELY)
                type: form.type,

                workMode: form.workMode,
                responsibilities: form.responsibilities,
                education: form.education,
                isActive: form.isActive,

                skills: form.skills
                    ? form.skills.split(",").map((s) => s.trim())
                    : [],

                requirements: form.requirements
                    ? form.requirements
                        .split("\n")
                        .filter((r) => r.trim() !== "")
                        .map((r) => r.trim())
                    : [],
            }).unwrap(); router.push("/admin/jobs");
        } catch (error) {
            alert("Failed to create job.");
            console.error(error);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 w-full max-w-4xl mx-auto">
            <div className="mb-8">
                <Link href="/admin/jobs" className="inline-flex items-center text-sm font-medium text-grey hover:text-primary mb-4 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Jobs
                </Link>
                <h1 className="text-2xl font-bold text-midnight_text">Add New Job</h1>
                <p className="mt-2 text-sm text-grey">Create a new job posting that will be visible on the careers page.</p>
            </div>

            <div className="bg-white border border-border/50 rounded-2xl shadow-service overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-midnight_text mb-1">
                                Job Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Senior Frontend Developer"
                                className="w-full px-4 py-2.5 rounded-lg border border-border/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-midnight_text mb-1">Company</label>
                            <input
                                type="text"
                                placeholder="e.g. Paarsh E-learning"
                                className="w-full px-4 py-2.5 rounded-lg border border-border/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                value={form.company}
                                onChange={(e) => setForm({ ...form, company: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-midnight_text mb-1">Location</label>
                            <input
                                type="text"
                                placeholder="e.g. Nashik / Remote"
                                className="w-full px-4 py-2.5 rounded-lg border border-border/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-midnight_text mb-1">Job Type</label>
                            <select
                                className="w-full px-4 py-2.5 rounded-lg border border-border/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Work Mode</label>
                            <select
                                className="w-full px-4 py-2.5 rounded-lg border"
                                value={form.workMode}
                                onChange={(e) => setForm({ ...form, workMode: e.target.value })}
                            >
                                <option>Remote</option>
                                <option>Hybrid</option>
                                <option>On-site</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-midnight_text mb-1">Salary Range</label>
                            <input
                                type="text"
                                placeholder="e.g. ₹5,00,000 - ₹8,00,000"
                                className="w-full px-4 py-2.5 rounded-lg border border-border/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                value={form.salary}
                                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-midnight_text mb-1">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required
                                rows={5}
                                placeholder="Write a comprehensive description about the role..."
                                className="w-full px-4 py-2.5 rounded-lg border border-border/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-y"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-midnight_text mb-1">Key Requirements </label>
                            <textarea
                                rows={5}
                                placeholder="e.g. 3+ years of React experience&#10;Strong understanding of CSS..."
                                className="w-full px-4 py-2.5 rounded-lg border border-border/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-y"
                                value={form.requirements}
                                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                            ></textarea>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Responsibilities</label>
                            <textarea
                                rows={4}
                                placeholder="Define key responsibilities (e.g. Develop UI components, Collaborate with team, Optimize performance...)"
                                className="w-full px-4 py-2.5 rounded-lg border border-border/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                value={form.responsibilities}
                                onChange={(e) =>
                                    setForm({ ...form, responsibilities: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Education</label>
                            <input
                                placeholder="e.g. B.Tech / MCA / Any Graduate"
                                className="w-full px-4 py-2.5 rounded-lg border border-border/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                value={form.education}
                                onChange={(e) => setForm({ ...form, education: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Skills</label>
                            <input
                                placeholder="e.g. React, Node.js, MongoDB, Tailwind CSS"
                                className="w-full px-4 py-2.5 rounded-lg border border-border/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                value={form.skills}
                                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-border/50">

                        <div className="flex items-center gap-4">

                            {/* Label */}

                            {/* Status Text */}
                            <span
                                className={`text-sm font-medium ${form.isActive ? "text-green-600" : "text-red-500"
                                    }`}
                            >
                                {form.isActive ? "Active" : "Inactive"}
                            </span>

                            {/* Toggle */}
                            <button
                                type="button"
                                onClick={() =>
                                    setForm({ ...form, isActive: !form.isActive })
                                }
                                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-300 ${form.isActive ? "bg-primary" : "bg-gray-300"
                                    }`}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-all duration-300 ${form.isActive ? "translate-x-6" : "translate-x-1"
                                        }`}
                                />
                            </button>

                        </div>
                    </div>
                    <div className="pt-4 border-t border-border/50 flex justify-end gap-4">
                        <Link
                            href="/admin/jobs"
                            className="px-6 py-2.5 rounded-[30px] border border-border/50 text-midnight_text font-medium hover:bg-section transition-all"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center px-6 py-2.5 bg-primary text-white font-medium rounded-[30px] hover:bg-primary/90 shadow-lg shadow-primary/20 disabled:opacity-70 transition-all"
                        >
                            {isLoading ? "Saving..." : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Job
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}