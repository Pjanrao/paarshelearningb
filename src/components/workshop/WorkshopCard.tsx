<<<<<<< Updated upstream
"use client";
=======
>>>>>>> Stashed changes
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
<<<<<<< Updated upstream

interface WorkshopCardProps {
  id: string;
  workshop: {
    title: string;
    subtitle: string;
    promoImage: string;
  };
}

const WorkshopCard: React.FC<WorkshopCardProps> = ({ id, workshop }) => {
  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={workshop.promoImage || "/images/placeholder.jpg"}
          alt={workshop.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-white text-sm font-medium flex items-center gap-1">
            <Icon icon="solar:round-alt-arrow-right-bold" /> View Workshop
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 min-h-[3.5rem]">
          {workshop.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3">
          {workshop.subtitle}
        </p>

        <div className="mt-auto">
          <Link
            href={`/workshops/${id}`}
            className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 active:scale-95"
          >
            Explore Workshop
            <Icon icon="solar:arrow-right-linear" className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
=======
import { FaStar, FaCalendarAlt, FaClock, FaChalkboardTeacher } from "react-icons/fa";

interface Workshop {
    _id?: string;
    title: string;
    description: string;
    thumbnail?: string;
    instructorName: string;
    date: string;
    time: string;
    duration: string;
    price: number;
    mode: "online" | "offline";
    status: string;
}

const WorkshopCard = ({ workshop }: { workshop: Workshop }) => {
    const { 
        _id, 
        title, 
        description, 
        thumbnail, 
        instructorName, 
        date, 
        time, 
        duration, 
        price, 
        mode 
    } = workshop;

    const workshopImage = thumbnail || "/images/course/default.jpeg";

    return (
        <div className="group bg-white dark:bg-darkmode rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 dark:border-gray-800">
            {/* Image Section */}
            <div className="relative aspect-[16/9] overflow-hidden">
                <Link href={`/workshops/${_id}`}>
                    <div className="relative h-full w-full">
                        <Image
                            src={workshopImage}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${
                                mode === "online" ? "bg-blue-600" : "bg-orange-600"
                            }`}>
                                {mode}
                            </span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="mb-2">
                    <Link
                        href={`/workshops/${_id}`}
                        className="font-bold text-[#2C4276] group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 text-lg leading-tight transition-colors line-clamp-1"
                    >
                        {title}
                    </Link>
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    {description}
                </p>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[12px] font-medium text-gray-600 dark:text-gray-400 mb-5 border-t border-gray-50 dark:border-gray-800 pt-4">
                    <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-600 w-3 h-3" />
                        <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaClock className="text-blue-600 w-3 h-3" />
                        <span>{time} ({duration})</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                        <FaChalkboardTeacher className="text-blue-600 w-3 h-3" />
                        <span className="truncate">By {instructorName}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between border-t border-gray-50 dark:border-gray-800 pt-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider leading-none mb-1">Price</span>
                        <span className="text-lg font-extrabold text-[#2C4276] dark:text-white leading-none">
                            {price === 0 ? "FREE" : `₹${price}`}
                        </span>
                    </div>

                    <Link
                        href={`/workshops/${_id}`}
                        className="px-5 py-2.5 bg-[#2C4276] hover:bg-blue-900 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-100 dark:shadow-none hover:translate-y-[-2px]"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
>>>>>>> Stashed changes
};

export default WorkshopCard;
