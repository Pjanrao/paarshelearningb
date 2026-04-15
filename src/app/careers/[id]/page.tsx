"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetJobByIdQuery } from "@/redux/api/jobApi";
import {
    Building,
    MapPin,
    Briefcase,
    Clock,
    ChevronLeft,
    CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function JobDetails() {
    const { id } = useParams();
    const router = useRouter();

    const { data: job, isLoading, error } = useGetJobByIdQuery(id as string);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50/50 py-12 px-4">
                <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
                    <div className="h-8 w-24 bg-slate-200 rounded mb-8"></div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="h-10 w-3/4 bg-slate-200 rounded mb-4"></div>
                    </div>
                </div>
            </div>
        );
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
        <div className="min-h-screen bg-section py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Back */}
                <Link
                    href="/careers"
                    className="inline-flex items-center text-sm font-medium text-grey hover:text-primary mb-8 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to careers
                </Link>

                <div className="bg-white rounded-3xl shadow-deatail_shadow border border-border/40 overflow-hidden">
                    {/* HEADER */}
                    <div className="px-8 py-10 sm:px-12 lg:py-12 border-b border-border/40 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#e0f7ff] via-white to-white">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-black text-midnight_text tracking-tight mb-4">
                                    {job.title}
                                </h1>

                                <div className="flex flex-wrap gap-4 text-secondary font-medium">
                                    <div className="flex items-center">
                                        <Building className="w-5 h-5 mr-2 text-primary" />
                                        {job.company || "Paarsh E-learning"}
                                    </div>

                                    <div className="flex items-center">
                                        <MapPin className="w-5 h-5 mr-2 text-primary" />
                                        {job.location || "Remote"}
                                    </div>

                                    <div className="flex items-center">
                                        <Briefcase className="w-5 h-5 mr-2 text-primary" />
                                        {job.type || "Full-time"}
                                    </div>

                                    {/* ✅ Work Mode Badge */}
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                                        {job.workMode || "Remote"}
                                    </span>

                                    {/* ✅ Salary ₹ */}
                                    {job.salary && (
                                        <div className="flex items-center text-success font-semibold">
                                            ₹ {job.salary}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Apply */}
                            <div className="flex-shrink-0 mt-4 md:mt-0">
                                <button
                                    onClick={() =>
                                        router.push(`/careers/apply?jobId=${job._id}`)
                                    }
                                    className="px-8 py-3.5 bg-primary text-white text-lg font-bold rounded-full shadow-lg shadow-primary/20 hover:bg-primary/90 transform hover:-translate-y-1 transition-all duration-300"
                                >
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div className="px-8 py-10 sm:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* LEFT */}
                        <div className="lg:col-span-2 space-y-10 border-b lg:border-b-0 lg:border-r border-border/50 lg:pr-12 pb-10 lg:pb-0">

                            {/* Description */}
                            <section>
                                <h2 className="text-2xl font-bold text-midnight_text mb-4">
                                    About the Role
                                </h2>
                                <div className="prose prose-lg max-w-none text-grey">
                                    {job.description?.split("\n").map((p: string, i: number) => (
                                        <p key={i}>{p}</p>
                                    ))}
                                </div>
                            </section>

                            {/* ✅ Responsibilities */}
                            {job.responsibilities && (
                                <section>
                                    <h2 className="text-2xl font-bold text-midnight_text mb-4">
                                        Responsibilities
                                    </h2>
                                    <div className="prose prose-lg text-grey">
                                        {job.responsibilities
                                            .split("\n")
                                            .map((r: string, i: number) => (
                                                <p key={i}>{r}</p>
                                            ))}
                                    </div>
                                </section>
                            )}

                            {/* Requirements */}
                            {job.requirements && (
                                <section>
                                    <h2 className="text-2xl font-bold text-midnight_text mb-4">
                                        Requirements
                                    </h2>
                                    <ul className="space-y-3">
                                        {formatRequirements(job.requirements).map(
                                            (req: string, idx: number) => (
                                                <li key={idx} className="flex items-start">
                                                    <CheckCircle2 className="w-5 h-5 mr-2 text-primary" />
                                                    {req}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </section>
                            )}

                            {/* ✅ Skills */}
                            {job.skills?.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-bold text-midnight_text mb-4">
                                        Skills
                                    </h2>
                                    <div className="flex flex-wrap gap-3">
                                        {job.skills.map((skill: string, i: number) => (
                                            <span
                                                key={i}
                                                className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold shadow-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* ✅ Education */}
                            {job.education && (
                                <section>
                                    <h2 className="text-2xl font-bold text-midnight_text mb-4">
                                        Education
                                    </h2>
                                    <p className="text-grey">{job.education}</p>
                                </section>
                            )}
                        </div>

                        {/* RIGHT */}
                        <div className="space-y-6">
                            <div className="bg-section rounded-2xl p-6 border border-border/50 shadow-service">
                                <h3 className="font-bold text-lg mb-4">Job Overview</h3>

                                <div className="space-y-4 text-sm">
                                    <p>
                                        <strong>Date:</strong>{" "}
                                        {new Date(job.createdAt).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <strong>Location:</strong> {job.location}
                                    </p>
                                    <p>
                                        <strong>Type:</strong> {job.type}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useGetJobByIdQuery } from "@/redux/api/jobApi";
// import { Building, MapPin, Briefcase, DollarSign, Clock, ChevronLeft, CheckCircle2 } from "lucide-react";
// import Link from "next/link";

// export default function JobDetails() {
//     const { id } = useParams();
//     const router = useRouter();

//     const { data: job, isLoading, error } = useGetJobByIdQuery(id as string);

//     if (isLoading) {
//         return (
//             <div className="min-h-screen bg-gray-50/50 py-12 px-4">
//                 <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
//                     <div className="h-8 w-24 bg-slate-200 rounded mb-8"></div>
//                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
//                         <div className="h-10 w-3/4 bg-slate-200 rounded mb-4"></div>
//                         <div className="flex gap-4 mb-8">
//                             <div className="h-6 w-32 bg-slate-100 rounded"></div>
//                             <div className="h-6 w-32 bg-slate-100 rounded"></div>
//                         </div>
//                         <div className="space-y-4">
//                             <div className="h-4 w-full bg-slate-100 rounded"></div>
//                             <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
//                             <div className="h-4 w-4/6 bg-slate-100 rounded"></div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     if (error || !job) {
//         return (
//             <div className="min-h-screen bg-gray-50/50 py-12 px-4 flex items-center justify-center">
//                 <div className="text-center">
//                     <h3 className="text-xl font-bold text-gray-900 mb-2">Job not found</h3>
//                     <p className="text-gray-500 mb-6">The position you're looking for doesn't exist or has been closed.</p>
//                     <Link href="/careers" className="text-blue-600 font-medium hover:underline">
//                         &larr; Back to all jobs
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     const formatRequirements = (reqs: any) => {
//         if (!reqs) return [];
//         if (Array.isArray(reqs)) return reqs.filter(r => typeof r === 'string' && r.trim() !== '');
//         if (typeof reqs !== 'string') return [];
//         return reqs.split('\n').filter((r: string) => r.trim() !== '');
//     };

//     return (
//         <div className="min-h-screen bg-section py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-5xl mx-auto">
//                 <Link href="/careers" className="inline-flex items-center text-sm font-medium text-grey hover:text-primary mb-8 transition-colors">
//                     <ChevronLeft className="w-4 h-4 mr-1" />
//                     Back to careers
//                 </Link>

//                 <div className="bg-white rounded-3xl shadow-deatail_shadow border border-border/40 overflow-hidden">
//                     {/* Header Section */}
//                     <div className="px-8 py-10 sm:px-12 lg:py-12 border-b border-border/40 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#e0f7ff] via-white to-white">
//                         <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
//                             <div>
//                                 <h1 className="text-3xl sm:text-4xl font-black text-midnight_text tracking-tight mb-4">
//                                     {job.title}
//                                 </h1>
//                                 <div className="flex flex-wrap gap-4 text-secondary font-medium">
//                                     <div className="flex items-center">
//                                         <Building className="w-5 h-5 mr-2 text-primary" />
//                                         {job.company || "Paarsh E-learning"}
//                                     </div>
//                                     <div className="flex items-center">
//                                         <MapPin className="w-5 h-5 mr-2 text-primary" />
//                                         {job.location || "Remote"}
//                                     </div>
//                                     <div className="flex items-center">
//                                         <Briefcase className="w-5 h-5 mr-2 text-primary" />
//                                         {job.type || "Full-time"}
//                                     </div>
//                                     <div className="flex items-center">
//                                         <Briefcase className="w-5 h-5 mr-2 text-primary" />
//                                         {job.workMode || "Remote"}
//                                     </div>
//                                     {job.salary && (
//                                         <div className="flex items-center text-success">
//                                             <span className="text-success font-semibold">
//                                                 ₹ {job.salary}
//                                             </span>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                             <div className="flex-shrink-0 mt-4 md:mt-0">
//                                 <button
//                                     onClick={() => router.push(`/careers/apply?jobId=${job._id}`)}
//                                     className="px-8 py-3.5 bg-primary text-white text-lg font-bold rounded-full shadow-lg shadow-primary/20 hover:bg-primary/90 transform hover:-translate-y-1 transition-all duration-300 w-full md:w-auto text-center"
//                                 >
//                                     Apply Now
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Content Section */}
//                     <div className="px-8 py-10 sm:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
//                         <div className="lg:col-span-2 space-y-10 border-b lg:border-b-0 lg:border-r border-border/50 lg:pr-12 pb-10 lg:pb-0">
//                             <section>
//                                 <h2 className="text-2xl font-bold text-midnight_text mb-4">About the Role</h2>
//                                 <div className="prose prose-lg max-w-none text-grey">
//                                     {job.description?.split('\n').map((paragraph: string, i: number) => (
//                                         <p key={i} className="mb-4">{paragraph}</p>
//                                     ))}
//                                 </div>
//                             </section>

//                             {job.requirements && (
//                                 <section>
//                                     <h2 className="text-2xl font-bold text-midnight_text mb-4">Requirements</h2>
//                                     <ul className="space-y-4">
//                                         {formatRequirements(job.requirements).map((req, idx) => (
//                                             <li key={idx} className="flex items-start text-grey">
//                                                 <CheckCircle2 className="w-6 h-6 mr-3 text-primary flex-shrink-0" />
//                                                 <span>{req}</span>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </section>
//                             )}
//                         </div>

//                         <div className="lg:col-span-1 space-y-8">
//                             <div className="bg-section rounded-2xl p-6 border border-border/50 shadow-service">
//                                 <h3 className="font-bold text-midnight_text text-lg mb-6">Job Overview</h3>
//                                 <div className="space-y-5">
//                                     <div className="flex items-center text-sm">
//                                         <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mr-4 text-primary">
//                                             <Clock className="w-5 h-5" />
//                                         </div>
//                                         <div>
//                                             <p className="text-grey font-medium">Date Posted</p>
//                                             <p className="font-bold text-midnight_text">
//                                                 {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <div className="flex items-center text-sm">
//                                         <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mr-4 text-primary">
//                                             <MapPin className="w-5 h-5" />
//                                         </div>
//                                         <div>
//                                             <p className="text-grey font-medium">Location</p>
//                                             <p className="font-bold text-midnight_text">{job.location || 'Remote'}</p>
//                                         </div>
//                                     </div>
//                                     <div className="flex items-center text-sm">
//                                         <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mr-4 text-primary">
//                                             <Briefcase className="w-5 h-5" />
//                                         </div>
//                                         <div>
//                                             <p className="text-grey font-medium">Job Type</p>
//                                             <p className="font-bold text-midnight_text">{job.type || 'Full-time'}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }