import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { FaStar, FaClock } from "react-icons/fa6";

export interface Course {
  _id?: string;
  id?: number;
  name: string;
  image?: string;
  thumbnail?: string;
  galleryImage?: string;
  detailsImage?: string;
  featured?: boolean;
  slug: string;
  description?: string;
  shortDescription?: string;
  category?: any;
  date?: string;
  fee?: number;
  rating?: number;
  duration?: any;
  level?: string;
  mode?: string;
  difficulty?: string;
}

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-")         // replace spaces with -
    .replace(/-+/g, "-");         // remove duplicate -
};


const CourseCard = ({ course }: { course: Course }) => {
  const { name, galleryImage, image, thumbnail, slug, description, shortDescription, duration, level, mode, rating, fee, difficulty } = course;
  const courseImage = galleryImage || image || thumbnail || "/images/course/default.jpeg";


  const generatedSlug = slug || generateSlug(name);

  return (
    <div className="group bg-white dark:bg-darkmode rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 dark:border-gray-800">
      {/* Course Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Link href={`/Course/${generatedSlug}`} className="block w-full h-full">
          <Image
            src={courseImage}
            alt={name}
            className="transition-transform duration-500 group-hover:scale-110 object-cover w-full h-full"
            fill
            quality={100}
            unoptimized
          />
        </Link>
      </div>

      {/* Course Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="mb-1">
          <Link
            href={`/Course/${generatedSlug}`}
            className="font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 text-sm sm:text-base leading-tight transition-colors line-clamp-1"
          >
            {name}
          </Link>
        </h3>

        <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
          {shortDescription || description}
        </p>

        {/* Course Meta */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-3 border-t border-gray-50 dark:border-gray-800 pt-2">
          <div className="flex items-center gap-1">
            <Icon icon="solar:clock-circle-linear" className="w-3 h-3 text-blue-600" />
            <span>{duration ? `${duration} Months` : "6 Months"}</span>
          </div>
          <span className="hidden xs:inline text-gray-300">|</span>
          <span className="hidden xs:inline">{difficulty || "Beginner"}</span>
        </div>

        {/* Footer: Rating & Button */}
        <div className="mt-auto flex items-center justify-between gap-1">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`w-2.5 h-2.5 sm:w-3.2 sm:h-3.2 ${i < Math.floor(rating || 5) ? 'text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>

          <Link
            href={`/Course/${generatedSlug}`}
            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[9px] sm:text-[10px] rounded-lg transition-all shadow-md shadow-blue-200 dark:shadow-none hover:translate-y-[-2px] whitespace-nowrap"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
