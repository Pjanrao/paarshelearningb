"use client";

import Link from "next/link";
import { useGetJobsQuery } from "@/redux/api/jobApi";
import { Briefcase, MapPin, Building, PlusCircle, ArrowRight } from "lucide-react";

export default function Careers() {
    const { data: jobs, isLoading, error } = useGetJobsQuery();

    return (
        <div className="min-h-screen bg-section pt-32 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-midnight_text">
                        Join Our Team
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-grey max-w-xl mx-auto">
                        Explore open roles and grow your career with us
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                                <div className="h-6 bg-slate-200 rounded w-2/3 mb-4"></div>
                                <div className="h-4 bg-slate-100 rounded w-1/2 mb-2"></div>
                                <div className="h-4 bg-slate-100 rounded w-1/3 mb-6"></div>
                                <div className="space-y-3 mb-6">
                                    <div className="h-3 bg-slate-100 rounded w-full"></div>
                                    <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                                </div>
                                <div className="h-10 bg-slate-200 rounded-lg w-full"></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-service border border-red-100">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                            <span className="text-2xl text-red-600">!</span>
                        </div>
                        <h3 className="text-lg font-semibold text-midnight_text mb-2">Failed to load jobs</h3>
                        <p className="text-grey mb-6">There was an error fetching the open positions. Please try again later.</p>
                        <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition duration-200">
                            Retry
                        </button>
                    </div>
                ) : jobs?.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-service border border-border/50">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-section mb-6">
                            <Briefcase className="w-10 h-10 text-grey" />
                        </div>
                        <h3 className="text-xl font-semibold text-midnight_text mb-2">No open positions</h3>
                        <p className="text-grey max-w-md mx-auto">We don't have any open positions at the moment. Please check back later.</p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {jobs?.map((job: any) => (
                            <div key={job._id} className="group bg-white rounded-2xl shadow-service hover:shadow-deatail_shadow border border-border/50 transition-all duration-300 flex flex-col transform hover:-translate-y-1">
                                <div className="p-8 flex-1">
                                    <h2 className="text-xl font-bold text-midnight_text group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-4">
                                        {job.title}
                                    </h2>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center text-grey text-sm font-medium">
                                            <Building className="w-4 h-4 mr-3 text-primary" />
                                            {job.company || "Paarsh E-learning"}
                                        </div>
                                        <div className="flex items-center text-grey text-sm font-medium">
                                            <MapPin className="w-4 h-4 mr-3 text-primary" />
                                            {job.location || "Remote"}
                                        </div>
                                    </div>

                                    <p className="text-grey text-sm leading-relaxed line-clamp-3 mb-6">
                                        {job.description || "..."}
                                    </p>
                                    {/* ✅ NEW: Work Mode */}
                                    {job.workMode && (
                                        <div className="flex items-center text-grey text-sm font-medium mb-2">
                                            <Briefcase className="w-4 h-4 mr-3 text-primary" />
                                            {job.workMode}
                                        </div>
                                    )}

                                    {/* ✅ NEW: Salary */}
                                    {job.salary && (
                                        <p className="text-success font-semibold">
                                            ₹ {job.salary}
                                        </p>
                                    )}
                                </div>

                                <div className="px-8 pb-8 mt-auto">
                                    <Link
                                        href={`/careers/${job._id}`}
                                        className="flex items-center justify-center w-full px-4 py-3 bg-primary/5 text-primary font-bold rounded-[30px] hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group-scope"
                                    >
                                        View Details
                                        <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}