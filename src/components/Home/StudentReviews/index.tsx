// "use client";

// import React from "react";
// import Image from "next/image";
// import { Star } from "lucide-react";

// interface Review {
//     id: number;
//     name: string;
//     course: string;
//     avatar: string;
//     reviewTitle: string;
//     reviewText: string;
//     rating: number;
//     badgeText: string;
//     badgeIcon: string;
// }

// const reviews: Review[] = [
//     {
//         id: 1,
//         name: "David Wilson",
//         course: "Course Sbehr paent.",
//         avatar: "/images/hero/hero-profile-1.jpg",
//         reviewTitle: "Complete Web Development Bootcamp",
//         reviewText: "This course was thoroughly engaging and helped me land a web development job. Highly recommend!",
//         rating: 5,
//         badgeText: "Complete Web Development Bootcamp",
//         badgeIcon: "💻"
//     },
//     {
//         id: 2,
//         name: "Sarah Johnson",
//         course: "", 
//         avatar: "/images/hero/hero-profile-2.jpg",
//         reviewTitle: "Data Science & Machine Learning",
//         reviewText: "Excellent course with clear explanations. I now feel confident in applying data science techniques!",
//         rating: 5,
//         badgeText: "Data Science & Machine Learning",
//         badgeIcon: "📊"
//     },
//     {
//         id: 3,
//         name: "Michael Lee",
//         course: "Advanced Python Programming.",
//         avatar: "/images/hero/hero-profile-3.jpg", 
//         reviewTitle: "Advanced Python Programming",
//         reviewText: "The course was challenging but highly rewarding. I feel prepared for advanced Python projects.",
//         rating: 5,
//         badgeText: "Advanced Python Programming",
//         badgeIcon: "🐍"
//     }
// ];

// const ReviewCard = ({ review }: { review: Review }) => {
//     return (
//         <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/5 flex flex-col h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">

//             <div className="flex items-center gap-4 mb-8">
//                 <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 dark:border-gray-700">
//                     <Image src={review.avatar} alt={review.name} width={64} height={64} className="object-cover" />
//                 </div>
//                 <div>
//                     <h4 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{review.name}</h4>
//                     <p className="text-gray-500 dark:text-gray-400 text-sm">{review.course}</p>
//                 </div>
//             </div>


//             <div className="flex-grow">
//                 <h5 className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-4 leading-snug">
//                     {review.reviewTitle}
//                 </h5>

//                 <div className="flex gap-1 mb-6">
//                     {[...Array(review.rating)].map((_, i) => (
//                         <Star key={i} size={18} fill="#facc15" className="text-yellow-400" />
//                     ))}
//                 </div>

//                 <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg mb-8">
//                     {review.reviewText}
//                 </p>
//             </div>


//             <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/10 flex items-center gap-3">
//                 <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-xl">
//                     {review.badgeIcon}
//                 </div>
//                 <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
//                     {review.badgeText}
//                 </span>
//             </div>
//         </div>
//     );
// };

// const StudentReviews = () => {
//     return (
//         <section className="py-20 md:py-32 bg-[#f0f7ff] dark:bg-[#111827]">
//             <div className="container mx-auto px-4 max-w-7xl">
//                 <div className="text-center mb-16 md:mb-24">
//                     <h2 className="text-4xl md:text-5xl font-extrabold text-blue-950 dark:text-white mb-6">
//                         Student Reviews
//                     </h2>
//                     <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full" />
//                 </div>

//                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
//                     {reviews.map((review) => (
//                         <ReviewCard key={review.id} review={review} />
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default StudentReviews;


"use client";

import React from "react";
import Image from "next/image";
import { Star, User } from "lucide-react";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";

interface Review {
    id: number;
    name: string;
    course: string;
    avatar: string | React.ReactNode;
    reviewTitle: string;
    reviewText: string;
    rating: number;
    badgeText: string;
    badgeIcon: string;
}

const reviews: Review[] = [
    {
        id: 1,
        name: "David",
        course: "Web Development",
        avatar: (
            <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <User size={24} />
            </div>
        ),
        reviewTitle: "Complete Web Development",
        reviewText: "This course was thoroughly engaging and helped me land a job. Highly recommend!",
        rating: 5,
        badgeText: "Web Development",
        badgeIcon: "💻"
    },
    {
        id: 2,
        name: "Sarah",
        course: "Data Science",
        avatar: (
            <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <User size={24} />
            </div>
        ),
        reviewTitle: "Data Science & ML",
        reviewText: "Excellent course with clear explanations. Confident in applying techniques!",
        rating: 5,
        badgeText: "Data Science",
        badgeIcon: "📊"
    },
    {
        id: 3,
        name: "Micky",
        course: "Python Programming",
        avatar: (
            <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <User size={24} />
            </div>
        ),
        reviewTitle: "Advanced Python",
        reviewText: "The course was rewarding. I feel prepared for advanced projects.",
        rating: 5,
        badgeText: "Python",
        badgeIcon: "🐍"
    }
];

const ReviewCard = ({ review }: { review: Review }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/5 flex flex-col h-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100 dark:border-gray-700">
                    {typeof review.avatar === 'string' ? (
                        <Image src={review.avatar} alt={review.name} width={48} height={48} className="object-cover" />
                    ) : (
                        review.avatar
                    )}
                </div>
                <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{review.name}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">{review.course}</p>
                </div>
            </div>


            <div className="flex-grow">
                <h5 className="text-lg font-bold text-blue-900 dark:text-blue-400 mb-2 leading-snug">
                    {review.reviewTitle}
                </h5>

                <div className="flex gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="#facc15" className="text-yellow-400" />
                    ))}
                </div>

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm mb-4 line-clamp-3">
                    {review.reviewText}
                </p>
            </div>


            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/10 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-sm">
                    {review.badgeIcon}
                </div>
                <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">
                    {review.badgeText}
                </span>
            </div>
        </div>
    );
};

const StudentReviews = () => {
    return (
        <section className="py-12 md:py-20 bg-[#f0f7ff] dark:bg-[#111827]">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-left mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950 dark:text-white mb-4">
                        Student Reviews
                    </h2>
                    <div className="w-20 h-1.5 bg-blue-600 rounded-full" />
                </div>

                <div className="relative">
                    <Carousel opts={{ align: "start" }} className="w-full">
                        <CarouselContent>
                            {reviews.map((review) => (
                                <CarouselItem key={review.id} className="basis-[85%] md:basis-1/2 lg:basis-1/3">
                                    <div className="p-2 h-full">
                                        <ReviewCard review={review} />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
        </section>
    );
};

export default StudentReviews;
