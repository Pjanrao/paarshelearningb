'use client'

import React from 'react'
import CourseCard from '@/components/SharedComponent/Course/CourseCard'
import { motion } from 'framer-motion'
import { useRouter } from "next/navigation";
import { useGetCoursesQuery } from "@/redux/api/courseApi";

interface CounterProps {
  isColorMode: boolean
}

const Counter: React.FC<CounterProps> = ({ isColorMode }) => {
  const router = useRouter();
  const { data, isLoading } = useGetCoursesQuery({ limit: 50 }); // Fetch more for better variety
  
  const courses = React.useMemo(() => {
    if (!data?.courses) return [];
    
    // Shuffle all courses
    const allCourses = [...data.courses];
    
    // Fisher-Yates Shuffle
    for (let i = allCourses.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allCourses[i], allCourses[j]] = [allCourses[j], allCourses[i]];
    }
    
    return allCourses.slice(0, 16); // Increased to 16 random courses (15+ as requested)
  }, [data]);

  return (
    <section className={isColorMode ? 'bg-section' : 'bg-white'}>
      <div className="container mx-auto max-w-7xl px-2 py-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full"
        >
          <div className="bg-gradient-to-br from-[#2C4276] via-[#2FA8E1]/20 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 rounded-3xl p-6 md:p-10 flex flex-col lg:flex-row gap-8">

            {/* LEFT SIDE */}
            <div className="lg:w-1/3 flex flex-col justify-center space-y-4 text-left">
              <div className="flex justify-start">
                <span className="inline-block px-4 py-1 bg-[#2FA8E1] rounded-full text-xs font-semibold text-white shadow-sm">
                  Featured Collection
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-[#2C4276] dark:text-white leading-tight text-left">
                  Top Rated Course
                </h2>

                <p className="text-[#2C4276]/80 dark:text-white/80 text-base leading-relaxed">
                  Explore our hand-picked selection of top professional courses.
                  Level up your skills today!
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => router.push("/Course")}
                  className="
    group flex items-center gap-2 px-6 py-3 bg-[#2C4276] text-white
    rounded-xl font-bold text-base shadow-lg shadow-[#2C4276]/20
    hover:bg-[#1e2e54] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-fit
  "
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                  </svg>
                  <span>Start Your Career Today</span>
                </button>
              </div>

            </div>

            {/* RIGHT SIDE COURSE SLIDER */}
            <div className="lg:w-2/3 flex items-center">
              <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory w-full scrollbar-hide">
                {isLoading ? (
                  <div className="flex justify-center items-center w-full min-h-[200px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C4276]"></div>
                  </div>
                ) : (
                  courses.map(course => (
                    <motion.div
                      key={course._id}
                      className="snap-start min-w-[280px] max-w-[280px]"
                      whileHover={{ scale: 1.05 }}
                    >
                      <CourseCard course={course as any} />
                    </motion.div>
                  ))
                )}
              </div>
            </div>

          </div>
        </motion.div>
      </div >
    </section >
  )
}

export default Counter