'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ArrowLeft, Clock, Tag, User, Share2, BookOpen } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function BlogPostPage() {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [copied, setCopied] = useState(false);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    useEffect(() => {
        if (!slug) return;
        fetch(`/api/blogs/${slug}`)
            .then((res) => {
                if (!res.ok) { setNotFound(true); return null; }
                return res.json();
            })
            .then((data) => {
                if (!data) return;
                setPost(data.blog);
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [slug]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const resolveImagePath = (url: string) => {
        if (!url) return '/images/blog/blog1.png';
        if (url.startsWith('http') || url.startsWith('/')) return url;
        return `/images/blog/${url}`;
    };

    // Estimate reading time
    const readingTime = post?.content
        ? Math.max(5, Math.ceil(post.content.split(/\s+/).length / 200))
        : 5;

    if (loading) { 
        return (
            <div className="bg-[#F8FAFC] min-h-screen pt-24">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-200 rounded-lg w-24" />
                        <div className="h-80 bg-gray-200 rounded-3xl w-full" />
                        <div className="space-y-4 pt-4">
                            <div className="h-10 bg-gray-200 rounded-xl w-3/4" />
                            <div className="h-5 bg-gray-200 rounded-md w-1/3" />
                            <div className="space-y-3 pt-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-4 bg-gray-100 rounded w-full" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (notFound || !post) {
        return (
            <div className="bg-[#F8FAFC] min-h-screen flex flex-col items-center justify-center text-center p-4 gap-6">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                    <BookOpen className="text-[#01A0E2] w-10 h-10" />
                </div>
                <h1 className="text-3xl font-black text-[#2B4278]">Post Not Found</h1>
                <p className="text-gray-500 max-w-sm">This article doesn't exist or may have been removed.</p>
                <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 bg-[#01A0E2] text-white font-bold rounded-xl hover:bg-[#2B4278] transition-all shadow-lg shadow-[#01A0E2]/20">
                    <ArrowLeft size={18} /> Back to Blogs
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#F8FAFC] min-h-screen">
            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#01A0E2] to-[#2B4278] origin-left z-[100]"
                style={{ scaleX }}
            />

            <main className="pt-20 pb-24">

                {/* ── Hero Section ── */}
                <div className="relative w-full overflow-hidden">
                    {post.coverImage ? (
                        <div className="relative w-full h-[55vh] md:h-[65vh]">
                            <img
                                src={resolveImagePath(post.coverImage)}
                                alt={post.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f2c] via-[#0a0f2c]/60 to-transparent mt-20" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f2c]/40 via-transparent to-transparent" />
                        </div>
                    ) : (
                        <div className="w-full h-[40vh] bg-gradient-to-br from-[#2B4278] via-[#1a2d5a] to-[#01A0E2]" />
                    )}

                    {/* Hero Content Overlay */}
                    <div className="absolute inset-0 flex items-end">
                        <div className="container mx-auto px-4 max-w-5xl pb-10 md:pb-16">

                            {/* Back Link */}
                            <Link href="/blog" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors text-sm font-medium group">
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Back to Blogs
                            </Link>

                            {/* Tags */}
                            {post.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-5">
                                    {post.tags.map((tag: string, i: number) => (
                                        <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-[#01A0E2]/30 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-widest rounded-full border border-white/20">
                                            <Tag size={10} />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Title */}
                            <h1 className="text-xl md:text-2xl lg:text-2xl font-black text-white leading-tight mb-6 max-w-3xl drop-shadow-lg">
                                {post.title}
                            </h1>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-5 text-white/75 text-sm font-medium">
                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#01A0E2] to-[#2B4278] flex items-center justify-center text-white font-black text-base shadow-lg border-2 border-white/20">
                                        {post.author?.name?.charAt(0) || 'P'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm leading-none">{post.author?.name || 'Paarsh Team'}</p>
                                        <p className="text-[10px] uppercase tracking-widest text-white/60 mt-0.5">{post.author?.role || 'Author'}</p>
                                    </div>
                                </div>

                                <div className="w-px h-8 bg-white/20" />

                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-[#01A0E2]" />
                                    <span>{new Date(post.publishedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-[#01A0E2]" />
                                    <span>{readingTime} min read</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Content Card ── */}
                <div className="container mx-auto px-4 max-w-5xl -mt-2 relative z-10">
                    <div className="grid lg:grid-cols-12 gap-8 items-start">

                        {/* Main Article */}
                        <div className="lg:col-span-9">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                            >
                                {/* Article Body */}
                                <div className="p-6 md:p-10">
                                    <div className="prose prose-lg max-w-none
                                        prose-headings:text-[#2B4278] prose-headings:font-black
                                        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-base md:prose-p:text-[17px]
                                        prose-a:text-[#01A0E2] prose-a:no-underline hover:prose-a:underline
                                        prose-strong:text-[#2B4278]
                                        prose-li:text-gray-700
                                        prose-blockquote:border-l-[#01A0E2] prose-blockquote:bg-blue-50 prose-blockquote:py-1 prose-blockquote:rounded-r-xl
                                        prose-code:bg-blue-50 prose-code:text-[#01A0E2] prose-code:px-1.5 prose-code:rounded
                                    ">
                                        <div className="whitespace-pre-wrap text-gray-700 leading-[1.9] text-base md:text-[17px]">
                                            {post.content}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Divider + Tags + Share */}
                                <div className="px-6 md:px-10 py-6 border-t border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
                                    {/* Tags reprise */}
                                    {post.tags?.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {post.tags.map((tag: string, i: number) => (
                                                <span key={i} className="px-3 py-1 bg-blue-50 text-[#01A0E2] text-xs font-bold rounded-full border border-blue-100">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Share Button
                                    <button
                                        onClick={handleShare}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:border-[#01A0E2] hover:text-[#01A0E2] transition-all shadow-sm"
                                    >
                                        <Share2 size={15} />
                                        {copied ? 'Link Copied!' : 'Share'}
                                    </button> */}
                                </div>
                            </motion.div>

                            {/* Back to Blogs CTA */}
                            <div className="mt-8 flex justify-center">
                                <Link href="/blog" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#01A0E2] text-white font-bold rounded-xl hover:bg-[#2B4278] transition-all shadow-lg shadow-[#01A0E2]/20 text-sm">
                                    <ArrowLeft size={16} /> Browse More Articles
                                </Link>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:col-span-3 self-start sticky top-24 space-y-5">

                            {/* Author Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.15 }}
                                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
                            >
                                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">Written by</p>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#01A0E2] to-[#2B4278] flex items-center justify-center text-white font-black text-lg shadow">
                                        {post.author?.name?.charAt(0) || 'P'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#2B4278] text-sm">{post.author?.name || 'Paarsh Team'}</p>
                                        <p className="text-xs text-gray-400">{post.author?.role || 'Author'}</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Quick Info Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.25 }}
                                className="bg-gradient-to-br from-[#2B4278] to-[#01A0E2] rounded-2xl p-5 shadow-lg text-white"
                            >
                                <p className="text-[10px] uppercase tracking-widest font-bold text-white/60 mb-4">Article Info</p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                            <Calendar size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/60">Published</p>
                                            <p className="text-xs font-bold">{new Date(post.publishedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                            <Clock size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/60">Read Time</p>
                                            <p className="text-xs font-bold">{readingTime} min read</p>
                                        </div>
                                    </div>
                                    {post.tags?.length > 0 && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                                <Tag size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-white/60">Category</p>
                                                <p className="text-xs font-bold capitalize">{post.tags[0]}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Share Card */}
                            {/* <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.35 }}
                                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center"
                            >
                                <p className="text-xs font-bold text-gray-500 mb-3">Enjoyed this article?</p>
                                <button
                                    onClick={handleShare}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#01A0E2] text-white text-sm font-bold rounded-xl hover:bg-[#2B4278] transition-all shadow-md shadow-[#01A0E2]/20"
                                >
                                    <Share2 size={15} />
                                    {copied ? 'Copied!' : 'Share this Post'}
                                </button>
                            </motion.div> */}

                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
}
