import React from "react";
import Link from "next/link";

const BlogHero = () => {
    return (
        <section className="relative py-15 lg:py-20 overflow-hidden bg-[#001f3f] mt-24 md:mt-28">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -mr-24 mt-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-50 ring-1 ring-white/5 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -ml-24 mt-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-30 ring-1 ring-white/5"></div>

            <div className="container mx-auto max-w-6xl px-4 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                    <span className="font-bold text-blue-200 text-xs uppercase tracking-[0.2em]">
                        Explore Our Stories
                    </span>
                </div>

                <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-8 tracking-tight max-w-4xl mx-auto">
                    Learn, Explore & Grow with <span className="text-blue-400">Our Blogs</span>
                </h1>

                <p className="text-lg md:text-xl text-blue-100/70 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                    Discover insights, tips, and learning resources curated by experts to
                    help you stay ahead in your career journey.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link
                        href="/"
                        className="group flex items-center gap-3 bg-white text-[#001f3f] px-8 py-4 rounded-2xl font-black transition-all duration-300 shadow-xl shadow-blue-900/40 hover:scale-105 active:scale-95"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BlogHero;