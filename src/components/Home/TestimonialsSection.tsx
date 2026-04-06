"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import TestimonialFormModal from "./TestimonialFormModal";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function TestimonialsSection() {
    const [liveTestimonials, setLiveTestimonials] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);

    const fetchTestimonials = () => {
        setLoading(true);
        fetch("/api/testimonial")
            .then((res) => res.json())
            .then((data) => {
                const fetchedData = data.success ? data.data : data;
                if (Array.isArray(fetchedData)) {
                    setLiveTestimonials(fetchedData);
                }
            })
            .catch(() => setLiveTestimonials([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    return (
        <section id="testimonial" className="bg-[#f0f7ff] dark:bg-[#111827]">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="text-left max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-headline font-bold text-blue-950 dark:text-white">
                            What Our Students Say
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Success stories from our alumni who have transformed their careers.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="rounded-full px-6 py-3 h-auto text-lg shadow-lg hover:scale-105 transition active:scale-95 bg-[#01A0E2] hover:bg-[#01A0E2] text-[#fff] border-none"
                    >
                        Share Your Success Story
                    </Button>
                </div>

                <TestimonialFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchTestimonials}
                />

                <div className="mt-12 relative">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : liveTestimonials.length > 0 ? (
                        <div className="px-4 md:px-12">
                            <Carousel opts={{ align: "start", loop: true }} className="w-full">
                                <CarouselContent>
                                    {liveTestimonials.map((testimonial: any, index: number) => (
                                        <CarouselItem
                                            key={testimonial._id || index}
                                            className="basis-full md:basis-1/2 lg:basis-1/3"
                                        >
                                            <div className="p-2 h-full">
                                                <Card className="h-full flex flex-col justify-between border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-800 rounded-3xl overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                                                    <CardContent className="pt-6 pb-2 px-6 flex flex-col h-full">
                                                        <div className="flex gap-1 mb-3">
                                                            {[...Array(testimonial.rating || 5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={15}
                                                                    fill="#facc15"
                                                                    className="text-yellow-400"
                                                                />
                                                            ))}
                                                        </div>
                                                        <div className="flex-grow">
                                                            <blockquote className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed italic line-clamp-4">
                                                                "{testimonial.message || testimonial.quote}"
                                                            </blockquote>
                                                        </div>
                                                        {(testimonial.message || testimonial.quote)?.length > 150 && (
                                                            <button
                                                                onClick={() => setSelectedTestimonial(testimonial)}
                                                                className="text-blue-600 dark:text-blue-400 text-xs font-semibold mt-2 hover:underline text-left w-fit"
                                                            >
                                                                Read More
                                                            </button>
                                                        )}
                                                    </CardContent>
                                                    <CardHeader className="flex-row items-center gap-3 bg-gray-50/50 dark:bg-gray-700/30 p-4">
                                                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-gray-600 shadow-sm flex-shrink-0">
                                                            <Image
                                                                src={testimonial.imageUrl || "/images/hero/user.png"}
                                                                alt={testimonial.name}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                            />
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{testimonial.name}</p>
                                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium truncate">
                                                                {testimonial.course}
                                                            </p>
                                                        </div>
                                                    </CardHeader>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                {liveTestimonials.length > 3 && (
                                    <>
                                        <CarouselPrevious className="hidden md:flex -left-6 lg:-left-12 bg-white dark:bg-gray-800 border-gray-100 hover:bg-blue-50 text-blue-600 shadow-lg" />
                                        <CarouselNext className="hidden md:flex -right-6 lg:-right-12 bg-white dark:bg-gray-800 border-gray-100 hover:bg-blue-50 text-blue-600 shadow-lg" />
                                    </>
                                )}
                            </Carousel>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white/50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">No success stories yet. Be the first to share yours!</p>
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={!!selectedTestimonial} onOpenChange={() => setSelectedTestimonial(null)}>
                <DialogContent className="max-w-2xl bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-4 mb-4">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-100">
                                <Image
                                    src={selectedTestimonial?.imageUrl || "/images/hero/user.png"}
                                    alt={selectedTestimonial?.name || ""}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-blue-950 dark:text-white">{selectedTestimonial?.name}</p>
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{selectedTestimonial?.course}</p>
                            </div>
                        </DialogTitle>
                        <DialogDescription className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed italic whitespace-pre-wrap">
                                "{selectedTestimonial?.message || selectedTestimonial?.quote}"
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-1 mt-4">
                        {[...Array(selectedTestimonial?.rating || 5)].map((_, i) => (
                            <Star key={i} size={18} fill="#facc15" className="text-yellow-400" />
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}
