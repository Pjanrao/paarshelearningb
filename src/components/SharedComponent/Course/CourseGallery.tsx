"use client";
import React from "react";
import CourseCard from "@/components/SharedComponent/Course/CourseCard";
import { coursesData } from "@/data/coursesData";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CourseGallery = ({ courses = coursesData }: { courses?: any[] }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          arrows: false,
          centerMode: true,
          centerPadding: "20px",
        }
      }
    ]
  };

  return (
    <>
      <div className="hidden lg:grid lg:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          <CourseCard key={course.slug || index} course={course} />
        ))}
      </div>

      <div className="block lg:hidden">
        <Slider {...settings}>
          {courses.map((course, index) => (
            <div key={course.slug || index} className="px-2">
              <CourseCard course={course} />
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default CourseGallery;
