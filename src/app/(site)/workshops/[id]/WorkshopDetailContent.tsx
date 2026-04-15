"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

type WorkshopData = {
  title: string;
  subtitle: string;
  promoImage: string;
  qrImage: string;
  highlights: string[];
  agenda: { time: string; activity: string }[];
  instructions: string[];
  brochurePdf: string;
};

const WorkshopDetailContent = ({ workshop }: { workshop: WorkshopData }) => {
  return (
    <div className="bg-white dark:bg-darkmode min-h-screen pt-24 pb-20">
      {/* Hero Section */}
      <section className="container mx-auto max-w-7xl px-4 mb-12">
        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-[url('/images/grid.svg')] bg-center"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 md:p-12 lg:p-16">
            <div className="flex-1 text-white">
              <Link 
                href="/workshops" 
                className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition-colors group"
              >
                <Icon icon="solar:arrow-left-linear" className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Workshops
              </Link>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                {workshop.title}
              </h1>
              <p className="text-xl text-blue-100/90 mb-8 max-w-2xl font-light leading-relaxed">
                {workshop.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={workshop.brochurePdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-blue-900 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-50 transition-all shadow-xl active:scale-95"
                >
                  <Icon icon="solar:download-minimalistic-bold" className="text-xl" />
                  Download Brochure
                </a>
              </div>
            </div>
            <div className="w-full md:w-1/3 max-w-md">
              <div className="bg-white p-4 rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden">
                  <Image
                    src={workshop.promoImage}
                    alt={workshop.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Highlights */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                Workshop Highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workshop.highlights.map((highlight: string, index: number) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-200 transition-colors">
                    <div className="mt-1 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                      <Icon icon="solar:check-read-linear" className="text-xl" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Agenda */}
            <div className="bg-white dark:bg-gray-900/30 p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
                Workshop Agenda
              </h2>
              <div className="space-y-6">
                {workshop.agenda.map((item: any, index: number) => (
                  <div key={index} className="relative pl-8 pb-6 border-l-2 border-indigo-100 dark:border-indigo-900 last:border-0 last:pb-0">
                    <div className="absolute left-[-9px] top-0 w-4 h-4 bg-indigo-600 rounded-full ring-4 ring-indigo-50 dark:ring-indigo-950"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg min-w-[150px]">
                        {item.time}
                      </span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium flex-1">
                        {item.activity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-amber-50/50 dark:bg-amber-900/10 p-8 rounded-3xl border border-amber-100 dark:border-amber-900/30">
              <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-8 flex items-center gap-3">
                <Icon icon="solar:info-square-bold" className="text-3xl" />
                Important Instructions
              </h2>
              <ul className="space-y-4">
                {workshop.instructions.map((instruction: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-amber-900/80 dark:text-amber-100/80">
                    <Icon icon="solar:point-on-map-bold" className="mt-1 shrink-0 text-amber-600" />
                    <span className="text-sm md:text-base">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="sticky top-28 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl shadow-xl">
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Quick Registration</h3>
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-8 border border-gray-100 dark:border-gray-800">
                <Image
                  src={workshop.qrImage}
                  alt="Registration QR"
                  fill
                  className="object-contain p-4"
                />
              </div>
              <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-8">
                Scan the QR code to register or get more information about this workshop.
              </p>
              <button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Icon icon="solar:user-plus-bold" className="text-xl" />
                Register Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkshopDetailContent;
