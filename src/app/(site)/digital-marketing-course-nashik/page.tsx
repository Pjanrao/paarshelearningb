import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Digital Marketing Course in Nashik | Paarsh eLearning",
  description: "Enroll in the top digital marketing course in Nashik with placement. Learn SEO, social media marketing, and more with expert-led training.",
};

const DigitalMarketingCourseNashik = () => {
  return (
    <div className="bg-gray-50 dark:bg-darkmode min-h-screen pb-20 pt-20 md:pt-32">
      <div className="container mx-auto max-w-6xl px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-950 dark:text-white mb-6">
          Best <span className="text-secondary">Digital Marketing Course in Nashik</span>
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          Welcome to the most comprehensive digital marketing course in Nashik. Whether you're a student, professional, or entrepreneur, our <strong className="text-blue-600 dark:text-blue-400">placement guarantee course</strong> will equip you with the practical skills needed to thrive in the digital world.
        </p>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl text-left border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-blue-950 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
            Why Choose Our Social Media Marketing Course?
          </h2>
          <p className="mb-6 text-gray-700 dark:text-gray-400">
            Our specialized modules cover everything from Facebook and Instagram Ads to comprehensive SEO strategies. We pride ourselves on offering the top <strong className="text-blue-600 dark:text-blue-400">social media marketing course</strong> that focuses on real-world projects and live campaign management.
          </p>

          <h2 className="text-2xl font-bold text-blue-950 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
            Online Marketing Training
          </h2>
          <p className="mb-6 text-gray-700 dark:text-gray-400">
            Can't attend in person? Paarsh eLearning provides exceptional <strong className="text-blue-600 dark:text-blue-400">online marketing training</strong> led by industry experts. Learn at your own pace while still getting access to our mentorship and job placement support.
          </p>

          <div className="mt-10 text-center">
            <Link 
              href="/contact-us" 
              className="inline-block bg-primary text-white font-bold py-4 px-10 rounded-full hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalMarketingCourseNashik;
