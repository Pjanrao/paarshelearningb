"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetJobByIdQuery, useUpdateJobMutation } from "@/redux/api/jobApi";
import Link from "next/link";
import { ChevronLeft, Save } from "lucide-react";

export default function EditJob() {
    const { id } = useParams();
    const router = useRouter();
    const { data: job, isLoading: isFetching } = useGetJobByIdQuery(id as string);
    const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();

    const [form, setForm] = useState({
        title: "",
        company: "",
        location: "",
        type: "Full-time",
        salary: "",
        description: "",
        requirements: "",
        workMode: "",
        responsibilities: "",
        skills: "",
        education: "",
        isActive: true,
    });

    useEffect(() => {
        if (job) {
            setForm({
                title: job.title || "",
                company: job.company || "",
                location: job.location || "",
                type: job.type || "Full-time",
                salary: job.salary || "",
                description: job.description || "",
                requirements: Array.isArray(job.requirements) ? job.requirements.join("\n") : job.requirements || "",
                workMode: job.workMode || "Remote",
                responsibilities: job.responsibilities || "",
                skills: job.skills?.join(", ") || "",
                education: job.education || "",
                isActive: job.isActive ?? true,
            });
        }
    }, [job]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateJob({
                id: id as string, // ✅ FIXED
                ...form,
                skills: form.skills
                    ? form.skills.split(",").map((s) => s.trim())
                    : [],
                requirements: form.requirements
                    ? form.requirements.split("\n").filter((r) => r.trim() !== "").map((r) => r.trim())
                    : [],
            }).unwrap();

            router.push("/admin/jobs");
        } catch (error) {
            alert("Failed to update job.");
            console.error(error);
        }
    };
    if (isFetching) {
        return <div className="p-8 text-center text-gray-500 animate-pulse">Loading job details...</div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 w-full max-w-4xl mx-auto">
            <div className="mb-8">
                <Link href="/admin/jobs" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#2C4276] mb-4 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Jobs
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4276]">Edit Job: {job?.title}</h1>
                <p className="mt-1 text-sm text-gray-500">Update the job posting details below.</p>
            </div>

            <div className="bg-white border border-border/50 rounded-2xl shadow-service overflow-hidden">
                <form onSubmit={handleUpdate} className="p-6 sm:p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Job Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[#2C4276]/20 outline-none transition-all"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Company</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[#2C4276]/20 outline-none transition-all"
                                value={form.company}
                                onChange={(e) => setForm({ ...form, company: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[#2C4276]/20 outline-none transition-all"
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Job Type</label>
                            <select
                                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[#2C4276]/20 outline-none transition-all bg-white"
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
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Work Mode</label>
                            <select
                                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[#2C4276]/20 outline-none transition-all bg-white"
                                value={form.workMode}
                                onChange={(e) => setForm({ ...form, workMode: e.target.value })}
                            >
                                <option>Remote</option>
                                <option>Hybrid</option>
                                <option>On-site</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Salary Range</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[#2C4276]/20 outline-none transition-all"
                                value={form.salary}
                                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required
                                rows={5}
                                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[#2C4276]/20 outline-none transition-all resize-y"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Key Requirements</label>
                            <textarea
                                rows={5}
                                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[#2C4276]/20 outline-none transition-all resize-y"
                                value={form.requirements}
                                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                            ></textarea>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Responsibilities</label>
                            <textarea
                                rows={4}
                                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[#2C4276]/20 outline-none transition-all"
                                value={form.responsibilities}
                                onChange={(e) =>
                                    setForm({ ...form, responsibilities: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Skills</label>
                            <input
                                placeholder="React, Node.js, MongoDB"
                                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[#2C4276]/20 outline-none transition-all"
                                value={form.skills}
                                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Education</label>
                            <input
                                placeholder="e.g. B.Tech / MCA / Any Graduate"
                                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[#2C4276]/20 outline-none transition-all"
                                value={form.education}
                                onChange={(e) => setForm({ ...form, education: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-border/50">

                        <div className="flex items-center gap-4">



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
                                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-300 ${form.isActive ? "bg-[#2C4276]" : "bg-gray-300"
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
                            className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="flex items-center px-6 py-2.5 bg-[#2C4276] text-white font-semibold rounded-lg hover:bg-opacity-90 shadow-md disabled:opacity-70 transition-all active:scale-95"
                        >
                            {isUpdating ? "Saving..." : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Update Job
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}