"use client";

import Link from "next/link";
import { useGetJobsQuery } from "@/redux/api/jobApi";
import { Briefcase, MapPin, Building, ArrowRight, ChevronRight } from "lucide-react";

export default function Careers() {
    const { data: jobs, isLoading, error } = useGetJobsQuery();

    return (
        <div className="bg-gray-50/30 pt-24 pb-20 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">

                {/* BREADCRUMB */}
                <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-10 px-2">
                    <Link href="/" className="hover:text-[#2C4276] transition-colors font-medium">Home</Link>
                    <ChevronRight size={14} className="text-gray-400" />
                    <span className="text-[#2C4276] font-semibold">Careers</span>
                </nav>

                <div className="text-center mb-16 px-4">
                    <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-midnight_text tracking-tight leading-tight">
                        Career Opportunities
                    </h1>
                    <p className="mt-4 text-base sm:text-lg text-grey max-w-2xl mx-auto leading-relaxed">
                        Join a team of innovators and creators dedicated to transforming the future of education. Find your next role with us.
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                                <div className="space-y-3 mb-6">
                                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                    <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                                </div>
                                <div className="h-12 bg-gray-100 rounded-lg w-full mt-auto"></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="max-w-md mx-auto text-center py-12 px-6 bg-white rounded-2xl shadow-sm border border-red-100">
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <span className="text-red-500 font-bold">!</span>
                        </div>
                        <h3 className="text-lg font-bold text-midnight_text mb-2">Systems unavailable</h3>
                        <p className="text-sm text-grey mb-6 leading-relaxed">We're having trouble reaching our careers database. Please try refreshing or check back in a few moments.</p>
                        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-full hover:shadow-lg transition-all">
                            Refresh Page
                        </button>
                    </div>
                ) : jobs?.length === 0 ? (
                    <div className="max-w-xl mx-auto text-center py-20 px-6 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6">
                            <Briefcase className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-midnight_text mb-2">Expanding our horizon soon</h3>
                        <p className="text-sm text-grey leading-relaxed">We don't have any matching positions at the moment, but we're always growing. Check back soon or follow our updates.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-2 sm:px-4">
                        {jobs?.map((job: any) => (
                            <div key={job._id} className="group bg-white rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full overflow-hidden">
                                <div className="p-6 sm:p-8 flex flex-col h-full">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded">
                                                {job.type}
                                            </span>
                                            {job.workMode && (
                                                <span className="text-[10px] font-bold text-gray-400 border border-gray-200 px-2 py-1 rounded uppercase">
                                                    {job.workMode}
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-xl font-extrabold text-midnight_text group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-4">
                                            {job.title}
                                        </h2>

                                        <div className="space-y-2 mb-6 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Building className="w-4 h-4 mr-2.5 text-gray-300" />
                                                <span className="font-medium truncate">{job.company || "Paarsh E-learning"}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-2.5 text-gray-300 flex-shrink-0" />
                                                <span className="font-medium truncate">
                                                    {job.locations?.length > 0
                                                        ? job.locations.join(" | ")
                                                        : (job.location || "Location not specified")}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-grey text-sm leading-relaxed line-clamp-3 mb-8">
                                            {job.description}
                                        </p>
                                    </div>

                                    <div className="mt-auto">
                                        <Link
                                            href={`/careers/${job._id}`}
                                            className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary text-white text-sm font-bold rounded-lg group-hover:bg-midnight_text transition-all duration-300 shadow-sm"
                                        >
                                            View Opportunity
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}