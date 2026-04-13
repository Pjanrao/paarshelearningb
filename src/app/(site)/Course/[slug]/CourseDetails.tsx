// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Image from "next/image";
// import { coursesData } from '@/data/coursesData';

// interface CurriculumItem {
//     title: string;
//     topics: string;
// }

// interface CourseType {
//     id: number;
//     name: string;
//     image: string;
//     galleryImage?: string;
//     detailsImage?: string;
//     slug: string;
//     description: string;
//     overview: string;
//     shortDesc: string;
//     curriculum: CurriculumItem[];
//     videoUrl: string;
// }

// const CourseDetails = () => {
//     const params = useParams();
//     const slug = params?.slug as string;
//     const [course, setCourse] = useState<CourseType | null>(null);

//     useEffect(() => {
//         if (slug) {
//             const foundCourse = coursesData.find(c => c.slug === slug);
//             setCourse(foundCourse || null);
//         }
//     }, [slug]);

//     if (!course) {
//         return <div className="text-center py-16">Loading course details...</div>;
//     }

//     return (
//         <div className="w-full bg-white text-gray-800 mt-23">
//             <section className="bg-[#081738] py-16 px-6">
//                 <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
//                     <div>
//                         <h2 className="text-4xl font-bold text-blue-700 mb-6">
//                             {course.name}
//                         </h2>
//                         <p className="text-lg mb-6 text-grey dark:text-white/70">
//                             {course.description}
//                         </p>

//                         {/* <ul className="space-y-2 mb-6">
//                             <li>Beginner to Advanced</li>
//                             <li>Duration: 6 Months</li>
//                             <li>Certificate Included</li>
//                             <li>Online & Offline Classes</li>
//                         </ul> */}

//                         <div className="block mx-auto mb-8 font-semibold text-midnight_text dark:text-white w-3/4 ml-1">
//                             <ul className="space-y-5">
//                                 <li className="flex items-start gap-4 ">
//                                     <span className="mt-2 h-2.5 w-2.5 rounded-full bg-primary shrink-0"></span>
//                                     <p className="text-lg font-normal text-grey dark:text-white/70">
//                                         100% Job Placement Guarantee
//                                     </p>
//                                 </li>
//                                 <li className="flex items-start gap-4 ">
//                                     <span className="mt-2 h-2.5 w-2.5 rounded-full bg-primary shrink-0"></span>
//                                     <p className="text-lg font-normal text-grey dark:text-white/70">
//                                         Live Classes with Expert Mentors
//                                     </p>
//                                 </li>
//                                 <li className="flex items-start gap-4 ">
//                                     <span className="mt-2 h-2.5 w-2.5 rounded-full bg-primary shrink-0"></span>
//                                     <p className="text-lg font-normal text-grey dark:text-white/70">
//                                         Industry-Relevant Curriculum
//                                     </p>
//                                 </li>
//                                 <li className="flex items-start gap-4 ">
//                                     <span className="mt-2 h-2.5 w-2.5 rounded-full bg-primary shrink-0"></span>
//                                     <p className="text-lg font-normal text-grey dark:text-white/70">
//                                         Hands-on Projects & Real-world Experience
//                                     </p>
//                                 </li>
//                             </ul>
//                         </div>

//                         <div className="flex gap-4">
//                             <button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700">
//                                 Enroll Now
//                             </button>
//                             {/* <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50">
//                                 Download Syllabus
//                             </button> */}
//                         </div>
//                     </div>

//                     <div className="flex justify-center">
//                         <Image
//                             src={course.detailsImage || course.image}
//                             alt={course.name}
//                             width={400}
//                             height={800}
//                             className="w-full h-full max-w-md rounded-lg"
//                             priority
//                         />
//                     </div>
//                 </div>
//             </section>

//             <section className="py-10 max-w-7xl mx-auto mt-5 -mb-10">
//                 <h2 className="text-3xl font-semibold mb-4 text-blue-700">
//                     Course Overview
//                 </h2>
//                 <p className="text-lg leading-relaxed">
//                     {course.overview}
//                 </p>
//             </section>

//             <section className="py-14 px-6">
//                 <div className="max-w-5xl mx-auto">
//                     {/* <h2 className="text-3xl font-semibold mb-8 text-blue-700">
//                         Course Preview
//                     </h2> */}
//                     <div className="aspect-w-16 aspect-h-9">
//                         <iframe
//                             src={course.videoUrl}
//                             title="Course Preview"
//                             frameBorder="0"
//                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                             allowFullScreen
//                             className="w-full rounded-lg shadow-md h-[450px]"
//                         ></iframe>
//                     </div>
//                 </div>
//             </section>

