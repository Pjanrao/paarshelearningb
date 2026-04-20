"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import WorkshopCard from "@/components/workshop/WorkshopCard";

const WorkshopsPage = () => {
    const [dbWorkshops, setDbWorkshops] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState("All");

    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                const res = await fetch("/api/workshops?status=active");
                if (res.ok) {
                    const data = await res.json();
                    setDbWorkshops(data);
                }
            } catch (err) {
                console.error("Failed to fetch workshops", err);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkshops();
    }, []);

    // Filter Logic
    const filters = ["All", "Online", "Offline", "Popular"];

    const dynamicList = dbWorkshops.map((w) => [
        w._id,
        {
            title: w.title,
            subtitle: w.subtitle || w.description?.substring(0, 150) + "...",
            promoImage: w.promoImage || w.thumbnail || "/promo1.png",
            date: w.date,
            time: w.time,
            category: w.category,
            mode: w.mode,
        }
    ]);

    const filteredList = dynamicList.filter(([id, w]: any) => {
        if (selectedFilter === "All") return true;
        if (selectedFilter === "Popular") return true; 
        if (selectedFilter === "Online") return w.mode?.toLowerCase() === "online";
        if (selectedFilter === "Offline") return w.mode?.toLowerCase() === "offline";
        return true; // Fallback
    });

    const featuredWorkshop = filteredList.length > 0 ? filteredList[0] : null;
    const standardWorkshops = filteredList.length > 0 ? filteredList.slice(1) : [];

    return (
        <div className="bg-[#FAFAFA] dark:bg-darkmode min-h-screen pb-20 pt-20 md:pt-24 -mt-6">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-900 via-indigo-200 to-white py-20 px-4 overflow-hidden border-b border-gray-100 dark:border-none">
                {/* Background Decorations */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-10 right-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-[-50px] left-[-30px] w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
                </div>
                
                <div className="container mx-auto max-w-4xl relative z-10 text-center flex flex-col items-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-blue-950 mb-6 drop-shadow-sm -mt-10">
                        Expert Workshops
                    </h1>
                    <p className="text-blue-900/70 text-lg md:text-lg mb-10 opacity-90 max-w-2xl mx-auto font-medium">
                        Elevate your career through hands-on, interactive learning experiences. Filter by what you need and join our specialized sessions.
                    </p>
                </div>
            </section>

            {/* Categories & Filter Tabs */}
            <section className="container mx-auto max-w-7xl px-4 -mt-24 relative z-20">
                <div className="bg-white dark:bg-gray-900 p-2 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 backdrop-blur-md">
                    <div className="flex items-center justify-center sm:justify-start gap-2 overflow-x-auto py-1 px-1 no-scrollbar">
                        {filters.map((f) => (
                            <button
                                key={f}
                                onClick={() => setSelectedFilter(f)}
                                className={`
                                    whitespace-nowrap px-6 py-3 rounded-xl font-bold transition-all duration-300
                                    ${selectedFilter === f
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600'}
                                  `}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Workshop Content Section */}
            <section className="container mx-auto max-w-7xl px-4 -mt-20 pb-20 relative z-20">
                {loading ? (
                    <div className="space-y-12">
                        {/* Skeleton Featured */}
                        <div className="w-full h-[400px] lg:h-[300px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl animate-pulse shadow-sm p-4 flex flex-col lg:flex-row gap-6">
                            <div className="w-full lg:w-2/5 h-48 lg:h-full bg-gray-100 dark:bg-gray-800 rounded-2xl"></div>
                            <div className="lg:w-3/5 space-y-4 flex flex-col justify-center py-4 pr-6">
                                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/4"></div>
                                <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
                                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-5/6"></div>
                                <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded w-40 mt-4 rounded-xl"></div>
                            </div>
                        </div>
                        {/* Skeleton Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-96 bg-white dark:bg-gray-900 rounded-2xl animate-pulse shadow-sm border border-gray-100 dark:border-gray-800 p-4 flex flex-col">
                                     <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl mb-4 w-full"></div>
                                     <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded w-3/4 mb-3"></div>
                                     <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full mb-2"></div>
                                     <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-5/6 mb-auto"></div>
                                     <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded w-full mt-4 rounded-xl"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {featuredWorkshop && (
                            <div className="mb-14">
                                <h2 className="text-xl md:text-2xl font-extrabold text-[#111827] dark:text-white mb-6 flex items-center gap-2">
                                    <Icon icon="solar:star-fall-bold-duotone" className="text-amber-500 w-7 h-7"/> 
                                    Featured Workshop
                                </h2>
                                <WorkshopCard id={featuredWorkshop[0]} workshop={featuredWorkshop[1]} isFeatured={true} />
                            </div>
                        )}

                        {standardWorkshops.length > 0 && (
                            <div>
                                <h2 className="text-xl md:text-2xl font-extrabold text-[#111827] dark:text-white mb-6">More Opportunities</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {standardWorkshops.map(([id, workshop]: any) => (
                                        <WorkshopCard key={id} id={id} workshop={workshop} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {filteredList.length === 0 && (
                            <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-dashed border-gray-200 dark:border-gray-800 mt-8 max-w-3xl mx-auto">
                                <div className="bg-blue-50 dark:bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Icon icon="solar:calendar-search-linear" className="w-12 h-12 text-blue-400 dark:text-gray-400" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">No sessions found</h3>
                                <p className="text-gray-500 font-medium max-w-sm mx-auto text-lg mb-8">It looks like we don't have any matching workshops right now. Try adjusting your filters.</p>
                                <button onClick={() => setSelectedFilter("All")} className="font-bold text-white bg-[#2C4276] hover:bg-blue-800 rounded-xl px-8 py-3.5 transition-all active:scale-95 shadow-md shadow-blue-500/20">
                                    View All Workshops
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
};

export default WorkshopsPage;
