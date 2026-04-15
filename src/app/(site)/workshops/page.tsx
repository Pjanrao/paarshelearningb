"use client";
<<<<<<< Updated upstream
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
=======

import React, { useEffect, useState } from "react";
import WorkshopCard from "@/components/workshop/WorkshopCard";
import { Icon } from "@iconify/react";

export default function WorkshopsPage() {
    const [workshops, setWorkshops] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                const res = await fetch("/api/workshops?status=active");
                if (res.ok) {
                    const data = await res.json();
                    setWorkshops(data);
                }
            } catch (err) {
                console.error("Failed to fetch workshops", err);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkshops();
    }, []);

    return (
        <div className="bg-gray-50 dark:bg-darkmode pt-32 pb-20 min-h-screen">
            <div className="container mx-auto max-w-7xl px-4">
                
                {/* Hero / Header Section */}
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-4">
                        <span className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full uppercase tracking-widest flex items-center gap-2">
                            <Icon icon="solar:star-fall-2-bold" className="w-4 h-4" />
                            Live Learning Experience
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#2C4276] dark:text-white mb-6">
                        Expert-Led <span className="text-blue-600">Workshops</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-gray-500 dark:text-gray-400 text-lg">
                        Master new skills, stay updated with industry trends, and learn directly from 
                        top experts through our interactive live workshops.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Upcoming Workshops Grid */}
                        {workshops.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {workshops.map((workshop) => (
                                    <WorkshopCard key={workshop._id} workshop={workshop} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-dark_border rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <Icon icon="solar:calendar-minimalistic-linear" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-400">No active workshops found</h3>
                                <p className="text-gray-400 mt-2">Check back soon for upcoming sessions!</p>
                            </div>
                        )}

                        {/* Coming Soon Section */}
                        <div className="mt-32">
                            <div className="flex items-center gap-4 mb-10">
                                <h2 className="text-3xl font-bold text-[#2C4276] dark:text-white">
                                    Coming <span className="text-blue-600">Soon</span>
                                </h2>
                                <div className="h-0.5 flex-1 bg-gradient-to-r from-blue-100 to-transparent dark:from-blue-900/30"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { title: "Advanced React Patterns", cat: "Development" },
                                    { title: "UI/UX Masterclass", cat: "Design" },
                                    { title: "Digital Marketing 2026", cat: "Marketing" },
                                    { title: "AI Integration in Business", cat: "Technology" }
                                ].map((item, idx) => (
                                    <div key={idx} className="relative group bg-white dark:bg-dark_border p-6 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-300 transition-all">
                                        <div className="absolute top-2 right-2">
                                            <span className="text-[10px] font-bold text-blue-500/50 uppercase">{item.cat}</span>
                                        </div>
                                        <div className="w-12 h-12 bg-gray-50 dark:bg-darkmode rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                                            <Icon icon="solar:clock-circle-bold" className="w-6 h-6 text-gray-300 group-hover:text-blue-300" />
                                        </div>
                                        <h4 className="font-bold text-gray-400 group-hover:text-gray-600 dark:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                                            {item.title}
                                        </h4>
                                        <p className="text-xs text-gray-300 mt-1 uppercase tracking-tighter font-bold">In Planning</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
>>>>>>> Stashed changes
