import React from "react";
import CourseGallery from "@/components/SharedComponent/Course/CourseGallery";
import { coursesData } from "@/data/coursesData";

const CoursesCardSection = () => {
  return (
    <section className="py-16 bg-white dark:bg-darkmode">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#2F73F2] dark:text-white -mt-10">
          Our Courses</h2>
        <CourseGallery courses={coursesData} />
      </div>
    </section>
  );
};

export default CoursesCardSection;