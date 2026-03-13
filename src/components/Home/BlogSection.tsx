"use client";

import React, { useEffect, useState } from "react";
import BlogCard from "@/app/(site)/blog/BlogCard";
import Link from "next/link";
import { Icon } from "@iconify/react";

const BlogSection = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestBlogs = async () => {
            try {
                const response = await fetch("/api/blogs?limit=3");
                const data = await response.json();
                if (response.ok) {
                    setBlogs(data.blogs);
                }
            } catch (error) {
                console.error("Error fetching latest blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestBlogs();
    }, []);

    if (loading) {
        return (
            <section className="py-16 lg:py-24 bg-white dark:bg-darkmode" id="blog">
                <div className="container mx-auto max-w-6xl px-4 text-center">
                    <p className="text-gray-500 animate-pulse">Loading updates...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-10 lg:py-24 bg-white dark:bg-darkmode" id="blog">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                    <div className="text-left">
                        <div className="inline-flex items-center gap-2 bg-primary/5 dark:bg-primary/20 px-4 py-1.5 rounded-full border border-primary/10 mb-4">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="font-bold text-primary dark:text-primary-light text-xs uppercase tracking-widest">
                                Latest Updates
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-primary dark:text-white leading-tight">
                            Our Latest <span className="text-secondary">Blog & News</span>
                        </h2>
                    </div>

                    <Link
                        href="/blog"
                        className="group w-fit flex items-center gap-2 bg-white dark:bg-slate-800 border border-primary/10 hover:border-secondary hover:text-secondary text-primary dark:text-white px-8 py-3.5 rounded-2xl font-bold transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
                    >
                        View More Blogs
                        <Icon icon="solar:arrow-right-outline" className="text-xl group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {blogs.map((blog) => (
                        <div key={blog._id}>
                            <BlogCard blog={{
                                id: blog._id,
                                title: blog.title,
                                coverImage: blog.coverImage,
                                author: blog.author.name,
                                date: new Date(blog.publishedDate).toLocaleDateString(),
                                tags: blog.tags
                            }} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
