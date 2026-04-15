"use client";
import React from "react";
import { Icon } from "@iconify/react";
import { workshops } from "@/lib/workshops";
import WorkshopCard from "@/components/workshop/WorkshopCard";

const WorkshopsPage = () => {
  const workshopList = Object.entries(workshops);

  return (
    <div className="bg-gray-50 dark:bg-darkmode min-h-screen pb-20 pt-20 md:pt-24 -mt-6">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-indigo-200 to-white py-20 px-4 overflow-hidden border-b border-gray-100 dark:border-none">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 right-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-50px] left-[-30px] w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-blue-950 mb-6 drop-shadow-sm -mt-10">
            Intensive Workshops
          </h1>
          <p className="text-blue-900/70 text-lg md:text-xl mb-10 opacity-90 max-w-2xl mx-auto font-medium">
            Elevate your skills with our hands-on, industry-aligned workshops. 
            Gain practical experience and real-world insights from experts.
          </p>
        </div>
      </section>

      {/* Workshop Grid Section */}
      <section className="container mx-auto max-w-7xl px-4 -mt-16 relative z-20 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {workshopList.map(([id, workshop]) => (
            <WorkshopCard key={id} id={id} workshop={workshop} />
          ))}
        </div>

        {workshopList.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl shadow-inner border border-dashed border-gray-300 dark:border-gray-700">
            <Icon icon="solar:calendar-block-linear" className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-500 dark:text-gray-400">No workshops scheduled</h3>
            <p className="text-gray-400">Check back later for new workshop announcements.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default WorkshopsPage;
