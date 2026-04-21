"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetJobByIdQuery } from "@/redux/api/jobApi";
import {
    Building,
    MapPin,
    Briefcase,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Info,
    Target,
    Award,
    GraduationCap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
                {/* BREADCRUMB */}
                <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-[#2C4276] transition-colors font-medium">Home</Link>
                    <ChevronRight size={14} className="text-gray-400" />
                    <Link href="/careers" className="hover:text-[#2C4276] transition-colors font-medium">Careers</Link>
                    <ChevronRight size={14} className="text-gray-400" />
                    <span className="text-[#2C4276] font-semibold truncate max-w-[200px] sm:max-w-xs">{job.title}</span>
                </nav>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header Section */}
                    <div className="px-6 py-6 sm:px-8 border-b border-gray-100 bg-gradient-to-r from-blue-50/30 to-transparent">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                            <div className="flex-1">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-midnight_text tracking-tight mb-3">
                                    {job.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-gray-600">
                                    <span className="flex items-center">
                                        <Building className="w-4 h-4 mr-1.5 text-primary/70" />
                                        {job.company || "Paarsh E-learning"}
                                    </span>
                                    {/* <span className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-1.5 text-primary/70 flex-shrink-0" />
                                        <span className="truncate max-w-[150px] sm:max-w-none">
                                            {job.locations?.length > 0
                                                ? job.locations.join(" | ")
                                                : (job.location || "Location not specified")}
                                        </span>
                                    </span> */}
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
                    <div className="px-6 py-8 sm:px-8 grid grid-cols-1 lg:grid-cols-10 gap-8">
                        {/* Main Body */}
                        <div className="lg:col-span-7 space-y-6">
                            {/* About */}
                            <section className="bg-white rounded-xl p-6 border border-gray-100/80 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center">
                                        <Info className="w-6 h-6 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-bold text-midnight_text tracking-tight">
                                        About the Role
                                    </h2>
                                </div>
                                <div className="text-gray-600 leading-relaxed space-y-4 text-[1rem]">
                                    {job.description?.split("\n").map((p: string, i: number) => (
                                        <p key={i}>{p}</p>
                                    ))}
                                </div>
                            </section>

                            {/* Responsibilities */}
                            {job.responsibilities && (
                                <section className="bg-white rounded-xl p-6 border border-gray-100/80 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                                            <Target className="w-6 h-6 text-orange-500" />
                                        </div>
                                        <h2 className="text-xl font-bold text-midnight_text tracking-tight">
                                            Responsibilities
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {job.responsibilities.split("\n").filter((r: string) => r.trim() !== "").map((r: string, i: number) => (
                                            <div key={i} className="flex items-start p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                                <div className="w-2 h-2 rounded-full bg-orange-400 mt-2.5 mr-4 flex-shrink-0" />
                                                <p className="text-[1rem] text-gray-600 leading-relaxed">{r}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Requirements */}
                            {job.requirements && (
                                <section className="bg-white rounded-xl p-6 border border-gray-100/80 shadow-sm hover:shadow-md transition-shadow">

                                    {/* Header */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-success/5 flex items-center justify-center">
                                            <Award className="w-6 h-6 text-success" />
                                        </div>
                                        <h2 className="text-xl font-bold text-midnight_text tracking-tight">
                                            Key Requirements
                                        </h2>
                                    </div>

                                    {/* List */}
                                    <div className="space-y-2">
                                        {formatRequirements(job.requirements)
                                            .filter((req: string) => req.trim() !== "")
                                            .map((req: string, i: number) => (
                                                <div
                                                    key={i}
                                                    className="flex items-start gap-4 p-3 rounded-xl bg-gray-50/60 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                                                >
                                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1 flex-shrink-0">
                                                        <CheckCircle2 size={14} className="text-green-600" />
                                                    </div>

                                                    <p className="text-gray-700 text-[0.95rem] leading-relaxed font-medium">
                                                        {req}
                                                    </p>
                                                </div>
                                            ))}
                                    </div>

                                </section>
                            )}

                        </div>

                        {/* Sticky Sidebar */}
                        <div className="lg:col-span-3">
                            <div className="sticky top-6 space-y-3">
                                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-1 h-5 bg-primary/20 rounded-full" />
                                        <h3 className="font-bold text-midnight_text text-lg tracking-tight">
                                            Job Overview
                                        </h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center group">
                                            <span className="text-gray-400 font-medium text-sm">Posted on</span>
                                            <span className="font-bold text-midnight_text text-sm">
                                                {new Date(job.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric"
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-start border-t border-gray-50 pt-2 group">
                                            <span className="text-gray-400 font-medium text-sm w-1/3 mt-0.5">Location</span>
                                            <div className="flex flex-wrap gap-1.5 justify-end w-2/3">
                                                {job.locations?.length > 0 ? (
                                                    job.locations.map((loc: string, index: number) => (
                                                        <span key={index} className="px-2 py-1 bg-gray-50 rounded text-xs font-bold text-midnight_text border border-gray-100">
                                                            {loc}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="font-bold text-midnight_text text-sm text-right">
                                                        {job.location || "Location not specified"}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center border-t border-gray-50 pt-4 group">
                                            <span className="text-gray-400 font-medium text-sm">Employment</span>
                                            <span className="font-bold text-midnight_text text-sm">
                                                {job.type}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center border-t border-gray-50 pt-4 group">
                                            <span className="text-gray-400 font-medium text-sm">Work Mode</span>
                                            <span className="font-bold text-midnight_text text-sm">{job.workMode}</span>
                                        </div>
                                    </div>

                                    {/* Skills in Sidebar */}
                                    {job.skills?.length > 0 && (
                                        <div className="mt-10 pt-6 border-t border-gray-100">
                                            <h3 className="font-bold text-gray-400 mb-5 text-[0.7rem] uppercase tracking-[0.2em]">Required Skills</h3>
                                            <div className="flex flex-wrap gap-2.5">
                                                {job.skills.map((skill: string, i: number) => (
                                                    <span
                                                        key={i}
                                                        className="px-4 py-1.5 bg-gray-50 text-midnight_text rounded-full text-[0.75rem] font-bold hover:bg-primary hover:text-white hover:shadow-md hover:shadow-primary/20 transition-all cursor-default border border-gray-100"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Education Section under Start Application */}
                                {job.education && (
                                    <div className="bg-[#2C4276]/5 rounded-xl p-6 border border-[#2C4276]/10 shadow-sm">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                                <GraduationCap className="w-5 h-5 text-[#2C4276]" />
                                            </div>
                                            <h4 className="text-lg font-bold text-midnight_text tracking-tight">
                                                Education
                                            </h4>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {job.education}
                                        </p>
                                    </div>
                                )}


                                {/* Start Application Card */}
                                <div className="bg-[#2C4276] rounded-xl p-6 text-white shadow-xl shadow-[#2C4276]/20 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl transition-transform group-hover:scale-110" />
                                    <h4 className="text-lg font-bold mb-3 relative z-10">Ready to apply?</h4>
                                    <p className="text-sm text-white/70 mb-6 leading-relaxed relative z-10 font-medium">Click below to start your application process with Paarsh E-learning.</p>
                                    <button
                                        onClick={() => router.push(`/careers/apply?jobId=${job._id}`)}
                                        className="w-full py-4 bg-white text-[#2C4276] text-sm font-extrabold rounded-2xl uppercase tracking-[0.1em] hover:bg-gray-50 transition-all relative z-10 shadow-lg active:scale-[0.98]"
                                    >
                                        Start Application
                                    </button>
                                </div>


                                {/* Dynamic Job Image Section - Strictly from Backend */}
                                {job.jobImage && (
                                    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md group">
                                        <div className="relative w-full">
                                            <Image
                                                src={job.jobImage.startsWith('/') ? job.jobImage : `/${job.jobImage}`}
                                                alt={job.title}
                                                width={800}
                                                height={500}
                                                className="w-full h-auto object-contain"
                                                priority
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />


                                        </div>
                                    </div>
                                )}


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}