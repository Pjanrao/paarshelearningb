"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetJobByIdQuery } from "@/redux/api/jobApi";
import {
    Building,
    MapPin,
    Briefcase,
    ChevronLeft,
    CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function JobDetails() {
    const { id } = useParams();
    const router = useRouter();

    const { data: job, isLoading, error } = useGetJobByIdQuery(id as string);

    if (isLoading) {
        return <div className="p-10 text-center">Loading...</div>;
    }

    if (error || !job) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Job not found</p>
            </div>
        );
    }

    const formatRequirements = (reqs: any) => {
        if (!reqs) return [];
        if (Array.isArray(reqs)) return reqs;
        return reqs.split("\n");
    };

    return (
        <div className="bg-gray-50/50 pt-24 pb-8 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
                {/* Navigation */}
                <Link
                    href="/careers"
                    className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-primary mb-6 transition-colors group"
                >
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Back to careers
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header Section */}
                    <div className="px-6 py-6 sm:px-8 border-b border-gray-100 bg-gradient-to-r from-blue-50/30 to-transparent">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                            <div className="flex-1">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
                                    {job.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-gray-600">
                                    <span className="flex items-center">
                                        <Building className="w-4 h-4 mr-1.5 text-primary/70" />
                                        {job.company || "Paarsh E-learning"}
                                    </span>
                                    <span className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-1.5 text-primary/70" />
                                        {job.location}
                                    </span>
                                    <span className="flex items-center">
                                        <Briefcase className="w-4 h-4 mr-1.5 text-primary/70" />
                                        {job.type}
                                    </span>
                                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded uppercase tracking-wider">
                                        {job.workMode}
                                    </span>
                                    {job.salary && (
                                        <span className="text-success font-bold text-base">
                                            ₹ {job.salary}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => router.push(`/careers/apply?jobId=${job._id}`)}
                                className="w-full md:w-auto px-8 py-3 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-xl transition-all active:scale-95 text-center"
                            >
                                Apply for this position
                            </button>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="px-6 py-8 sm:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Main Body */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* About */}
                            <section>
                                <h2 className="text-lg font-bold text-gray-900 border-l-4 border-primary pl-3 mb-4 uppercase tracking-wide">
                                    About the Role
                                </h2>
                                <div className="text-gray-600 leading-relaxed space-y-3">
                                    {job.description?.split("\n").map((p: string, i: number) => (
                                        <p key={i}>{p}</p>
                                    ))}
                                </div>
                            </section>

                            {/* Responsibilities */}
                            {job.responsibilities && (
                                <section>
                                    <h2 className="text-lg font-bold text-gray-900 border-l-4 border-primary pl-3 mb-4 uppercase tracking-wide">
                                        Responsibilities
                                    </h2>
                                    <div className="text-gray-600 leading-relaxed space-y-2">
                                        {job.responsibilities.split("\n").map((r: string, i: number) => (
                                            <div key={i} className="flex items-start">
                                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/40 mt-2 mr-3 flex-shrink-0" />
                                                <p>{r}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Requirements */}
                            {job.requirements && (
                                <section>
                                    <h2 className="text-lg font-bold text-gray-900 border-l-4 border-primary pl-3 mb-4 uppercase tracking-wide">
                                        Key Requirements
                                    </h2>
                                    <ul className="space-y-3">
                                        {formatRequirements(job.requirements).map((req: string, i: number) => (
                                            <li key={i} className="flex items-start text-gray-600">
                                                <CheckCircle2 className="w-5 h-5 mr-3 text-success flex-shrink-0 mt-0.5" />
                                                <span>{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {/* Education */}
                            {job.education && (
                                <section>
                                    <h2 className="text-lg font-bold text-gray-900 border-l-4 border-primary pl-3 mb-4 uppercase tracking-wide">
                                        Education
                                    </h2>
                                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        {job.education}
                                    </p>
                                </section>
                            )}
                        </div>

                        {/* Sticky Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6 space-y-6">
                                <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                                        <Briefcase className="w-5 h-5 mr-2 text-primary" />
                                        Job Overview
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Posted on</span>
                                            <span className="font-semibold text-gray-900">
                                                {new Date(job.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric"
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Location</span>
                                            <span className="font-semibold text-gray-900">{job.location}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Employment</span>
                                            <span className="font-semibold text-gray-900">
                                                {job.type}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Work Mode</span>
                                            <span className="font-semibold text-gray-900">{job.workMode}</span>
                                        </div>
                                    </div>

                                    {/* Skills in Sidebar */}
                                    {job.skills?.length > 0 && (
                                        <div className="mt-8">
                                            <h3 className="font-bold text-gray-900 mb-4 text-sm">Required Skills</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {job.skills.map((skill: string, i: number) => (
                                                    <span
                                                        key={i}
                                                        className="px-2.5 py-1 bg-white border border-gray-200 text-gray-600 rounded text-xs font-medium hover:border-primary/30 hover:text-primary transition-colors cursor-default"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-primary/5 rounded-xl p-5 border border-primary/10">
                                    <h4 className="text-sm font-bold text-primary mb-2">Ready to apply?</h4>
                                    <p className="text-xs text-gray-600 mb-4">Click below to start your application process with Paarsh E-learning.</p>
                                    <button
                                        onClick={() => router.push(`/careers/apply?jobId=${job._id}`)}
                                        className="w-full py-2 bg-primary text-white text-xs font-bold rounded uppercase tracking-widest hover:bg-primary/90 transition-colors"
                                    >
                                        Start Application
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}