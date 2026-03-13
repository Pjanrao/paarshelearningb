
"use client";

import React from "react";
import Link from "next/link";

interface Blog {
    id: string;
    title: string;
    coverImage: string;
    author: string;
    date: string;
    tags: string[];
    content?: string;
}

interface BlogCardProps {
    blog: Blog;
}

const resolveImagePath = (url: string) => {
    if (!url) return "/images/blog/blog1.png"; // Use an existing valid blog image as fallback
    if (url.startsWith("http") || url.startsWith("/")) return url;
    return `/images/blog/${url}`;
};

const BlogCard = ({ blog }: BlogCardProps) => {
    return (
        <Link href={`/blog/${blog.id}`} className="group bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm flex flex-col h-full">
            <div className="relative overflow-hidden aspect-video">
                <img
                    src={resolveImagePath(blog.coverImage)}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                />
                {blog.tags && blog.tags.length > 0 && (
                    <div className="absolute top-4 left-4">
                        <span className="bg-[#2C4276] backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] shadow-lg">
                            {blog.tags[0]}
                        </span>
                    </div>
                )}
            </div>
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4 text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                        {blog.date}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-blue-300"></span>
                    <span>5 min read</span>
                </div>
                <h3 className="text-xl font-bold text-[#001f3f] group-hover:text-[#2C4276] transition-colors leading-[1.3] mb-4 text-left line-clamp-2">
                    {blog.title}
                </h3>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-50">
                    <div className="w-8 h-8 rounded-full bg-[#2C4276] flex items-center justify-center text-white font-bold text-xs uppercase">
                        {blog.author?.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-gray-700">{blog.author}</span>
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;