//             <section className="bg-gray-50 py-14 px-6">
//                 <div className="max-w-7xl mx-auto">
//                     <h2 className="text-3xl font-semibold mb-8 text-blue-700">
//                         Course Curriculum
//                     </h2>
//                     <div className="grid md:grid-cols-3 gap-6">
//                         {course.curriculum.map((item, index) => (
//                             <div key={index} className="bg-white p-5 rounded-xl shadow-sm">
//                                 <h3 className="text-lg font-bold">{item.title}</h3>
//                                 <p>{item.topics}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* <section className="py-14 px-6 max-w-7xl mx-auto">
//                 <h2 className="text-3xl font-semibold mb-8 text-blue-700">
//                     Course Curriculum
//                 </h2>
//                 <div className="space-y-6">
//                     <div>
//                         <h3 className="font-semibold text-lg">
//                             Module 1: Web Fundamentals
//                         </h3>
//                         <p>HTML, CSS, Flexbox, Grid, Responsive Design</p>
//                     </div>
//                     <div>
//                         <h3 className="font-semibold text-lg">
//                             Module 2: JavaScript
//                         </h3>
//                         <p>Basics, DOM, ES6, APIs, Async Programming</p>
//                     </div>
//                     <div>
//                         <h3 className="font-semibold text-lg">
//                             Module 3: React.js
//                         </h3>
//                         <p>Components, Hooks, Routing, API Integration</p>
//                     </div>
//                     <div>
//                         <h3 className="font-semibold text-lg">
//                             Module 4: Backend Development
//                         </h3>
//                         <p>Node.js, Express.js, REST APIs, Authentication</p>
//                     </div>
//                     <div>
//                         <h3 className="font-semibold text-lg">
//                             Module 5: Database & Deployment
//                         </h3>
//                         <p>MongoDB, SQL, GitHub, Cloud Deployment</p>
//                     </div>
//                 </div>
//             </section> */}

//             {/* <section className=" py-14 px-6">
//                 <div className="max-w-7xl mx-auto">
//                     <h2 className="text-3xl font-semibold mb-8 text-blue-700">
//                         Projects You Will Build
//                     </h2>
//                     <div className="grid md:grid-cols-3 gap-6">
//                         {[
//                             "Portfolio Website",
//                             "Admin Dashboard",
//                             "Authentication System",
//                             "REST API Backend",
//                             "Full Stack Web App",
//                             "Final Capstone Project",
//                         ].map((project, index) => (
//                             <div key={index} className="bg-white p-5 rounded-xl shadow-sm">
//                                 {project}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section> */}

//             <section className="py-14 px-6 max-w-7xl mx-auto">
//                 <h2 className="text-3xl font-semibold mb-4 text-blue-700 -ml-6">
//                     Certification
//                 </h2>
//                 <p className="text-lg -ml-6">
//                     Receive an industry-recognized course completion certificate to
//                     enhance your resume and LinkedIn profile.
//                 </p>
//             </section>

//             <section className="bg-blue-800 py-14 px-6 text-center text-white">
//                 <h2 className="text-3xl font-bold mb-4">
//                     Start Your Learning Journey Today
//                 </h2>
//                 <p className="mb-6">
//                     Limited seats available. Enroll now and upgrade your skills.
//                 </p>
//                 <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
//                     Enroll Now
//                 </button>
//             </section>
//         </div>
//     );
// };

// export default CourseDetails;


"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useGetCourseByIdQuery } from "@/redux/api/courseApi";
import toast, { Toaster } from 'react-hot-toast';
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import CourseCard from "@/components/SharedComponent/Course/CourseCard"; // adjust path
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";


// import VideoPlayer from '@/components/SharedComponent/Course/VideoPlayer';
import { getImgPath } from '@/utils/image';

interface CurriculumItem {
  title: string;
  topics: string;
}

interface Project {
  title: string;
  description: string;
  image: string;
}

interface CertificationInfo {
  title: string;
  description: string;
  image: string;
}

interface Instructor {
  name: string;
  role: string;
  designation?: string;
  experience?: string;
  rating?: number;
  reviewsCount?: string;
  bio?: string;
  avatar?: string;
  image?: string;
}

interface CourseType {
  id: number;
  name: string;
  image: string;
  galleryImage?: string;
  detailsImage?: string;
  slug: string;
  description: string;
  category: string;
  overview: string;
  shortDesc: string;
  duration?: string;
  level?: string;
  mode?: string;
  rating?: number;
  reviews?: string;
  fee?: number;
  whatYouLearn?: string[];
  projects?: Project[];
  tools?: string[];
  certificationInfo?: CertificationInfo;
  instructor?: Instructor;
  curriculum: CurriculumItem[];
  videoUrl: string;
  difficulty?: string;
  popularTags?: string[];
  languages?: string[];
}

