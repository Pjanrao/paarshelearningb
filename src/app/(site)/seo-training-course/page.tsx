import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO Training in Nashik | Best SEO Course | Paarsh eLearning",
  description: "Master search engine optimization with our SEO training in Nashik. Learn keyword research, on-page, and off-page SEO with live projects.",
};

const SEOTrainingCourse = () => {
  return (
    <div className="bg-gray-50 dark:bg-darkmode min-h-screen pb-20 pt-20 md:pt-32">
      <div className="container mx-auto max-w-6xl px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-950 dark:text-white mb-6">
          Advanced <span className="text-secondary">SEO Training in Nashik</span>
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          Rank websites on the first page of Google with our expert-led <strong className="text-blue-600 dark:text-blue-400">SEO training in Nashik</strong>. Get hands-on experience with technical SEO, link building, and modern SEO algorithms.
        </p>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl text-left border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-blue-950 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
            What You Will Learn
          </h2>
          <ul className="list-disc list-inside space-y-3 mb-8 text-gray-700 dark:text-gray-400 text-lg">
            <li>Keyword Research and Competitor Analysis</li>
            <li>On-Page Optimization and Content Strategy</li>
            <li>Technical SEO and Core Web Vitals</li>
            <li>High-Quality Backlink Generation (Off-Page SEO)</li>
            <li>Local SEO and Google My Business Optimization</li>
          </ul>

          <h2 className="text-2xl font-bold text-blue-950 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
            Placement Guarantee Course
          </h2>
          <p className="mb-6 text-gray-700 dark:text-gray-400">
            SEO professionals are in high demand globally. By joining our <strong className="text-blue-600 dark:text-blue-400">placement guarantee course</strong>, you ensure that your new skills translate directly into a high-paying career. 
          </p>

          <div className="mt-10 text-center">
            <Link 
              href="/contact-us" 
              className="inline-block bg-primary text-white font-bold py-4 px-10 rounded-full hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
            >
              Get Syllabus
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOTrainingCourse;
