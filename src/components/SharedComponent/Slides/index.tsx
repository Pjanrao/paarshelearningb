"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const Slides = () => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [transitionEnabled, setTransitionEnabled] = useState(true);
    const [partners, setPartners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const staticAchievements = [
        { src: "/images/achievements/tata.png", alt: "Tata logo", size: 0.8 },
        { src: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg", alt: "Infosys logo" },
        { src: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg", alt: "IBM logo" },
        { src: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg", alt: "Wipro logo" },
        { src: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg", alt: "Accenture logo" },
        { src: "/images/achievements/microsoft.jpg", alt: "Microsoft logo" },
        { src: "/images/achievements/google.webp", alt: "Google logo" },
        { src: "/images/achievements/amazon.png", alt: "Amazon logo" },
    ];

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await fetch("/api/industry-partners");
                const data = await response.json();
                if (response.ok && data.success && data.data && data.data.length > 0) {
                    const activePartners = data.data
                        .filter((p: any) => p.isActive)
                        .map((p: any) => ({
                            src: p.logoUrl,
                            alt: p.name,
                            size: p.size || 1
                        }));
                    setPartners(activePartners);
                } else {
                    setPartners(staticAchievements);
                }
            } catch (error) {
                console.error("Error fetching partners:", error);
                setPartners(staticAchievements);
            } finally {
                setLoading(false);
            }
        };

        fetchPartners();
    }, []);

    const [visibleCount, setVisibleCount] = useState(4);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setVisibleCount(2);
            } else if (window.innerWidth < 1024) {
                setVisibleCount(3);
            } else {
                setVisibleCount(4);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const displayPartners = partners.length > 0 ? partners : staticAchievements;
    const totalSlides = displayPartners.length;
    const extendedSlides = [...displayPartners, ...displayPartners.slice(0, visibleCount)];

    useEffect(() => {
        if (totalSlides === 0) return;
        const interval = setInterval(() => {
            nextSlide();
        }, 3000);
        return () => clearInterval(interval);
    }, [totalSlides]);

    const nextSlide = () => {
        setCurrentIndex((prev) => prev + 1);
        setTransitionEnabled(true);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
        setTransitionEnabled(true);
    };

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider || totalSlides === 0) return;

        slider.style.transition = transitionEnabled ? "transform 0.7s ease" : "none";

        const translateX = (currentIndex * 100) / visibleCount;
        slider.style.transform = `translateX(-${translateX}%)`;

        if (currentIndex >= totalSlides) {
            setTimeout(() => {
                setTransitionEnabled(false);
                setCurrentIndex(0);
            }, 700);
        }
    }, [currentIndex, transitionEnabled, totalSlides, visibleCount]);

    if (loading && partners.length === 0) {
        return (
            <div className="w-full max-w-6xl mx-auto mb-10 mt-8 md:mt-20 h-28 flex items-center justify-center">
                <div className="animate-pulse flex space-x-12">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-12 w-32 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative overflow-hidden w-full max-w-6xl mx-auto mb-10 mt-8 md:mt-20 h-28 flex items-center"
            onMouseEnter={() => setTransitionEnabled(false)}
            onMouseLeave={() => setTransitionEnabled(true)}
        >
            <div
                ref={sliderRef}
                className="flex"
                style={{ width: `${(extendedSlides.length / visibleCount) * 100}%` }}
            >
                {extendedSlides.map((logo, idx) => (
                    <div
                        key={idx}
                        className="flex-shrink-0 flex justify-center items-center h-28 px-5"
                        style={{ width: `${100 / visibleCount}%` }}
                    >
                        <div 
                            className="relative group transition-transform hover:scale-110 duration-300"
                            style={{ 
                                width: `calc(${(logo.size || 1) * 80}%)`, 
                                height: `calc(${(logo.size || 1) * 80}%)`,
                            }}
                        >
                            <Image
                                src={logo.src}
                                alt={logo.alt || "Achievement logo"}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="object-contain drop-shadow-sm"
                                priority={idx < visibleCount}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Slides;