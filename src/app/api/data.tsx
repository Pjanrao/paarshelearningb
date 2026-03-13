// 'use client'

// import React, { useState } from 'react'
// import { count } from '@/app/api/data'
// import Image from 'next/image'
// import Link from 'next/link'

// const coursesData = [
//   {
//     id: 1,
//     name: 'React Basics',
//     image: '/images/blog/blog-1.jpg',
//     slug: 'react-basics',
//     description: 'Learn React fundamentals',
//   },
//   {
//     id: 2,
//     name: 'Advanced React',
//     image: '/images/blog/blog-2.jpg',
//     slug: 'advanced-react',
//     description: 'Master advanced React patterns',
//   },
//   {
//     id: 3,
//     name: 'React with TypeScript',
//     image: '/images/blog/blog-3.jpg',
//     slug: 'react-typescript',
//     description: 'Build type-safe React apps',
//   },
//   {
//     id: 4,
//     name: 'Next.js Mastery',
//     image: '/images/blog/blog-4.jpg',
//     slug: 'nextjs-mastery',
//     description: 'Create full-stack applications',
//   },
// ]

// const Counter = ({ isColorMode }: { isColorMode: Boolean }) => {
//   const [courseIndex, setCourseIndex] = useState<number>(0)

//   const handleCoursePrev = () => {
//     setCourseIndex(
//       courseIndex - 1 < 0 ? coursesData.length - 1 : courseIndex - 1
//     )
//   }

//   const handleCourseNext = () => {
//     setCourseIndex((courseIndex + 1) % coursesData.length)
//   }

//   return (
//     <section
//       className={` ${isColorMode
//         ? 'dark:bg-darklight bg-section'
//         : 'dark:bg-darkmode bg-white'
//         }`}>
//       <div className='container mx-auto max-w-6xl px-4 py-16 md:py-24'>
//         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
//           {count.map((item, index) => (
//             <div
//               key={index}
//               className='flex flex-col items-center gap-[0.875rem] p-8 rounded-lg border border-gray-200 dark:border-gray-700 box-shadow-light dark:box-shadow-dark hover:shadow-lg transition-shadow duration-300'
//               data-aos='fade-up'
//               data-aos-delay={`${index * 200}`}
//               data-aos-duration='1000'>
//               <Image
//                 src={item.icon}
//                 alt='icon'
//                 width={30}
//                 height={30}
//                 unoptimized
//               />
//               <span className='text-3xl font-semibold text-midnight_text dark:text-white'>
//                 {item.value}
//               </span>
//               <p className='text-base text-grey text-center max-w-[17.8125rem] w-full dark:text-white/50'>
//                 {item.description}
//               </p>


//               <div className='relative w-full mt-8'>
//                 <p className='text-sm font-semibold text-midnight_text dark:text-white mb-4'>
//                   Popular Courses
//                 </p>
//                 <div className='relative bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden'>
//                   <div className='relative h-48 w-full'>
//                     <Image
//                       src={coursesData[courseIndex].image}
//                       alt={coursesData[courseIndex].name}
//                       fill
//                       className='object-cover'
//                       unoptimized
//                     />
//                   </div>

//                   <div className='p-4'>
//                     <h3 className='text-base font-semibold text-midnight_text dark:text-white mb-1'>
//                       {coursesData[courseIndex].name}
//                     </h3>
//                     <p className='text-sm text-grey dark:text-white/50 mb-4'>
//                       {coursesData[courseIndex].description}
//                     </p>

//                     <div className='flex justify-between items-center mb-4'>
//                       <button
//                         onClick={handleCoursePrev}
//                         className='p-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'>
//                         ❮
//                       </button>
//                       <span className='text-xs text-grey dark:text-white/50'>
//                         {courseIndex + 1} / {coursesData.length}
//                       </span>
//                       <button
//                         onClick={handleCourseNext}
//                         className='p-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'>
//                         ❯
//                       </button>
//                     </div>

//                     <Link
//                       href={`/course/${coursesData[courseIndex].slug}`}
//                       className='block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-md transition-colors'>
//                       View Details
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Counter


import { getImgPath } from "@/utils/image";

export const menuItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Blog", href: "/#blog" },
];

export const count = [
    {
        icon: getImgPath("/images/counter/star.svg"),
        value: "Top Rated Course",
        description: "",
    },
    {
        icon: getImgPath("/images/counter/admin.svg"),
        value: "Popular Course",
        description: "",
    },
    {
        icon: getImgPath("/images/counter/bag.svg"),
        value: "Non-I.T. Course",
        description: "",
    },
];

export const points = [
    { title: 'We Find New Learning Resources As They Interact With Information' },
    { title: 'Materials, And Ideas With Their Students' },
    { title: 'Our Teaching Is The Appreciation Of Live Teaching With Streaming Lectures' },
    { title: 'Industry Standard Syallbus' },
    { title: 'Downloadable Video’s' },
    { title: 'Slide Sets' },
    { title: '100% Job Placement Assistance' }
];

export const details = [
    { title: 'Beginner to Advanced' },
    { title: 'Duration: 6 Months' },
    { title: 'Certificate Included' },
    { title: 'Online & Offline Classes' },
];

