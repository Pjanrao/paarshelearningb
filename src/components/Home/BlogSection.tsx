"use client";

import React, { useEffect, useState } from "react";
import BlogCard from "@/app/(site)/blog/BlogCard";
import Link from "next/link";
import { Icon } from "@iconify/react";

type AdminBlog = {
    _id: string;
    title: string;
    coverImage?: string;
    author: { name: string };
    publishedDate: string;
    tags: string[];
};

const BlogSection = () => {
    const [posts, setPosts] = useState<AdminBlog[]>([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch("/api/blogs?limit=3");
                if (!response.ok) {
                    throw new Error("Failed to load blogs");
                }

                const data = await response.json();
                const blogPosts: AdminBlog[] = Array.isArray(data.blogs) ? data.blogs : [];
                setPosts(blogPosts.slice(0, 3));
            } catch (error) {
                console.error("Failed to fetch admin blogs:", error);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <section className="py-10 lg:py-24 bg-white dark:bg-darkmode" id="blog">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6" data-aos="fade-up" data-aos-duration="1000">
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
                    {posts.map((post, index) => (
                        <div key={post._id} data-aos="fade-up" data-aos-delay={index * 200} data-aos-duration="1000">
                            <BlogCard blog={{
                                id: post._id,
                                title: post.title,
                                coverImage: post.coverImage || "",
                                author: post.author?.name || "Admin",
                                date: new Date(post.publishedDate).toLocaleDateString("en-GB"),
                                tags: post.tags || [],
                            }} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