const COUNTRY_CODES = [
  { code: '+91', country: '🇮🇳', name: 'India' },
  { code: '+1', country: '🇺🇸', name: 'USA/Canada' },
  { code: '+44', country: '🇬🇧', name: 'UK' },
  { code: '+61', country: '🇦🇺', name: 'Australia' },
  { code: '+971', country: '🇦🇪', name: 'UAE' },
];

const CourseDetails = ({ slug }: { slug: string }) => {

  const { data: coursesResponse } = useGetCoursesQuery({
    page: 1,
    limit: 20, // get enough courses for slider
  });


  const { data: courseData, isLoading, error } = useGetCourseByIdQuery(slug);
  const course = courseData as any;

  const allCourses = coursesResponse?.courses || [];

  // ✅ Random courses (excluding current)
  const displayCourses = React.useMemo(() => {
    if (!course) return [];

    return allCourses
      .filter((c: any) => c._id !== course._id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
  }, [allCourses, course]);

  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const router = useRouter();
  const downloadPDF = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "course-syllabus.pdf";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(blobUrl);

    } catch (error) {
      toast.error("Failed to download syllabus");
    }
  };

  // Syllabus Modal State
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);
  const [isInterestedModalOpen, setIsInterestedModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', countryCode: '+91' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeTnc, setAgreeTnc] = useState(false);

  // Redux state
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);

  // Check enrollment
  useEffect(() => {
    const checkEnrollment = async () => {
      if (user?._id && course?._id) {
        setEnrollmentLoading(true);
        try {
          const response = await fetch(`/api/enrollment/check?userId=${user._id}&courseId=${course._id}`);
          const data = await response.json();
          if (data.isEnrolled) {
            setIsEnrolled(true);
          }
        } catch (error) {
          console.error("Error checking enrollment:", error);
        } finally {
          setEnrollmentLoading(false);
        }
      }
    };

    checkEnrollment();
  }, [user, course]);

  // Handle Dynamic Enrollment Button Click
  const handleEnrollClick = () => {
    if (!user) {
      // Guest: Open modal with empty fields
      setFormData({ name: '', email: '', phone: '', countryCode: '+91' });
      setIsInterestedModalOpen(true);
    } else if (isEnrolled) {
      // Enrolled: Redirect to learning
      router.push('/student/my-courses');
    } else {
      // Logged in but not enrolled: Open modal prefilled
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.contact || user.phone || '',
        countryCode: '+91'
      });
      setIsInterestedModalOpen(true);
    }
  };

  const handleInterestedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTnc) {
      toast.error("Please agree to our Privacy Policy");
      return;
    }

    const getCleanPhone = formData.phone.trim().replace(/\D/g, "");
    if (getCleanPhone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: getCleanPhone,
          course: course.name,
          courseId: course._id,
          userId: user?._id || null,
          message: `Interested in course: ${course.name}`,
          type: "Course Inquiry",
          source: "Website - Course Detail Page",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit inquiry");
      }

      toast.success("Thank you for your interest! Our team will contact you shortly.");
      setIsInterestedModalOpen(false);
      setFormData({ name: '', email: '', phone: '', countryCode: '+91' });
      setAgreeTnc(false);
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper: check if user is authenticated via the custom cookie-based auth
  const isAuthenticated = () => {
    return typeof document !== "undefined" && document.cookie.split(";").some((c) => c.trim().startsWith("token="));
  };

  // Trigger modal or direct download based on authentication
  const handleDownloadSyllabusClick = () => {
    if (!course?.syllabusPdf) {
      toast.error("Syllabus PDF is not available for this course.");
      return;
    }

    if (isAuthenticated()) {
      downloadPDF(course.syllabusPdf);

    } else {
      setIsSyllabusModalOpen(true);
    }
  };

  const handleSyllabusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTnc) {
      toast.error("Please agree to our Privacy Policy");
      return;
    }

    const getCleanPhone = formData.phone.trim().replace(/\D/g, "");
    if (getCleanPhone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: getCleanPhone, // just the 10 digit number to pass backend validation
          course: course.name,
          country: formData.countryCode, // Store country code here if available or just append to message
          message: `[${formData.countryCode}] Requested syllabus download for ${course.name}`,
          type: "Inquiry Form",
          source: "Website - Syllabus Download",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit inquiry");
      }

      toast.success("Details verified! Syllabus download starting...");
      const pdfUrl = course.syllabusPdf.replace("/upload/", "/upload/fl_attachment/");
      downloadPDF(pdfUrl);
      console.log("PDF URL:", course.syllabusPdf);
      setIsSyllabusModalOpen(false);
      setFormData({ name: '', email: '', phone: '', countryCode: '+91' });
      setAgreeTnc(false);

      // Open the syllabus in a new tab to initiate download


    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 pt-20">
        <div className="w-12 h-12 border-4 border-[#01A0E2] border-t-transparent rounded-full animate-spin shadow-lg"></div>
        <p className="text-[#2B4278] font-bold animate-pulse text-lg tracking-wide">Loading course excellence...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 pt-20 text-center px-4">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
          <Icon icon="solar:danger-triangle-bold-duotone" className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Course Not Found</h2>
        <p className="text-gray-500 max-w-md">The course you are looking for does not exist or has been removed.</p>
        <button onClick={() => router.push('/Course')} className="mt-4 px-6 py-2.5 bg-[#01A0E2] hover:bg-[#2B4278] text-white font-bold rounded-xl shadow-lg transition-all">
          Browse All Courses
        </button>
      </div>
    );
  }




  return (
    <div className="bg-[#F8FAFC] dark:bg-darkmode min-h-screen pt-24 md:pt-20 pb-10">
      {/* Breadcrumbs */}
      <nav className="container mx-auto px-4 py-2 text-sm font-medium">
        <ol className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => router.push('/')}>Home</li>
          <li><Icon icon="solar:alt-arrow-right-linear" width="16" /></li>
          <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => router.push('/Course')}>Courses</li>
          <li><Icon icon="solar:alt-arrow-right-linear" width="16" /></li>
          <li className="text-blue-600">{course.name}</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#1E3A8A] via-[#3B82F6] to-[#6366F1] py-10 md:py-16 px-4 min-h-[400px]">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform translate-x-20"></div>
        <div className="container mx-auto max-w-7xl relative z-10 grid lg:grid-cols-12 gap-10 items-center">
          <div className="text-white lg:col-span-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider">
                {course.level || 'Featured'}
              </span>
              <span className="text-white/60 text-xs">Course &gt; {course.level || 'Development'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight">
              {course.name}
            </h1>
            <p className="text-sm md:text-base text-blue-50 mb-5 max-w-lg opacity-90 leading-relaxed">
              {course.shortDescription}
            </p>
            {/* ✅ TAGS */}
            {course.popularTags && (
              <div className="flex flex-wrap gap-2 mb-4">
                {course.popularTags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="bg-white/20 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10">
                <Icon icon="solar:user-bold" className="text-yellow-400 w-4 h-4" />
                <span className="text-xs font-bold">{course.reviews || '1.2k'} Students Enrolled</span>
              </div>
            </div>
          </div>

          <div className="relative group lg:col-span-6 w-full lg:-mt-12 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] h-[250px] lg:mt-15 mt-8">
              <div className="absolute inset-0 bg-blue-400 blur-3xl opacity-20 group-hover:opacity-30 transition-opacity rounded-full"></div>
              <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 bg-black">
                <video
                  src={course.introVideo || getImgPath("/images/course/WhatsApp Video 2026-02-07 at 1.46.56 PM.mp4")}
                  controls
                  className="w-full h-full object-cover"
                  poster={course.thumbnail || course.detailsImage || course.image}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meta Info Bar */}
      <div className="container mx-auto max-w-7xl px-4 -mt-6 relative z-20">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-3 md:p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600">
              <Icon icon="solar:clock-circle-bold" className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Duration</p>
              <p className="text-xs md:text-sm font-bold dark:text-white">
                {course.duration ? `${course.duration} Months` : '6 Months'} </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600">
              <Icon icon="solar:chart-square-bold" className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Skill Level</p>
              <p className="text-xs md:text-sm font-bold dark:text-white">{course.difficulty || 'Beginner'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600">
              <Icon icon="solar:laptop-bold" className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Learning Mode</p>
              <p className="text-xs md:text-sm font-bold dark:text-white">{course.mode || 'Professional'}</p>
            </div>
          </div>
          {/* ✅ Languages */}
          {course.languages && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600">
                <Icon icon="solar:global-bold" className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">
                  Languages
                </p>
                <p className="text-xs md:text-sm font-bold dark:text-white">
                  {course.languages.join(", ")}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center text-yellow-600">
              <Icon icon="solar:star-bold" className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Reviews</p>
              <div className="flex items-center gap-1 font-bold dark:text-white text-xs md:text-sm">
                <span>{course.rating || '4.8'}</span>
                <div className="flex text-yellow-500">
                  <Icon icon="material-symbols:star-rounded" />
                </div>
                <span className="text-gray-400 font-normal">({course.reviews || '1.2k'})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="container mx-auto max-w-7xl px-4 pt-2 pb-6 md:pb-20">
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Course Details */}
          <div className="lg:col-span-8 space-y-2">



            {/* Course Overview */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#2B4278] dark:text-white">Course Overview</h2>
              <div className="prose prose-blue dark:prose-invert max-w-none">
                <div
                  className="text-base leading-relaxed text-gray-600 dark:text-gray-400 text-justify"
                  dangerouslySetInnerHTML={{ __html: course.overview || course.shortDescription || course.description }}
                />
              </div>
            </section>

            {/* Curriculum */}
            <section className="space-y-4 lg:-mt-24 mt-0">
              <h2 className="text-xl font-bold text-[#2B4278] dark:text-white">Course Curriculum</h2>
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {(course.curriculum || (course.syllabus || [])).map((item: any, index: number) => (
                  <div key={index} className={`group bg-white dark:bg-gray-900 border ${activeAccordion === index ? 'border-[#01A0E2] ring-1 ring-[#01A0E2]/20' : 'border-gray-100 dark:border-gray-800'} rounded-xl overflow-hidden transition-all duration-300 shadow-sm`}>
                    <div
                      className="p-3 md:p-4 flex items-center justify-between cursor-pointer"
                      onClick={() => toggleAccordion(index)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${activeAccordion === index ? 'bg-[#01A0E2] text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-500'} rounded-full flex items-center justify-center text-sm font-bold group-hover:bg-[#01A0E2] group-hover:text-white transition-all`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-[9px] uppercase font-bold tracking-widest text-[#01A0E2] mb-0.5">Module {index + 1}</p>
                          <h3 className={`text-sm font-bold dark:text-white ${activeAccordion === index ? 'text-[#01A0E2]' : 'group-hover:text-[#2B4278]'} transition-colors`}>{item.title || item.name}</h3>
                          {activeAccordion !== index && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.topics || item.description}</p>
                          )}
                        </div>
                      </div>
                      <Icon
                        icon="solar:alt-arrow-down-linear"
                        className={`text-gray-400 w-4 h-4 ${activeAccordion === index ? 'text-[#01A0E2] rotate-180' : 'group-hover:text-[#01A0E2]'} transition-transform`}
                      />
                    </div>

                    {/* Accordion Content */}
                    <div className={`transition-all duration-300 ease-in-out ${activeAccordion === index ? 'max-h-[500px] opacity-100 border-t border-gray-100 dark:border-gray-800' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                      <div className="p-3 md:p-5 bg-[#01A0E2]/5 dark:bg-[#01A0E2]/10">
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {item.topics || item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* What You'll Learn */}
            {(course.whatYouLearn || course.benefits) && (
              <section className="p-2 md:p-4 lg:p-6">
                <div className="relative z-10">
                  <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#2B4278] dark:text-white flex items-center gap-4 lg:-mt-10 mt-0">
                    <div className="w-14 h-14 bg-white dark:bg-gray-800 shadow-lg rounded-2xl flex items-center justify-center border border-gray-50 dark:border-gray-700 lg:-mt-12 mt-0">
                      <Icon icon="solar:lightbulb-bolt-bold-duotone" className="text-[#01A0E2] w-8 h-8" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] uppercase tracking-[0.2em] text-[#01A0E2] font-extrabold mb-1">Outcomes</span>
                      <p className="text-[15px] md:text-lg font-bold mb-10 text-[#2B4278] dark:text-white">What You Will Learn</p>
                    </div>
                  </h2>

                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                    {(course.whatYouLearn || course.benefits || []).map((item: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-4 group/item">
                        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-green-50 dark:bg-green-900/20 shadow-sm border border-green-100 dark:border-green-900/30 flex items-center justify-center group-hover/item:bg-[#01A0E2]/10 group-hover/item:border-[#01A0E2]/20 transition-all transform group-hover/item:scale-110">
                          <Icon icon="solar:check-circle-bold-duotone" className="text-green-600 dark:text-green-400 w-5 h-5 group-hover/item:text-[#01A0E2]" />
                        </div>
                        <div className="space-y-1">
                          {/* TITLE */}
                          <p className="text-[15px] md:text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug group-hover/item:text-[#2B4278] dark:group-hover/item:text-white transition-colors">
                            {typeof item === 'string' ? item : item.title || item.name}
                          </p>

                          {/* DESCRIPTION */}
                          {typeof item !== "string" && item.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                              {item.description}
                            </p>
                          )}

                          {/* HOVER LINE */}
                          <div className="w-0 group-hover/item:w-full h-0.5 bg-gradient-to-r from-[#01A0E2] to-transparent transition-all duration-500 opacity-50" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Projects Section
            {course.projects && (
              <section className="space-y-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                <h2 className="text-3xl font-extrabold dark:text-white text-center">Gain Proficiency with Real Projects</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {course.projects.map((project, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 group hover:shadow-xl transition-all">
                      <div className="relative aspect-video">
                        <Image src={project.image} alt={project.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                      </div>
                      <div className="p-5">
                        <h4 className="font-bold mb-2 dark:text-white">{project.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2">{project.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )} */}



          </div>

          {/* Right Column: Sidebar */}
          <aside className="lg:col-span-4 self-start sticky top-24 z-30 -mt-10 md:mt-0">
            <div className="space-y-6">

              {/* Tools & Stack */}
              {/* {course.tools && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                  <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-[#2B4278] dark:text-white">
                    <Icon icon="solar:box-bold" className="text-[#01A0E2]" />
                    Tools & Technologies
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {course.tools.map((tool, idx) => {
                      const iconMap: { [key: string]: string } = {
                        'html5': 'logos:html-5',
                        'css3': 'logos:css-3',
                        'javascript': 'logos:javascript',
                        'react': 'logos:react',
                        'nodejs': 'logos:nodejs-icon',
                        'mongodb': 'logos:mongodb-icon',
                        'docker': 'logos:docker-icon',
                        'github': 'logos:github-icon',
                        'express': 'logos:express',
                        'python': 'logos:python',
                        'py-charm': 'logos:pycharm',
                        'vscode': 'logos:visual-studio-code',
                        'anaconda': 'logos:anaconda-icon',
                        'linux': 'logos:linux-tux',
                        'figma': 'logos:figma',
                        'adobe-xd': 'logos:adobe-xd',
                        'sketch': 'logos:sketch',
                        'illustrator': 'logos:adobe-illustrator',
                        'photoshop': 'logos:adobe-photoshop',
                        'after-effects': 'logos:adobe-after-effects',
                      };
                      const iconName = iconMap[tool.toLowerCase()] || `logos:${tool.toLowerCase()}`;

                      return (
                        <div key={idx} className="w-8 h-8 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center transition-all hover:bg-white dark:hover:bg-gray-700 hover:shadow-md cursor-help overflow-hidden p-1.5" title={tool}>
                          <Icon icon={iconName} width="20" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )} */}

              {/* Enrollment Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 md:p-6 shadow-2xl border border-[#01A0E2]/10 dark:border-gray-800 ring-1 ring-[#01A0E2]/5 mt-4 md:mt-6">
                {/* {course.fee && (
                  <div className="mb-4">
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Course Fee</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-[#01A0E2]">₹{course.fee.toLocaleString()}</span>
                      <span className="text-gray-400 text-xs font-medium">/ Full Course</span>
                    </div>
                  </div>
                )} */}
                <button
                  onClick={handleEnrollClick}
                  disabled={enrollmentLoading}
                  className="w-fit p-3 py-3.5 bg-[#01A0E2] hover:bg-[#2B4278] text-white font-black text-base rounded-xl shadow-lg shadow-[#01A0E2]/30 transition-all hover:scale-[1.02] active:scale-95 mb-4 disabled:opacity-70 flex items-center justify-center min-w-[140px]"
                >
                  {enrollmentLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : isEnrolled ? (
                    "Start Learning"
                  ) : (
                    "Enroll Now"
                  )}
                </button>
                {/* <div className="text-center text-xs text-gray-400 font-medium mb-8">100% Money-Back Guarantee</div> */}

                <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">This course includes:</p>
                  <ul className="space-y-3">
                    {[
                      { icon: "solar:video-library-bold", text: "85+ Video Lessons" },
                      { icon: "solar:play-stream-bold", text: "Live Class Access" },
                      { icon: "solar:file-download-bold", text: "Downloadable Resources" },
                      { icon: "solar:checklist-minimalistic-bold", text: "Lifetime Access" },
                      { icon: "solar:medal-star-bold", text: "Certificate of Completion" }
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-400 font-medium">
                        <Icon icon={feature.icon} className="text-[#01A0E2]" width="16" />
                        {feature.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>


              {/* Certification Banner */}
              <div className="bg-gradient-to-br from-[#2B4278] to-[#01A0E2] rounded-2xl p-5 md:p-6 text-white relative overflow-hidden mt-6 md:mt-8">
                <Icon icon="solar:medal-ribbon-bold" className="absolute bottom-[-15px] right-[-15px] w-32 h-32 text-white/5 -rotate-12" />
                <div className="relative z-10 space-y-3">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                    <Icon icon="solar:verified-check-bold" className="text-[#01A0E2]" width="24" />
                  </div>
                  <h3 className="text-lg font-bold font-primary">{course.certificationInfo?.title || 'Professional Certification'}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {course.certificationInfo?.description || 'Get recognized by industry leaders with our professional certificate.'}
                  </p>
                  <div className="pt-2">
                    <div className="relative aspect-[16/11] w-full max-w-[240px] mx-auto rounded-xl border border-white/10 overflow-hidden group shadow-2xl">
                      <Image
                        src={getImgPath('/images/testimonial/Paarsh E-Learning Certificate jpg.jpg.jpeg')}
                        alt='Professional Certification'
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                      <div className="absolute bottom-2 left-2 right-2 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[8px] font-bold uppercase tracking-widest text-white shadow-lg">
                          <Icon icon="solar:verified-check-bold" className="text-[#01A0E2] w-3 h-3" />
                          Industry Recognized
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meet Your Trainer Sidebar Card */}
              {course.instructor && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group mt-8">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#01A0E2]/5 dark:bg-[#01A0E2]/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                  <div className="relative z-10 space-y-4">
                    <h3 className="text-base font-bold text-[#2B4278] dark:text-white flex items-center gap-2">
                      <Icon icon="solar:user-speak-bold" className="text-[#01A0E2]" />
                      Meet Your Trainer
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-md ring-2 ring-white dark:ring-gray-800 shrink-0">
                        <Image src={course.instructor.avatar || course.instructor.image || "/images/avatar-placeholder.png"} alt={course.instructor.name || "Instructor"} fill className="object-cover" unoptimized />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold dark:text-white">{course.instructor.name}</h4>
                        <p className="text-blue-600 font-bold text-[10px]">{course.instructor.designation}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Icon icon="solar:star-bold" className="text-yellow-500 w-3 h-3" />
                          <span className="text-[10px] font-bold dark:text-gray-300">{course.instructor.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-800 w-fit">
                        <Icon icon="solar:case-outline" className="text-blue-600 w-3 h-3" />
                        <span className="text-[10px] font-bold dark:text-gray-300">{course.instructor.experience} Exp.</span>
                      </div>
                      <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed italic line-clamp-3">
                        "Expert instructor with hands-on experience, focused on delivering clear and practical knowledge."
                      </p>
                    </div>
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between">
                      <div className="text-left">
                        <p className="text-sm font-black text-blue-600">320+</p>
                        <p className="text-[8px] uppercase font-bold tracking-widest text-gray-400">Students</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-blue-600">45+</p>
                        <p className="text-[8px] uppercase font-bold tracking-widest text-gray-400">Reviews</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </aside>
        </div>

      </main>

      <section className="container mx-auto max-w-6xl px-4 lg:-mt-24 mt-0 mb-0">
        <div className="bg-[#081738] rounded-[2rem] md:rounded-[3rem] p-2 md:p-8 text-left md:text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[150%] bg-blue-500 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-50%] right-[-20%] w-[80%] h-[120%] bg-indigo-500 rounded-full blur-[100px]"></div>
          </div>
          <div className="relative z-10 space-y-8 max-w-3xl mx-0 md:mx-auto">
            <h2 className="text-2xl md:text-4xl font-black font-primary">Start Your Learning Journey Today</h2>
            <p className="text-base md:text-lg text-blue-100/80 leading-relaxed font-medium">
              Limited seats available for the upcoming cohort. Master in-demand skills and accelerate your career path with industry experts.
            </p>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-start md:justify-center gap-4 pt-4">
              <button
                onClick={handleEnrollClick}
                disabled={enrollmentLoading}
                className="px-6 py-3 bg-white text-blue-900 font-black rounded-xl hover:bg-blue-50 transition-all shadow-xl shadow-white/5 active:scale-95 w-full sm:w-auto text-sm md:text-base flex items-center justify-center min-w-[140px] disabled:opacity-70"
              >
                {enrollmentLoading ? (
                  <div className="w-5 h-5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                ) : isEnrolled ? (
                  "Start Learning"
                ) : (
                  "Enroll Today"
                )}
              </button>
              {course.syllabusPdf ? (
                <button
                  onClick={handleDownloadSyllabusClick}
                  className="px-6 py-3 bg-transparent border-2 border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-all w-full sm:w-auto text-sm md:text-base text-center flex items-center justify-center gap-2"
                >
                  <Icon icon="solar:file-download-bold" width="18" />
                  Download Syllabus
                </button>
              ) : (
                <span className="px-6 py-3 border-2 border-white/10 text-white/50 rounded-xl text-sm cursor-not-allowed">
                  Syllabus Not Available
                </span>
              )}

            </div>
          </div>
        </div>
      </section>
      {/* ✅ Related Courses */}
      <section className="container mx-auto max-w-7xl px-4 mb-16">
        <div className="flex justify-center mb-5">
          <h2 className="text-xl md:text-2xl font-bold text-[#2B4278] dark:text-white">
            You May Also Like
          </h2>
        </div>

        <div className="overflow-hidden relative py-4">
          <div className="flex gap-5 animate-scroll">
            {[...displayCourses, ...displayCourses].map((item: any, index: number) => (
              <div
                key={index}
                className="min-w-[260px] max-w-[260px] flex-shrink-0"
              >
                <CourseCard course={item} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* I'm Interested Modal */}
      {isInterestedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-[500px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white text-center flex-1 ml-6">
                  Check Your Interest
                </h3>
                <button
                  onClick={() => setIsInterestedModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                >
                  <Icon icon="mdi:close" width="24" />
                </button>
              </div>

              <form onSubmit={handleInterestedSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#01A0E2]/50 outline-none transition-all placeholder:text-gray-400 font-medium"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#01A0E2]/50 outline-none transition-all placeholder:text-gray-400 font-medium"
                  />
                </div>

                <div className="flex w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden focus-within:ring-2 focus-within:ring-[#01A0E2]/50 transition-all">
                  <div className="relative border-r border-gray-200 dark:border-gray-700 shrink-0">
                    <select
                      value={formData.countryCode}
                      onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                      className="appearance-none bg-transparent pl-4 pr-8 py-3 outline-none cursor-pointer text-base w-full h-full font-medium min-w-[70px]"
                    >
                      {COUNTRY_CODES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.country}
                        </option>
                      ))}
                    </select>
                    <Icon icon="solar:alt-arrow-down-linear" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" />
                  </div>
                  <div className="shrink-0 flex items-center justify-center px-3 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-semibold border-r border-gray-200 dark:border-gray-700">
                    {formData.countryCode}
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Mobile Number"
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, phone: val });
                    }}
                    maxLength={10}
                    className="w-full px-4 py-3 bg-transparent outline-none font-medium placeholder:text-gray-400"
                  />
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <div className="flex items-center h-6">
                    <input
                      id="agreeTncInterested"
                      type="checkbox"
                      checked={agreeTnc}
                      onChange={(e) => setAgreeTnc(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-[#01A0E2] focus:ring-[#01A0E2] cursor-pointer"
                    />
                  </div>
                  <label htmlFor="agreeTncInterested" className="text-sm text-gray-700 dark:text-gray-300 leading-snug cursor-pointer">
                    By providing your contact details, you agree to our{' '}
                    <span className="text-[#01A0E2] hover:underline">Privacy Policy</span>
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#01A0E2] hover:bg-[#2B4278] text-white font-bold rounded-xl shadow-lg shadow-[#01A0E2]/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "I'm Interested"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Syllabus Download Modal */}
      {isSyllabusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-[500px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white text-center flex-1 ml-6">
                  Course Syllabus
                </h3>
                <button
                  onClick={() => setIsSyllabusModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                >
                  <Icon icon="mdi:close" width="24" />
                </button>
              </div>

              <form onSubmit={handleSyllabusSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#01A0E2]/50 outline-none transition-all placeholder:text-gray-400 font-medium"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#01A0E2]/50 outline-none transition-all placeholder:text-gray-400 font-medium"
                  />
                </div>

                <div className="flex w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden focus-within:ring-2 focus-within:ring-[#01A0E2]/50 transition-all">
                  <div className="relative border-r border-gray-200 dark:border-gray-700 shrink-0">
                    <select
                      value={formData.countryCode}
                      onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                      className="appearance-none bg-transparent pl-4 pr-8 py-3 outline-none cursor-pointer text-base w-full h-full font-medium min-w-[70px]"
                    >
                      {COUNTRY_CODES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.country}
                        </option>
                      ))}
                    </select>
                    <Icon icon="solar:alt-arrow-down-linear" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" />
                  </div>
                  <div className="shrink-0 flex items-center justify-center px-3 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-semibold border-r border-gray-200 dark:border-gray-700">
                    {formData.countryCode}
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Mobile Number"
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, phone: val });
                    }}
                    maxLength={10}
                    className="w-full px-4 py-3 bg-transparent outline-none font-medium placeholder:text-gray-400"
                  />
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <div className="flex items-center h-6">
                    <input
                      id="agreeTnc"
                      type="checkbox"
                      checked={agreeTnc}
                      onChange={(e) => setAgreeTnc(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-[#01A0E2] focus:ring-[#01A0E2] cursor-pointer"
                    />
                  </div>
                  <label htmlFor="agreeTnc" className="text-sm text-gray-700 dark:text-gray-300 leading-snug cursor-pointer">
                    By providing your contact details, you agree to our{' '}
                    <span className="text-[#01A0E2] hover:underline">Privacy Policy</span>
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#0F9D58] hover:bg-[#0b7a44] text-white font-bold rounded-xl shadow-lg shadow-[#0F9D58]/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "Download Syllabus"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Toaster position="bottom-right" />
    </div>
  );
};

export default CourseDetails;
