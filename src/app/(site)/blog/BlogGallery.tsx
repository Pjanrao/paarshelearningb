"use client";

import React, { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import { Loader2 } from "lucide-react";

const BlogGallery = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch("/api/blogs");
                const data = await response.json();
                if (response.ok) {
                    setBlogs(data.blogs);
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-gray-500 animate-pulse">Fetching our latest stories...</p>
            </div>
        );
    }

    return (
        <section className="py-20 lg:py-28 bg-white dark:bg-darkmod -mt-18">
            <div className="container mx-auto max-w-6xl px-4 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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

export default BlogGallery;
