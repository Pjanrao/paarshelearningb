
// const sliderRef = useRef<HTMLDivElement>(null);
// const [transitionEnabled, setTransitionEnabled] = useState(true);
// const [currentIndex, setCurrentIndex] = useState(0);

// const achievements = [
//     { src: "/images/achievements/tata.png", alt: "Tata logo" },
//     { src: "/images/achievements/react.png", alt: "React logo", width: 250 },
//     { src: "/images/achievements/microsoft.jpg", alt: "Microsoft logo", width: 250 },
//     { src: "/images/achievements/google.webp", alt: "Google logo", width: 250 },
//     { src: "/images/achievements/amazon.png", alt: "Amazon logo", width: 250 },
// ];

// const visibleCount = 4;
// const totalSlides = achievements.length;

// const extendedSlides = [...achievements, ...achievements.slice(0, visibleCount)];

// useEffect(() => {
//     const interval = setInterval(() => {
//         setCurrentIndex((prev) => prev + 1);
//         setTransitionEnabled(true);
//     }, 3000);
//     return () => clearInterval(interval);
// }, []);

// useEffect(() => {
//     const slider = sliderRef.current;
//     if (!slider) return;

//     slider.style.transition = transitionEnabled ? "transform 0.7s ease" : "none";

//     const translateX = (currentIndex * 100) / visibleCount;
//     slider.style.transform = `translateX(-${translateX}%)`;

//     if (currentIndex >= totalSlides) {
//         setTimeout(() => {
//             setTransitionEnabled(false);
//             setCurrentIndex(0);
//         }, 700);
//     }
// }, [currentIndex, transitionEnabled, totalSlides]);
"use client";

import React, { useEffect } from "react";

const Index = () => {

    useEffect(() => {
        const counters = document.querySelectorAll<HTMLElement>(".counter");
        const speed = 400;

        counters.forEach((counter) => {
            let current = 0;
            const target = Number(counter.dataset.target);

            const updateCounter = () => {
                const increment = Math.ceil(target / speed);
                if (current < target) {
                    current += increment;
                    counter.innerText = current.toString();
                    setTimeout(updateCounter, 20);
                } else {
                    counter.innerText = target.toString();
                }
            };
            updateCounter();
        });
    }, []);

    return (
        <section className="py-8 lg:py-16 relative overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "url('/images/achievements/achievements.png')" }}>

            <div className="absolute inset-0 bg-blue-900/40 dark:bg-black/80 backdrop-blur-[2px]"></div>

            <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">

                <h2 className="
                    text-2xl
                    sm:text-3xl
                    lg:text-4xl
                    font-extrabold
                    text-center
                    text-white
                    mb-12
                    drop-shadow-lg
                ">
                    Our Achievements
                </h2>

                <div className="
                    max-w-2xl
                    mx-auto
                    text-center
                    p-3 sm:p-6
                    bg-white/10
                    backdrop-blur-xl
                    rounded-[2rem]
                    border border-white/20
                    shadow-2xl
                    mb-16 lg:mb-20
                ">
                    <p className="text-base sm:text-md text-white font-medium leading-relaxed">
                        Paarsh E-Learning is a Start-up based Edutech Company from Pune,
                        Nashik & Surat. We provide career-focused courses for students.
                    </p>
                </div>

                <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-4
                    gap-6 lg:gap-10
                    text-center">

                    {[
                        { target: 1280, label: "Happy Students" },
                        { target: 920, label: "Approved Courses" },
                        { target: 1250, label: "Certified Students" },
                        { target: 1200, label: "Activity Reporting" },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="
                                bg-transparent
                                rounded-2xl
                                p-4 sm:p-6
                                transition
                                duration-300
                                hover:-translate-y-2
                            "
                        >
                            <h3 className="
                                counter
                                text-3xl
                                sm:text-4xl
                                lg:text-5xl
                                font-black
                                text-white
                            " data-target={item.target}>
                                0
                            </h3>

                            <div className="h-1.5 w-12 sm:w-16 bg-white mx-auto my-6 rounded-full opacity-60"></div>

                            <p className="
                                uppercase
                                text-xs
                                sm:text-sm
                                font-bold
                                tracking-[0.2em]
                                text-blue-100
                            ">
                                {item.label}
                            </p>
                        </div>
                    ))}

                </div>

            </div>
        </section>
    );
};

export default Index;

