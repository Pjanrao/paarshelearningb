import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Marketing Internship in Nashik | Paarsh eLearning",
  description: "Kickstart your career with a digital marketing internship in Nashik! Gain hands-on experience working on live projects with our expert team.",
};

const InternshipDigitalMarketing = () => {
  return (
    <div className="bg-gray-50 dark:bg-darkmode min-h-screen pb-20 pt-20 md:pt-32">
      <div className="container mx-auto max-w-6xl px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-950 dark:text-white mb-6">
          Exciting <span className="text-secondary">Digital Marketing Internship</span>
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          Put your theory into practice! Paarsh eLearning offers a premium <strong className="text-blue-600 dark:text-blue-400">digital marketing internship</strong> where you will work on live client projects, manage real ad budgets, and build a powerful portfolio.
        </p>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl text-left border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-blue-950 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
            Why Join Our Internship Program?
          </h2>
          <p className="mb-6 text-gray-700 dark:text-gray-400">
            Experience is the most valuable asset in the digital marketing industry. Our internship program acts as an extension of our <strong className="text-blue-600 dark:text-blue-400">online marketing training</strong>, offering a seamless bridge between learning and professional employment. 
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8 mt-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl">
              <h3 className="font-bold text-xl text-blue-900 dark:text-white mb-2">Live Projects</h3>
              <p className="text-gray-600 dark:text-gray-400">Work on actual business campaigns instead of dummy assignments.</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl">
              <h3 className="font-bold text-xl text-blue-900 dark:text-white mb-2">Expert Mentorship</h3>
              <p className="text-gray-600 dark:text-gray-400">Get 1-on-1 guidance from senior marketers and agency owners.</p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link 
              href="/contact-us" 
              className="inline-block bg-primary text-white font-bold py-4 px-10 rounded-full hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
            >
              Apply for Internship
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipDigitalMarketing;
