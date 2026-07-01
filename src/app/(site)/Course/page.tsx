"use client";
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import CourseCard from '@/components/SharedComponent/Course/CourseCard';
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import { motion, AnimatePresence } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

/* ─── Skeleton Loader Component ────────────────────────── */
const CourseSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-[24px] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 h-[400px] flex flex-col relative">
    <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 animate-pulse relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
    <div className="p-6 space-y-4 flex-1">
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3 animate-pulse" />
      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 animate-pulse" />
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full animate-pulse" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6 animate-pulse" />
      </div>
    </div>
    <div className="p-6 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center">
      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4 animate-pulse" />
      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
    </div>
  </div>
);

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
    <div className="bg-gray-50 dark:bg-darkmode min-h-screen pb-20 pt-20 md:pt-24 -mt-6 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-indigo-200 to-white py-16 px-4 overflow-hidden border-b border-gray-100 dark:border-none">

        {/* Background Decorations — High Visibility */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-10 w-80 h-80 rounded-full blur-3xl"
            style={{ background: "rgba(59,130,246,0.18)" }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{
              opacity: [0.4, 0.6, 0.4],
              scale: [1.2, 1, 1.2],
              rotate: [0, -90, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-80px] left-[-40px] w-96 h-96 rounded-full blur-3xl"
            style={{ background: "rgba(99,102,241,0.15)" }}
          />

          {/* Floating Particles — More prominent with glow */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${8 + (i % 4) * 4}px`,
                height: `${8 + (i % 4) * 4}px`,
                left: `${5 + i * 8}%`,
                top: `${10 + (i % 5) * 18}%`,
                background:
                  i % 3 === 0
                    ? "rgba(99,102,241,0.45)"
                    : i % 3 === 1
                      ? "rgba(59,130,246,0.4)"
                      : "rgba(255,255,255,0.6)",
                boxShadow: "0 0 10px rgba(59,130,246,0.2)",
              }}
              animate={{
                y: [0, -25, 0],
                x: [0, i % 2 === 0 ? 12 : -12, 0],
                opacity: [0.4, 0.9, 0.4],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 4 + (i % 4),
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Rotating ring decorations — properly visible */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-blue-400/20"
            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
            transition={{
              rotate: { duration: 40, repeat: Infinity, ease: "linear" },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-indigo-400/20"
            animate={{ rotate: -360, scale: [1.05, 1, 1.05] }}
            transition={{
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        </div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="container mx-auto max-w-4xl relative z-10 text-center"
        >
          {/* Section Heading Badge — Consistent with About Us */}
          <motion.div
            className="flex justify-center mb-8"
            variants={fadeInUp}
          >
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full border"
              style={{
                background: "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(99,102,241,0.15) 100%)",
                borderColor: "rgba(59,130,246,0.3)",
              }}
              animate={{
                boxShadow: [
                  "0 0 0px rgba(59,130,246,0)",
                  "0 0 20px rgba(59,130,246,0.2)",
                  "0 0 0px rgba(59,130,246,0)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.span
                className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500"
                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <span className="text-blue-900 dark:text-blue-400 font-bold text-sm tracking-widest uppercase">
                Explore Excellence
              </span>
              <motion.span
                className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500"
                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: 0.7 }}
              />
            </motion.div>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            whileInView={{
              y: [0, -5, 0],
            }}
            transition={{
              y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-blue-950 dark:text-white mb-6 drop-shadow-md tracking-tight"
          >
            Our Courses
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-blue-900/80 dark:text-blue-100/70 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Our Digital Marketing Course in Nashik is designed for students, job seekers, and entrepreneurs. Learn SEO, social media marketing, content marketing, and paid advertising with hands-on experience and live projects.
          </motion.p>

          {/* Search Bar — Upgraded Interaction */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            className="max-w-lg mx-auto relative group rounded-full"
          >
            {/* Rich Animated glow ring */}
            <motion.div
              className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 opacity-20 blur-lg transition-opacity duration-700 pointer-events-none group-focus-within:opacity-40"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                scale: [1, 1.05, 1]
              }}
              transition={{
                backgroundPosition: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              style={{ backgroundSize: "200% 200%" }}
            />

            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Icon icon="solar:magnifer-linear" className="text-gray-400 w-6 h-6 group-focus-within:text-blue-600 transition-all duration-300 group-focus-within:scale-110" />
            </div>
            <input
              type="text"
              placeholder="Search your future course..."
              className="w-full pl-14 pr-14 py-4 md:py-4.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-gray-800 dark:text-gray-100 text-lg transition-all border border-gray-100 dark:border-gray-800 focus:border-blue-500/30 font-semibold"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.5, x: 10 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                  title="Clear search"
                >
                  <Icon icon="solar:close-circle-linear" className="w-7 h-7" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories & Filter Tabs — Static All Courses + Slow Marquee */}
      <section className="container mx-auto max-w-7xl px-4 -mt-20 relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
          className="bg-white/70 dark:bg-gray-900/70 p-3 rounded-2xl md:rounded-3xl shadow-xl border border-white/50 dark:border-gray-800/50 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3">
            {/* Pinned "All Courses" button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveCategory("all");
                setPage(1);
              }}
              className={`
                relative whitespace-nowrap px-8 py-3.5 rounded-xl md:rounded-2xl font-black transition-all duration-300 uppercase tracking-wider text-sm flex-shrink-0
                ${activeCategory === "all"
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-blue-600 hover:shadow-md'}
              `}
            >
              All Courses
            </motion.button>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>

            {/* Scrolling marquee of category names */}
            <div className="overflow-hidden flex-1 relative">
              {/* Fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/70 dark:from-gray-900/70 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/70 dark:from-gray-900/70 to-transparent z-10 pointer-events-none"></div>

              <div className="marquee-track flex items-center gap-3 py-1">
                <div className="marquee-content flex items-center gap-3 flex-shrink-0">
                  {categories.map((cat: any) => (
                    <button
                      key={cat._id}
                      onClick={() => {
                        setActiveCategory(cat._id);
                        setPage(1);
                      }}
                      className={`
                        relative overflow-hidden whitespace-nowrap px-8 py-3.5 rounded-xl md:rounded-2xl font-black transition-all duration-300 uppercase tracking-wider text-sm flex-shrink-0
                        ${activeCategory === cat._id
                          ? "bg-blue-600 text-white shadow-xl shadow-blue-600/30"
                          : "text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-blue-600 hover:shadow-md"}
                      `}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
                {/* Duplicate for seamless loop — hidden from screen readers */}
                <div className="marquee-content flex items-center gap-3 flex-shrink-0" aria-hidden="true">
                  {categories.map((cat: any) => (
                    <button
                      key={`${cat._id}-dup`}
                      onClick={() => {
                        setActiveCategory(cat._id);
                        setPage(1);
                      }}
                      className={`
                        relative overflow-hidden whitespace-nowrap px-8 py-3.5 rounded-xl md:rounded-2xl font-black transition-all duration-300 uppercase tracking-wider text-sm flex-shrink-0
                        ${activeCategory === cat._id
                          ? "bg-blue-600 text-white shadow-xl shadow-blue-600/30"
                          : "text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-blue-600 hover:shadow-md"}
                      `}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Marquee CSS */}
        <style jsx>{`
          .marquee-track {
            display: flex;
            width: max-content;
            animation: marquee-scroll 120s linear infinite;
          }
          .marquee-track:hover {
            animation-play-state: paused;
          }
          @keyframes marquee-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* Courses Grid — Higher Visual Impact */}
      <section className="container mx-auto max-w-7xl px-4 pt-8 pb-20">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            >
              {[...Array(8)].map((_, i) => (
                <CourseSkeleton key={i} />
              ))}
            </motion.div>
          ) : courses.length > 0 ? (
            <motion.div
              key="grid"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            >
              {courses.map((course: any, idx: number) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 50, scale: 0.92 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.6,
                    delay: (idx % 4) * 0.12,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                  whileHover={{
                    y: -12,
                    scale: 1.03,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                  className="rounded-[28px]"
                >
                  <div className="relative group/card-wrapper">
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[28px] opacity-0 group-hover/card-wrapper:opacity-20 blur-md transition-opacity duration-500" />
                    <CourseCard course={course} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-courses"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="text-center py-28 bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl shadow-blue-900/5 dark:shadow-none border border-dashed border-gray-200 dark:border-gray-800 relative overflow-hidden"
            >
              {/* Background Swirl for Empty State */}
              <motion.div
                className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/10"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <motion.div
                animate={{
                  rotate: [0, 8, -8, 0],
                  y: [0, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block relative z-10"
              >
                <div className="w-24 h-24 flex items-center justify-center rounded-3xl bg-blue-50 dark:bg-blue-900/30 text-blue-300 dark:text-blue-700 mx-auto mb-8">
                  <Icon icon="solar:document-add-linear" className="w-16 h-16" />
                </div>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-black text-gray-700 dark:text-gray-200 relative z-10 tracking-tight"
              >
                No courses found
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-400 dark:text-gray-500 text-lg mt-3 relative z-10 font-medium"
              >
                Our team is crafting new content. Try adjusting your search!
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="mt-10 px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors relative z-10 shadow-lg shadow-blue-500/30"
              >
                Clear all filters
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

    </div>
  );
};

export default CoursePage;