export const curriculum = [
    {
        title: " Web Fundamentals",
        topics: "HTML, CSS, Flexbox, Grid, Responsive Design"
    },
    {
        title: "JavaScript",
        topics: " Basics, DOM, ES6, APIs, Async Programming"
    },
    {
        title: "React.js",
        topics: "Components, Hooks, Routing, API Integration"
    },
    {
        title: " Backend Development",
        topics: "Node.js, Express.js, REST APIs, Authentication"
    },
    {
        title: " Database & Deployment",
        topics: "MongoDB, SQL, GitHub, Cloud Deployment"
    }
];

export const point = [
    { title: 'Flexible training programs' },
    { title: 'Basic To Advanced' },
    { title: 'Learn From Experts' },
    { title: 'Boost Your Knowledge' },
    { title: 'Doubt clearing Sessions' },
    { title: 'Friendly environment for you' },
];

export const Servicebox = [
    {
        icon: getImgPath('/images/services/ux-design-product_1.svg'),
        title: 'Remote Classrooms',
        description: 'Run and Manage Interactive webinars to permit but personalized learning experience.',
    },
    {
        icon: getImgPath('/images/services/perfomance-optimization.svg'),
        title: 'Course Manager',
        description: 'Manage the courses your learners study from different sources and follow them to their individual needs.',
    },
    {
        icon: getImgPath('/images/services/ux-design-product_2.svg'),
        title: 'Paarsh E - Learn',
        description: 'Provide video, documents, or external links like Youtube-based intern training to complete the pieces of training.',
    },
    {
        icon: getImgPath('/images/services/ux-design-product_1.svg'),
        title: 'Scalable Pricing',
        description: 'Customize our flexible pricing strategies to suit our learner’s needs and budget.',
    },
    {
        icon: getImgPath('/images/services/perfomance-optimization.svg'),
        title: 'Certificates',
        description: 'Automatically add achievement certificates to the learner’s education tracker and whether studied online, offline, or via Google Meet.',
    },
    {
        icon: getImgPath('/images/services/ux-design-product_2.svg'),
        title: '24/7 Supports',
        description: 'Create an in-person or a virtual classroom session and track the attendance by Online Google Sheet.',
    },
]

export const portfolioinfo = [
    {
        image: getImgPath('/images/portfolio/cozycasa.png'),
        alt: 'Portfolio',
        title: 'Cozycasa',
        slug: 'Cozycasa',
        info: 'Designation',
        Class: 'md:mt-0'
    },
    {
        image: getImgPath('/images/portfolio/mars.png'),
        alt: 'Portfolio',
        title: 'Mars',
        slug: 'Mars',
        info: 'Designation',
        Class: 'md:mt-24'
    },
    {
        image: getImgPath('/images/portfolio/humans.png'),
        alt: 'Portfolio',
        title: 'Everyday Humans',
        slug: 'everyday-humans',
        info: 'Designation',
        Class: 'md:mt-0'
    },
    {
        image: getImgPath('/images/portfolio/roket-squred.png'),
        alt: 'Portfolio',
        title: 'Rocket Squared',
        slug: 'rocket-squared',
        info: 'Designation',
        Class: 'md:mt-24'
    },
    {
        image: getImgPath('/images/portfolio/panda-logo.png'),
        alt: 'Portfolio',
        title: 'Panda Logo',
        slug: 'panda-logo',
        info: 'Designation',
        Class: 'md:mt-0'
    },
    {
        image: getImgPath('/images/portfolio/humans.png'),
        alt: 'Portfolio',
        title: 'Fusion Dynamics',
        slug: 'fusion-dynamics',
        info: 'Designation',
        Class: 'md:mt-0'
    },
    {
        image: getImgPath('/images/portfolio/cozycasa.png'),
        alt: 'Portfolio',
        title: 'InnovateX Ventures',
        slug: 'innovate-x-ventures',
        info: 'Designation',
        Class: 'md:mt-24'
    },
    {
        image: getImgPath('/images/portfolio/mars.png'),
        alt: 'Portfolio',
        title: 'Nebula Holdings',
        slug: 'nebula-holdings',
        info: 'Designation',
        Class: 'md:mt-0'
    },
    {
        image: getImgPath('/images/portfolio/panda-logo.png'),
        alt: 'Portfolio',
        title: 'Summit Partners',
        slug: 'summit-partners',
        info: 'Designation',
        Class: 'md:mt-24'
    },
    {
        image: getImgPath('/images/portfolio/roket-squred.png'),
        alt: 'Portfolio',
        title: 'Apex Strategies',
        slug: 'apex-strategies',
        info: 'Designation',
        Class: 'md:mt-0'
    },

]

export const achievements = [
    { title: 'Deliver quality education to your learners!' },
    { title: 'Manage the courses your learner’s study!' },
    { title: 'Provide video, documents, or external links!' },
    { title: 'Automatically add completion certificates!' },
    { title: 'Customize our flexible pricing plans!' },
];

export const course = [
    { title: 'Flexible training programs ' },
    { title: 'learn From Experts' },
    { title: ' Doubt clearing Sessions' },
    { title: 'Basic To Advanced' },
    { title: 'Customize our flexible pricing plans!' },
    { title: 'Friendly environment for you' },
];
export const courses = [
    {
        id: 18,
        name: 'Flutter Development',
        image: '/images/blog/blog-2.jpg',
        slug: 'flutter-development',
        description: '',

    },
];