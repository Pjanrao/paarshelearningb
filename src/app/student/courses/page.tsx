"use client";
import { useState, useMemo } from "react";
import CourseCard from "@/components/SharedComponent/Course/CourseCard";
import { motion } from "framer-motion";
import {
    Clock,
    Star,
    ChevronRight,
    BookOpen,
    Filter,
    Search,
    Users
} from "lucide-react";

import Image from "next/image";
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import Link from "next/link";
import { coursesData } from "@/data/coursesData";
const courseImageMap: Record<string, string> = {
    "C Language": "/images/course/c.jpeg",
    "C++ Language": "/images/course/cpp.jpeg",
    "Python Programming": "/images/course/py.jpeg",
    "Java Programming": "/images/course/java.jpeg",
    "Kotlin Development": "/images/course/kotlin.jpeg",
    "Rust Programming": "/images/course/rust.jpeg",
    "SQL for Data Science": "/images/course/sql.jpeg",
    "Java Full Stack": "/images/course/javafull.jpeg",
};

export default function AvailableCoursesPage() {

    const [searchTerm, setSearchTerm] = useState("");

    const { data, isLoading } = useGetCoursesQuery({
        limit: 20,
        status: "active" as any,
        search: searchTerm
    });

    const keywordMapping: Record<string, string[]> = {
        "web design": ["mern", "full stack", "wordpress", "php", "javascript", "react", "front-end", "ui/ux"],
        "web development": ["mern", "full stack", "wordpress", "php", "javascript", "react", "node.js", "back-end"],
        "app design": ["flutter", "kotlin", "java", "mobile", "ios", "android", "react native"],
        "app development": ["flutter", "kotlin", "java", "mobile", "ios", "android", "react native"],
        "data analyst": ["sql", "python", "nlp", "machine learning", "data science"],
        "programming": ["c language", "c++", "python", "java", "rust", "kotlin"]
    };

    const filteredCourses = useMemo(() => {
        let allCourses = data?.courses || [];

        // Fallback to static courses if backend returns no courses
        if (!isLoading && allCourses.length === 0) {
            allCourses = coursesData.map(c => ({
                _id: c.id.toString(),
                name: c.name,
                shortDescription: c.shortDesc,
                duration: c.duration ? parseInt(c.duration) : 8,
                category: { name: c.category },
                fee: c.fee
            })) as any[];
        }

        if (!searchTerm.trim()) return allCourses;

        const lowerSearch = searchTerm.toLowerCase().trim();

        // Check for keyword mappings
        let mappedTerms: string[] = [];
        for (const [key, values] of Object.entries(keywordMapping)) {
            if (lowerSearch.includes(key) || key.includes(lowerSearch)) {
                mappedTerms = [...mappedTerms, ...values];
            }
        }

        return allCourses.filter(course => {
            const name = course.name.toLowerCase();
            const category = course.category?.name?.toLowerCase() || "";
            const description = course.shortDescription?.toLowerCase() || "";

            // Direct match
            if (name.includes(lowerSearch) || category.includes(lowerSearch) || description.includes(lowerSearch)) {
                return true;
            }

            // Mapped keyword match
            return mappedTerms.some(term =>
                name.includes(term) || category.includes(term) || description.includes(term)
            );
        });
    }, [data, isLoading, searchTerm]);

    const courses = filteredCourses;
    const getCourseImage = (name: string) => {
        for (const [key, value] of Object.entries(courseImageMap)) {
            if (name.toLowerCase().includes(key.toLowerCase())) {
                return value;
            }
        }
        return "/images/course/architecture.jpeg";
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 pb-12">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1e293b]">
                        Available Courses
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Explore our professional courses and upgrade your skills.
                    </p>
                </div>

                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">

                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 shadow-sm w-full sm:w-auto">                        <Filter size={16} /> Filters
                    </button>

                    <div className="relative w-full">
                        <Search
                            className="pl-9 pr-4 py-2 text-sm w-full bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B4276]/20 focus:border-[#2B4276] outline-none shadow-sm" size={16}
                        />

                        <input
                            type="text"
                            placeholder="Search course..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B4276]/20 focus:border-[#2B4276] outline-none shadow-sm"
                        />
                    </div>

                </div>

            </div>


            {/* Courses Grid */}
            {isLoading ? (

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">

                    {[...Array(8)].map((_, i) => (

                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 shadow animate-pulse">

                            <div className="bg-gray-200 h-40 w-full rounded-xl mb-4"></div>

                            <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>

                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>

                        </div>

                    ))}

                </div>

            ) : (

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                    {courses.map((course: any, index: number) => (

                        <motion.div
                            key={course._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -6 }}
                        >
                            <CourseCard
                                course={{
                                    _id: course._id,
                                    name: course.name,
                                    slug: course.slug, // may be undefined → handled in card
                                    thumbnail: course.thumbnail, // fallback image
                                    shortDescription: course.shortDescription,
                                    duration: course.duration,
                                    level: course.level,
                                    rating: course.rating,
                                    fee: course.fee,
                                    category: course.category
                                }}
                            />
                        </motion.div>

                    ))}

                </div>

            )}

            {/* Empty State */}
            {!isLoading && courses.length === 0 && (

                <div className="text-center py-16 sm:py-20 px-4">
                    <BookOpen className="mx-auto text-gray-300 mb-4" size={50} />

                    <h3 className="font-bold text-lg text-gray-700">
                        No Courses Available
                    </h3>

                    <p className="text-gray-500 text-sm">
                        New courses will appear here soon.
                    </p>

                </div>

            )}

        </div>
    );
}