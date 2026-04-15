<<<<<<< Updated upstream
import { notFound } from "next/navigation";
import { workshops } from "@/lib/workshops";
import { Metadata } from "next";
import WorkshopDetailContent from "./WorkshopDetailContent";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const workshop = (workshops as any)[id];

  if (!workshop) {
    return {
      title: "Workshop Not Found | Paarsh E-Learning",
    };
  }

  return {
    title: `${workshop.title} | Paarsh E-Learning Workshops`,
    description: workshop.subtitle,
  };
}

const WorkshopDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const workshop = (workshops as any)[id];

  if (!workshop) {
    notFound();
  }

  return <WorkshopDetailContent workshop={workshop} />;
};

export default WorkshopDetailPage;
=======
import React from "react";
import { connectDB } from "@/lib/db";
import Workshop from "@/models/Workshop";
import WorkshopRegistrationForm from "@/components/workshop/WorkshopRegistrationForm";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { notFound } from "next/navigation";
import { FaCalendarAlt, FaClock, FaChalkboardTeacher, FaMapMarkerAlt, FaLink, FaUsers } from "react-icons/fa";

export const dynamic = "force-dynamic";

export default async function WorkshopDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    await connectDB();
    const workshop = await Workshop.findById(id);

    if (!workshop) {
        return notFound();
    }

    return (
        <div className="bg-gray-50 dark:bg-darkmode pt-32 pb-20 min-h-screen">
            <div className="container mx-auto max-w-7xl px-4">
                
                {/* Back Link */}
                <div className="mb-8">
                    <a href="/workshops" className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-2 group transition-all">
                        <Icon icon="solar:alt-arrow-left-linear" className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Back to Workshops
                    </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Left Column: Details */}
                    <div className="lg:col-span-7">
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl mb-8 border-4 border-white dark:border-dark_border">
                            <Image
                                src={workshop.thumbnail || "/images/course/default.jpeg"}
                                alt={workshop.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold text-[#2C4276] dark:text-white mb-6 leading-tight">
                            {workshop.title}
                        </h1>

                        <div className="flex flex-wrap gap-4 mb-8">
                            <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold rounded-xl flex items-center gap-2">
                                <FaCalendarAlt /> {workshop.date}
                            </span>
                            <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold rounded-xl flex items-center gap-2">
                                <FaClock /> {workshop.time} ({workshop.duration})
                            </span>
                            <span className="px-4 py-2 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 font-bold rounded-xl flex items-center gap-2 uppercase">
                                {workshop.mode}
                            </span>
                        </div>

                        <div className="bg-white dark:bg-dark_border p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
                            <h2 className="text-2xl font-bold text-[#2C4276] dark:text-white mb-4">About Workshop</h2>
                            <div className="prose prose-blue dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                                {workshop.description.split("\n").map((para: string, idx: number) => (
                                    <p key={idx} className="mb-4">{para}</p>
                                ))}
                            </div>
                        </div>

                        {/* Instructor & Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white dark:bg-dark_border p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                                <div className="w-14 h-14 bg-blue-50 dark:bg-darkmode rounded-full flex items-center justify-center text-blue-600">
                                    <FaChalkboardTeacher size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Instructor</p>
                                    <p className="font-bold text-[#2C4276] dark:text-white">{workshop.instructorName}</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-dark_border p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                                <div className="w-14 h-14 bg-green-50 dark:bg-darkmode rounded-full flex items-center justify-center text-green-600">
                                    <FaUsers size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Enrolled</p>
                                    <p className="font-bold text-[#2C4276] dark:text-white">{workshop.enrolledCount} Students</p>
                                </div>
                            </div>
                        </div>

                        {/* Location / Mode Info */}
                        {workshop.mode === "offline" ? (
                            <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-100 dark:border-orange-900/30 flex items-start gap-4">
                                <FaMapMarkerAlt className="text-orange-600 mt-1" />
                                <div>
                                    <p className="font-bold text-orange-900 dark:text-orange-400">Venue Location</p>
                                    <p className="text-orange-800 dark:text-orange-300/70">{workshop.location}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-4">
                                <FaLink className="text-blue-600 mt-1" />
                                <div>
                                    <p className="font-bold text-blue-900 dark:text-blue-400">Live Session</p>
                                    <p className="text-blue-800 dark:text-blue-300/70 italic">Link will be shared upon successful registration</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Registration Form */}
                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-32">
                            <WorkshopRegistrationForm 
                                workshopId={workshop._id.toString()} 
                                workshopTitle={workshop.title} 
                            />

                            {/* Trust Badges */}
                            <div className="mt-8 flex justify-center gap-6">
                                <div className="flex flex-col items-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                                    <Icon icon="solar:verified-check-bold" className="w-8 h-8 text-blue-600" />
                                    <span className="text-[10px] font-bold uppercase mt-1">Verified</span>
                                </div>
                                <div className="flex flex-col items-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                                    <Icon icon="solar:shield-check-bold" className="w-8 h-8 text-blue-600" />
                                    <span className="text-[10px] font-bold uppercase mt-1">Secure</span>
                                </div>
                                <div className="flex flex-col items-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                                    <Icon icon="solar:chat-round-call-bold" className="w-8 h-8 text-blue-600" />
                                    <span className="text-[10px] font-bold uppercase mt-1">Live Help</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
>>>>>>> Stashed changes
