"use client";
import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { formatWorkshopDate, getWorkshopDateParts } from "@/utils/date";

interface WorkshopCardProps {
  id: string;
  isFeatured?: boolean;
  workshop: {
    title: string;
    subtitle: string;
    promoImage: string; // Left in type but currently unused visually
    date?: string;
    time?: string;
    category?: string;
    mode?: string;
  };
}

const WorkshopCard: React.FC<WorkshopCardProps> = ({ id, workshop, isFeatured }) => {
  return (
    <div className={`group bg-white dark:bg-gray-900 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-200/60 dark:border-gray-800 flex flex-col h-full ${isFeatured ? 'col-span-full' : ''}`}>

      {/* Content Area */}
      <div className={`p-5 sm:p-6 flex flex-col flex-grow relative overflow-hidden ${isFeatured ? 'xl:p-8' : ''}`}>
        
        {/* Subtle decorative background glow for Featured */}
        {isFeatured && (
           <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-100/50 via-transparent to-transparent dark:from-blue-900/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        )}

        <div className="flex-grow relative z-10 w-full">
            {/* Tags Row */}
            <div className="flex flex-wrap gap-2 mb-4">
              {(workshop.mode || workshop.category) ? (
                <>
                  {workshop.mode && (
                    <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-800 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      {workshop.mode}
                    </span>
                  )}
                  {workshop.category && (
                    <span className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
                      {workshop.category}
                    </span>
                  )}
                </>
              ) : (
                 <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-800 shadow-sm flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                   Live Session
                 </span>
              )}
            </div>

            <h3 className={`${isFeatured ? 'text-2xl md:text-3xl' : 'text-lg'} font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight ${!isFeatured && 'line-clamp-2 min-h-[2.75rem]'}`}>
            {workshop.title}
            </h3>
            
            {/* Meta Data Row */}
            <div className={`flex flex-wrap gap-y-2 gap-x-5 mb-4 ${isFeatured ? 'md:mb-6' : ''}`}>
               <div className="flex items-center text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">
                 <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-gray-800 flex items-center justify-center mr-2 border border-gray-100 dark:border-gray-700">
                    <Icon icon="solar:calendar-bold-duotone" className="w-4 h-4 text-blue-500" />
                 </div>
                 {(() => {
                      const parts = getWorkshopDateParts(workshop.date);
                      if (parts) {
                          return (
                              <>
                                  {parts.day}<sup className="text-[10px] ml-0.5">{parts.ordinal}</sup> {parts.month} {parts.year}
                              </>
                          );
                      }
                      return workshop.date || "Upcoming Dates TBA";
                  })()}
               </div>
               <div className="flex items-center text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">
                 <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-gray-800 flex items-center justify-center mr-2 border border-gray-100 dark:border-gray-700">
                     <Icon icon="solar:clock-circle-bold-duotone" className="w-4 h-4 text-indigo-500" />
                 </div>
                 {workshop.time || "Time TBA"}
               </div>
            </div>

            <p className={`text-gray-600 dark:text-gray-400 ${isFeatured ? 'text-sm md:text-base mb-6 max-w-4xl opacity-90' : 'text-xs sm:text-sm mb-5 line-clamp-3 opacity-90'}`}>
            {workshop.subtitle}
            </p>
        </div>

        <div className={`mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 relative z-10 ${isFeatured ? 'flex justify-start' : ''}`}>
          <Link
            href={`/workshops/${id}`}
            className={`inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 active:scale-95 group/btn ${isFeatured ? 'bg-[#2C4276] hover:bg-blue-800 text-white px-8 py-3 shadow-lg shadow-blue-900/20 w-max hover:shadow-blue-900/30 text-base' : 'w-full px-4 py-2.5 bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 text-[#2C4276] dark:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm text-sm'}`}
          >
            {isFeatured ? 'Register Now' : 'View Details'}
            <Icon icon="solar:arrow-right-linear" className={`ml-2 transition-transform group-hover/btn:translate-x-1 ${isFeatured ? 'w-6 h-6' : 'w-5 h-5'}`} />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default WorkshopCard;
