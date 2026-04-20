"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

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
};

export default WorkshopCard;
