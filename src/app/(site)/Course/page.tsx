"use client";
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import CourseCard from '@/components/SharedComponent/Course/CourseCard';
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";

const CoursePage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data: categoryData } = useGetCategoriesQuery();
  const categories = categoryData || [];

  const { data, isLoading } = useGetCoursesQuery({
    page,
    limit: 100,
    search: searchQuery,
    category: activeCategory === "all" ? "" : activeCategory,
  });

  const courses = data?.courses || [];

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
          <h1 className="text-3xl md:text-4xl font-bold text-blue-950 mb-6 drop-shadow-sm -mt-10">
            Our Courses
          </h1>
          <p className="text-blue-900/70 text-lg md:text-lg mb-10 opacity-90 max-w-2xl mx-auto font-medium">
            Industry-oriented courses designed to build real-world skills and propel your career forward.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon icon="solar:magnifer-linear" className="text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-11 pr-11 py-2.5 md:py-3 bg-white dark:bg-gray-900 rounded-full shadow-lg focus:ring-4 focus:ring-blue-500/10 outline-none text-gray-700 dark:text-gray-200 text-base transition-all border border-gray-100 dark:border-gray-800 focus:border-blue-500/20"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors"
                title="Clear search"
              >
                <Icon icon="solar:close-circle-linear" className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Categories & Filter Tabs */}
      <section className="container mx-auto max-w-7xl px-4 -mt-24 relative z-20">
        <div className="bg-white dark:bg-gray-900 p-2 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 backdrop-blur-md">
          <div className="flex items-center gap-2 overflow-x-auto py-1 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button
              onClick={() => {
                setActiveCategory("all");
                setPage(1);
              }}
              className={`
                  whitespace-nowrap px-6 py-3 rounded-xl font-bold transition-all duration-300
                  ${activeCategory === "all"
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600'}
                `}
            >
              All Courses
            </button>
            {categories.map((cat: any) => (
              <button
                key={cat._id}
                onClick={() => {
                  setActiveCategory(cat._id);
                  setPage(1);
                }}
                className={`
                  whitespace-nowrap px-6 py-3 rounded-xl font-bold transition-all duration-300
                  ${activeCategory === cat._id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600'}
                `}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="container mx-auto max-w-7xl px-4 -mt-20 pb-20">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {courses.map((course: any) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl shadow-inner border border-dashed border-gray-300 dark:border-gray-700">
            <Icon icon="solar:document-add-linear" className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-500 dark:text-gray-400">No courses found</h3>
            <p className="text-gray-400">Try adjusting your search or category filter</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default CoursePage;
