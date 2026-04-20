"use client";
import React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { getAssetUrl } from "@/utils/image";
import WorkshopRegistrationForm from "@/components/workshop/WorkshopRegistrationForm";
import { useParams } from "next/navigation";
import { formatWorkshopDate, getWorkshopDateParts } from "@/utils/date";

type WorkshopData = {
  title: string;
  subtitle: string;
  promoImage: string;
  qrImage: string;
  date?: string;
  time?: string;
  highlights: string[];
  agenda: { time: string; activity: string }[];
  instructions: string[];
  brochurePdf: string;
  description?: string;
  mode?: "online" | "offline";
  location?: string;
};

const WorkshopDetailContent = ({ workshop }: { workshop: WorkshopData }) => {
  const params = useParams();
  const workshopId = (params?.id as string) || "unknown";

  return (
    <div className="bg-gray-50 dark:bg-[#0b1120] min-h-screen pt-20 pb-20">

      {/* 🔥 HERO BANNER DESIGN (COMPACT NAVY LAYOUT) */}
      <section className="container mx-auto max-w-6xl px-4 mt-2 mb-0 relative">
        {/* Banner Container */}
        <div className="bg-white dark:bg-[#0b1120] rounded-3xl shadow-[0_10px_40px_-10px_rgba(30,58,138,0.15)] dark:shadow-none border border-blue-100 dark:border-blue-900/40 flex flex-col lg:flex-row overflow-hidden">

          {/* Left Visual (Image Container) */}
          <div className="relative w-full lg:w-[45%] min-h-[300px] sm:min-h-[400px] lg:min-h-full dark:bg-slate-800 flex items-center justify-center overflow-hidden">
            {/* Image fits perfectly within the bounds, covering the gray block entirely */}
            <Image
              src="/images/tutor_one.png"
              alt="Instructor"
              fill
              className="object-cover object-top hover:scale-105 transition-transform duration-700 ease-out"
              priority
            />

            {/* Floating Card - Top Rated */}
            <div className="absolute bottom-4 left-4 lg:bottom-6 lg:left-6 bg-white/95 dark:bg-[#0b1120]/95 backdrop-blur-md shadow-xl shadow-blue-900/10 rounded-xl p-3 border border-white/50 dark:border-blue-900/30 z-30 animate-[bounce_3s_infinite]">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg flex items-center justify-center">
                  <Icon icon="solar:star-fall-bold-duotone" className="text-xl text-blue-700 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Top Rated</p>
                  <p className="text-lg font-black text-blue-950 dark:text-white">Workshop</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content (Text) */}
          <div className="relative z-10 w-full lg:w-[55%] p-6 md:p-10 lg:p-14 flex flex-col justify-center bg-white dark:bg-[#0b1120]">
            {/* Top Badge */}
            <div className="mb-4">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200 font-bold text-xs border border-blue-100 dark:border-blue-800 shadow-sm">
                {workshop.mode === "offline" ? "🏢 In-Person Workshop" : "🚀 Live Online Workshop"}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-blue-950 dark:text-white mb-5 leading-tight">
              {workshop.title}
            </h1>

            <p className="text-blue-800/70 dark:text-blue-200/70 text-sm md:text-base mb-8 max-w-lg font-medium leading-relaxed">
              {workshop.subtitle}
            </p>

            {/* Event Details Ribbon */}
            <div className="inline-flex flex-wrap items-center gap-4 md:gap-8 mb-10 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 px-6 py-4 rounded-xl shadow-sm self-start">
              <div>
                <p className="text-[9px] text-blue-600 dark:text-blue-400 mb-1 font-bold tracking-widest uppercase">Date</p>
                <p className="font-extrabold text-blue-950 dark:text-white text-base md:text-lg tracking-tight">
                  {(() => {
                    const parts = getWorkshopDateParts(workshop.date);
                    if (parts) {
                      return (
                        <>
                          {parts.day}<sup className="text-[10px] md:text-xs ml-0.5">{parts.ordinal}</sup> {parts.month} {parts.year}
                        </>
                      );
                    }
                    return workshop.date || "Upcoming";
                  })()}
                </p>
              </div>
              <div className="w-px h-8 bg-blue-200 dark:bg-blue-800"></div>
              <div>
                <p className="text-[9px] text-blue-600 dark:text-blue-400 mb-1 font-bold tracking-widest uppercase">Time</p>
                <p className="font-extrabold text-blue-950 dark:text-white text-base md:text-lg tracking-tight">
                  {workshop.time || "8 PM"}
                </p>
              </div>
              {workshop.mode === "offline" && workshop.location && (
                <>
                  <div className="w-px h-8 bg-blue-200 dark:bg-blue-800"></div>
                  <div>
                    <p className="text-[9px] text-blue-600 dark:text-blue-400 mb-1 font-bold tracking-widest uppercase">Venue</p>
                    <p className="font-extrabold text-blue-950 dark:text-white text-base md:text-lg tracking-tight">
                      {workshop.location}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 self-start w-full sm:w-auto">
              <button
                onClick={() => document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-blue-900 dark:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-blue-800 dark:hover:bg-blue-500 transition-all duration-300 w-full sm:w-auto">
                Register Now
              </button>

              {/* <a
                href={workshop.brochurePdf || "#"}
                target="_blank"
                rel="noreferrer"
                className="bg-white dark:bg-transparent text-blue-900 dark:text-white border-2 border-blue-900 dark:border-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 dark:hover:bg-white/10 transition-all duration-300 text-center hover:-translate-y-0.5 w-full sm:w-auto"
              >
                Download Brochure
              </a> */}
            </div>
          </div>

        </div>
      </section>

      {/* 🔥 REGISTRATION & BENEFITS SECTION */}
      <section className="container mx-auto max-w-6xl px-4 mb-5 mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">



          {/* Left: Content Area */}
          <div className="lg:sticky lg:top-28">

            {/* About Workshop Section */}
            {workshop.description && (
              <div className="p-6 md:p-8 mb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                  About This Workshop
                </h2>
                <div className="text-base text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                  {workshop.description}
                </div>
              </div>
            )}

            {/* Benefits Section */}
            <div className="p-6 md:p-8 pt-0">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                Workshop Benefits
              </h2>

              <div className="space-y-6">
                {workshop.highlights.map((highlight: string, index: number) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="mt-1 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
                      <Icon icon="solar:check-circle-bold-duotone" className="text-2xl" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white">
                        {highlight}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>

              {/* <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Registration Includes:</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 font-medium">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                    <Icon icon="solar:document-text-bold-duotone" className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  Free Study Material & Resources
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 font-medium">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                    <Icon icon="solar:users-group-rounded-bold-duotone" className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  Exclusive Community Access
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 font-medium">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                    <Icon icon="solar:chat-round-dots-bold-duotone" className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  Live Q&A with Instructor
                </li>
              </ul>
            </div> */}
            </div>
          </div>

          {/* Right: Registration Form */}
          <div id="registration-form" className="scroll-mt-28">
            <WorkshopRegistrationForm
              workshopId={workshopId}
              workshopTitle={workshop.title}
            />
          </div>

        </div>
      </section>
      <section className="container mx-auto max-w-6xl px-4 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Who Should Attend This Workshop?
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This workshop is designed for learners at different stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 text-center">
            <Icon icon="solar:code-bold" className="text-3xl text-blue-600 mb-3 mx-auto" />
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Beginners
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Start your journey in development with guided learning.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 text-center">
            <Icon icon="solar:case-round-bold-duotone" className="text-3xl text-blue-600 mb-3 mx-auto" />
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Job Seekers
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Build real-world skills to crack interviews confidently.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 text-center">
            <Icon icon="solar:rocket-bold" className="text-3xl text-blue-600 mb-3 mx-auto" />
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Professionals
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upgrade your skills and stay ahead in your career.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default WorkshopDetailContent;