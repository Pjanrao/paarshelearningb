// "use client";

// import React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   Mail,
//   Phone,
//   Clock,
//   MapPin,
//   ChevronRight,
//   Send,
//   Navigation
// } from "lucide-react";

// /**
//  * Contact Page
//  * Color Scheme:
//  * Primary: #2B4278 (Dark Blue)
//  * Secondary: #01A0E2 (Bright Blue/Cyan)
//  */
// const ContactPage = () => {
//   return (
//     <div className="bg-white dark:bg-[#0f172a] transition-colors duration-300">
//       {/* Hero Section */}
//       <section className="relative w-full bg-gradient-to-b from-[#01A0E2]/5 to-white dark:from-slate-900 dark:to-[#0f172a] pt-20 pb-12 md:pt-32 md:pb-24 overflow-hidden">
//         {/* Abstract Background Shapes */}
//         <div className="absolute top-0 right-0 w-1/2 h-full bg-[#2B4278]/5 skew-x-12 transform translate-x-32 pointer-events-none"></div>
//         <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#01A0E2]/5 rounded-full blur-3xl pointer-events-none"></div>

//         <div className="container mx-auto px-4 max-w-7xl relative z-10">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
//             <div className="md:w-1/2">
//               <nav className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6 font-medium">
//                 <Link href="/" className="hover:text-[#01A0E2] transition-colors">Home</Link>
//                 <ChevronRight size={14} className="opacity-50" />
//                 <span className="text-gray-600 dark:text-gray-300">Contact Us</span>
//               </nav>

//               <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-[#2B4278] dark:text-white mb-4 md:mb-6 leading-tight">
//                 Let's <span className="text-[#01A0E2]">Connect</span> & Grow
//               </h1>

//               <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-medium max-w-md leading-relaxed">
//                 Have questions or ready to start your journey? Our expert team is here to support your path to excellence.
//               </p>
//             </div>

//             <div className="md:w-1/2 relative flex justify-center">
//               <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] flex items-center justify-center">
//                 {/* Decorative backdrop */}
//                 <div className="absolute inset-0 bg-gradient-to-tr from-[#2B4278]/10 via-[#01A0E2]/5 to-[#2B4278]/10 rounded-full blur-2xl transform rotate-12 scale-110"></div>

//                 <div className="relative w-full h-full rounded-full border-[12px] border-white dark:border-slate-800 shadow-2xl overflow-hidden group">
//                   <Image
//                     src="/images/contact-page/vision.png"
//                     alt="Contact Us"
//                     fill
//                     className="object-cover object-center group-hover:scale-110 transition-transform duration-1000"
//                     priority
//                   />
//                   <div className="absolute inset-0 bg-[#2B4278]/10 group-hover:bg-transparent transition-colors duration-500"></div>
//                 </div>

//                 {/* Floating Badges */}
//                 <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-[#01A0E2]/20 dark:border-slate-700 animate-float">
//                   <div className="w-10 h-10 bg-[#2B4278] rounded-xl flex items-center justify-center text-white font-bold">
//                     <Mail size={20} />
//                   </div>
//                 </div>
//                 <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-[#01A0E2]/10 dark:border-slate-700 animate-float-delayed">
//                   <div className="w-10 h-10 bg-[#01A0E2] rounded-xl flex items-center justify-center text-white font-bold">
//                     <Phone size={20} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <main className="container mx-auto px-4 max-w-7xl py-8 md:py-16 lg:py-24">
//         <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-start">
//           {/* Left Column: Info Cards & Map */}
//           <div className="space-y-6 md:space-y-12">
//             <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 lg:p-12 border border-slate-100 dark:border-white/5 shadow-2xl shadow-[#2B4278]/5 dark:shadow-none">
//               <h2 className="text-2xl md:text-3xl font-black text-[#2B4278] dark:text-white mb-6 md:mb-12">
//                 Contact Information
//               </h2>

//               <div className="grid sm:grid-cols-1 gap-4 md:gap-8">
//                 {/* Phone Card */}
//                 <div className="group flex items-center gap-4 md:gap-6 p-3 md:p-4 rounded-2xl md:rounded-3xl hover:bg-[#01A0E2]/5 dark:hover:bg-[#01A0E2]/10 transition-colors">
//                   <div className="w-12 h-12 md:w-16 md:h-16 bg-[#01A0E2] rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-[#01A0E2]/20 group-hover:scale-110 transition-transform">
//                     <Phone className="text-white" size={20} />
//                   </div>
//                   <div>
//                     <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Call Us</p>
//                     <Link href="tel:+919075201033" className="text-base md:text-xl font-bold text-[#2B4278] dark:text-white hover:text-[#01A0E2] transition-colors">
//                       +91 90752 01033
//                     </Link>
//                   </div>
//                 </div>

//                 {/* Email Card */}
//                 <div className="group flex items-center gap-4 md:gap-6 p-3 md:p-4 rounded-2xl md:rounded-3xl hover:bg-[#2B4278]/5 dark:hover:bg-[#2B4278]/10 transition-colors">
//                   <div className="w-12 h-12 md:w-16 md:h-16 bg-[#2B4278] rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-[#2B4278]/20 group-hover:scale-110 transition-transform">
//                     <Mail className="text-white" size={20} />
//                   </div>
//                   <div>
//                     <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Email Us</p>
//                     <Link href="mailto:info@paarshelearning.com" className="text-sm md:text-xl font-bold text-[#2B4278] dark:text-white hover:text-[#01A0E2] transition-colors break-all">
//                       info@paarshelearning.com
//                     </Link>
//                   </div>
//                 </div>

//                 {/* Address Card - Pune */}
//                 <div className="group flex items-start gap-4 md:gap-6 p-3 md:p-4 rounded-2xl md:rounded-3xl hover:bg-[#01A0E2]/5 dark:hover:bg-[#01A0E2]/10 transition-colors">
//                   <div className="w-12 h-12 md:w-16 md:h-16 bg-[#01A0E2] rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-[#01A0E2]/20 group-hover:scale-110 transition-transform">
//                     <MapPin className="text-white" size={20} />
//                   </div>
//                   <div>
//                     <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Pune Office</p>
//                     <p className="text-sm md:text-lg font-bold text-[#2B4278] dark:text-white leading-relaxed">
//                       Second Floor, Wisteriaa Fortune, C-206-207, Bhumkar Das Gugre Rd, near Bhumkar Chowk, Wakad, Pune, Maharashtra 411057
//                     </p>
//                   </div>
//                 </div>

//                 {/* Address Card - Nashik */}
//                 <div className="group flex items-start gap-4 md:gap-6 p-3 md:p-4 rounded-2xl md:rounded-3xl hover:bg-[#01A0E2]/5 dark:hover:bg-[#01A0E2]/10 transition-colors">
//                   <div className="w-12 h-12 md:w-16 md:h-16 bg-[#2B4278] rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-[#2B4278]/20 group-hover:scale-110 transition-transform">
//                     <MapPin className="text-white" size={20} />
//                   </div>
//                   <div>
//                     <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Nashik Office</p>
//                     <p className="text-sm md:text-lg font-bold text-[#2B4278] dark:text-white leading-relaxed">
//                       02, Bhakti Apartment, near Hotel Rasoi, Suchita Nagar, Mumbai Naka, Nashik, Maharashtra 422009
//                     </p>
//                   </div>
//                 </div>

//                 {/* Hours Card */}
//                 <div className="group flex items-center gap-4 md:gap-6 p-3 md:p-4 rounded-2xl md:rounded-3xl hover:bg-[#2B4278]/5 dark:hover:bg-[#2B4278]/10 transition-colors">
//                   <div className="w-12 h-12 md:w-16 md:h-16 bg-[#2B4278] rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-[#2B4278]/20 group-hover:scale-110 transition-transform">
//                     <Clock className="text-white" size={20} />
//                   </div>
//                   <div>
//                     <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Open Hours</p>
//                     <p className="text-sm md:text-lg font-bold text-[#2B4278] dark:text-white">
//                       Mon - Fri, 9:30 AM - 7:30 PM
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Map Container */}
//             <div className="w-full h-[250px] md:h-[350px] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-white/5 relative group">
//               <iframe
//                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60503.13403568889!2d73.7432822751936!3d19.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m3!3e0!4m0!4m0!5e0!3m2!1sen!2sin!4v1707222100000!5m2!1sen!2sin"
//                 width="100%"
//                 height="100%"
//                 style={{ border: 0 }}
//                 allowFullScreen
//                 loading="lazy"
//                 className="grayscale group-hover:grayscale-0 transition-all duration-700"
//               />
//               <div className="absolute top-6 left-6">
//                 <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
//                   <Navigation size={16} className="text-[#01A0E2]" />
//                   <span className="text-xs font-bold text-[#2B4278]">Pune & Nashik</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column: Form */}
//           <div className="space-y-6 md:space-y-12 mt-8 lg:mt-0">
//             <div className="space-y-4 md:space-y-6">
//               <Link href="/inquiry" className="inline-flex items-center gap-2 px-4 py-2 bg-[#01A0E2]/10 dark:bg-[#01A0E2]/20 rounded-full border border-[#01A0E2]/20 hover:bg-[#01A0E2]/20 dark:hover:bg-[#01A0E2]/30 transition-colors cursor-pointer">
//                 <span className="w-2 h-2 bg-[#01A0E2] rounded-full animate-pulse"></span>
//                 <span className="text-xs font-bold text-[#01A0E2] uppercase tracking-widest">Inquiry Form</span>
//               </Link>

//               <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#2B4278] dark:text-white leading-tight">
//                 Get In <span className="text-[#01A0E2]">Touch</span>
//               </h2>
//               <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg leading-relaxed max-w-lg">
//                 We're here to help! Send us a message and our counselor will get back to you within 24 hours.
//               </p>
//             </div>

//             <form className="space-y-4 md:space-y-6">
//               <div className="grid md:grid-cols-2 gap-4 md:gap-6">
//                 <div className="space-y-2">
//                   <label className="text-sm font-bold text-[#2B4278] dark:text-slate-300 ml-2">Your Name</label>
//                   <input
//                     type="text"
//                     placeholder="Full name"
//                     className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-[#01A0E2] focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-slate-300 text-sm md:text-base"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-bold text-[#2B4278] dark:text-slate-300 ml-2">Email Address</label>
//                   <input
//                     type="email"
//                     placeholder="Email"
//                     className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-[#01A0E2] focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-slate-300 text-sm md:text-base"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm font-bold text-[#2B4278] dark:text-slate-300 ml-2">Phone Number</label>
//                 <input
//                   type="text"
//                   placeholder="Contact Number"
//                   className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-[#01A0E2] focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-slate-300 text-sm md:text-base"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm font-bold text-[#2B4278] dark:text-slate-300 ml-2">Tell us more</label>
//                 <textarea
//                   rows={4}
//                   placeholder="How can we help you?"
//                   className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-[#01A0E2] focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-slate-300 resize-none text-sm md:text-base"
//                 ></textarea>
//               </div>

//               <button className="w-full bg-[#01A0E2] hover:bg-[#2B4278] text-white font-black py-4 md:py-5 px-8 md:px-10 rounded-xl md:rounded-2xl transition-all flex items-center justify-center gap-2 md:gap-3 shadow-xl shadow-[#01A0E2]/30 active:scale-95 group text-sm md:text-base">
//                 Send Message
//                 <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Bottom CTA */}
//         <section className="mt-0 md:mt-12 lg:mt-16 -mb-8 md:-mb-4 relative overflow-hidden">
//           <div className="bg-[#2B4278] rounded-2xl md:rounded-[3rem] w-fit mx-auto p-6 md:p-8 lg:p-11 text-center text-white relative overflow-hidden group">
//             {/* Animated background elements */}
//             <div className="absolute top-0 right-0 w-64 h-50 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
//             <div className="absolute bottom-0 left-0 w-64 h-50 bg-[#01A0E2]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

//             <div className="relative z-10 max-w-3xl mx-auto space-y-4 md:space-y-8">
//               <h2 className="text-2xl md:text-4xl lg:text-6xl font-black leading-tight">
//                 Ready to Accelerate Your <span className="text-[#01A0E2]">Career?</span>
//               </h2>
//               <p className="text-sm md:text-lg lg:text-xl text-blue-50/80 font-medium max-w-xl mx-auto">
//                 Join our community of 5000+ graduates who have transformed their lives with expert-led mentorship.
//               </p>
//               <div className="pt-4 md:pt-6">
//                 <Link
//                   href="/Course"
//                   className="inline-flex items-center justify-center px-8 md:px-12 py-3 md:py-5 bg-white text-[#2B4278] text-base md:text-xl font-black rounded-xl md:rounded-2xl hover:bg-[#01A0E2] hover:text-white transition-all shadow-2xl active:scale-95 group"
//                 >
//                   Explore All Courses
//                   <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default ContactPage;


"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  ChevronRight,
  Send,
  Navigation
} from "lucide-react";
import { validateEmail, validatePhone } from "@/utils/validation";

/**
 * Contact Page
 * Color Scheme:
 * Primary: #2B4278 (Dark Blue)
 * Secondary: #01A0E2 (Bright Blue/Cyan)
 */
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [activeMap, setActiveMap] = useState("Pune");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const mapLocations = {
    Pune: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.364426543!2d73.7424911751936!3d18.602177473215277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bb926f4327fd%3A0xc392db26998d30e8!2sPaarsh%20Infotech%20Pvt%20Ltd!5e0!3m2!2sen!2sin!4v1707222100000!5m2!1sen!2sin",
    Nashik: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.19168434!2d73.7819373!3d19.9813934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddeb638e000001%3A0x2d1bce8da5e8bd9e!2sPaarsh+Infotech+Pvt+Ltd!5e0!3m2!2sen!2sin!4v1707222100000!5m2!1sen!2sin"
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const loadingToast = toast.loading("Sending your message...");

      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, type: "Contact Form" }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Message sent successfully!", { id: loadingToast });
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        toast.error(result.error || "Failed to send message.", { id: loadingToast });
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-b from-[#01A0E2]/5 to-white dark:from-slate-900 dark:to-[#0f172a] pt-24 pb-12 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#2B4278]/5 skew-x-12 transform translate-x-32 pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#01A0E2]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
            <div className="md:w-1/2">
              <nav className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6 font-medium">
                <Link href="/" className="hover:text-[#01A0E2] transition-colors">Home</Link>
                <ChevronRight size={14} className="opacity-50" />
                <span className="text-gray-600 dark:text-gray-300">Contact Us</span>
              </nav>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#2B4278] dark:text-white mb-4 md:mb-6 leading-tight">
                Let's <span className="text-[#01A0E2]">Connect</span> & Grow
              </h1>

              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-medium max-w-md leading-relaxed">
                Have questions or ready to start your journey? Our expert team is here to support your path to excellence.
              </p>
            </div>

            <div className="md:w-1/2 relative flex justify-center">
              <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] flex items-center justify-center">

                <div className="absolute inset-0 bg-gradient-to-tr from-[#2B4278]/10 via-[#01A0E2]/5 to-[#2B4278]/10 rounded-full blur-2xl transform rotate-12 scale-110"></div>

                <div className="relative w-full h-full rounded-full border-[12px] border-white dark:border-slate-800 shadow-2xl overflow-hidden group">
                  <Image
                    src="/images/contact-page/vision.png"
                    alt="Contact Us"
                    fill
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-1000"
                    priority
                  />
                  <div className="absolute inset-0 bg-[#2B4278]/10 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>

                <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-[#01A0E2]/20 dark:border-slate-700 animate-float">
                  <div className="w-10 h-10 bg-[#2B4278] rounded-xl flex items-center justify-center text-white font-bold">
                    <Mail size={20} />
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-[#01A0E2]/10 dark:border-slate-700 animate-float-delayed">
                  <div className="w-10 h-10 bg-[#01A0E2] rounded-xl flex items-center justify-center text-white font-bold">
                    <Phone size={20} />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 max-w-7xl py-8 md:py-16 lg:py-24">

        {/* GRID SECTION */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-start">

          {/* LEFT COLUMN */}
          <div className="space-y-6">

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 border border-slate-100 dark:border-white/5 shadow-2xl shadow-[#2B4278]/5">

              <h2 className="text-2xl font-black text-[#2B4278] dark:text-white mb-6">
                Contact Information
              </h2>

              <div className="space-y-4">

                <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-[#01A0E2]/5">
                  <div className="w-12 h-12 bg-[#01A0E2] rounded-xl flex items-center justify-center">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm font-bold uppercase">Call Us</p>
                    <Link href={`tel:${settings?.contactDetails?.phone?.replace(/\s/g, "") || "+919075201033"}`} className="text-[#2B4278] dark:text-white">
                      {settings?.contactDetails?.phone || "+91 90752 01033"}
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-[#2B4278]/5">
                  <div className="w-12 h-12 bg-[#2B4278] rounded-xl flex items-center justify-center">
                    <Mail className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm font-bold uppercase">Email Us</p>
                    <Link href={`mailto:${settings?.contactDetails?.email || "paarshelearning@gmail.com"}`} className="text-[#2B4278] dark:text-white">
                      {settings?.contactDetails?.email || "paarshelearning@gmail.com"}
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-2 rounded-2xl hover:bg-[#01A0E2]/5">
                  <div className="w-12 h-12 bg-[#01A0E2] rounded-xl flex items-center justify-center">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm font-bold uppercase">Pune Office</p>
                    <p className="text-[#2B4278] dark:text-white">
                      {settings?.contactDetails?.puneAddress || "Second Floor, Wisteriaa Fortune, Wakad, Maharashtra 411057"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-2 rounded-2xl hover:bg-[#01A0E2]/5">
                  <div className="w-12 h-12 bg-[#2B4278] rounded-xl flex items-center justify-center">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm font-bold uppercase">Nashik Office</p>
                    <p className="text-[#2B4278] dark:text-white">
                      {settings?.contactDetails?.nashikAddress || "Bhakti Apartment, Suchita Nagar, Mumbai Naka, Nashik"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-[#2B4278]/5">
                  <div className="w-12 h-12 bg-[#2B4278] rounded-xl flex items-center justify-center">
                    <Clock className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm font-bold uppercase">Open Hours</p>
                    <p className="text-[#2B4278] dark:text-white">
                      {settings?.contactDetails?.openHours || "Mon - Fri, 9:30 AM - 7:30 PM"}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">

            <Link
              href="/inquiry"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#01A0E2]/10 rounded-full border border-[#01A0E2]/20 hover:bg-[#01A0E2]/20"
            >
              <span className="w-2 h-2 bg-[#01A0E2] rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-[#01A0E2] uppercase tracking-widest">
                Inquiry Form
              </span>
            </Link>

            <h2 className="text-3xl font-black text-[#2B4278] dark:text-white">
              Get In <span className="text-[#01A0E2]">Touch</span>
            </h2>

            <p className="text-gray-500 dark:text-gray-400">
              We're here to help! Send us a message and our counselor will get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="grid md:grid-cols-2 gap-4">

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="w-full px-6 py-4 rounded-xl border border-slate-200"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="w-full px-6 py-4 rounded-xl border border-slate-200"
                />

              </div>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                className="w-full px-6 py-4 rounded-xl border border-slate-200"
              />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="How can we help you?"
                required
                className="w-full px-6 py-4 rounded-xl border border-slate-200"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#01A0E2] hover:bg-[#2B4278] text-white font-bold py-4 px-8 rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send size={18} />
              </button>

            </form>

          </div>

        </div>

        {/* MAP */}
        <div className="w-full mt-12 space-y-6">
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <button
              onClick={() => setActiveMap("Pune")}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${activeMap === "Pune"
                ? "bg-[#01A0E2] text-white shadow-lg shadow-[#01A0E2]/30"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-[#01A0E2]/50"
                }`}
            >
              <MapPin size={16} />
              Pune Office
            </button>
            <button
              onClick={() => setActiveMap("Nashik")}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${activeMap === "Nashik"
                ? "bg-[#2B4278] text-white shadow-lg shadow-[#2B4278]/30"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-[#2B4278]/50"
                }`}
            >
              <MapPin size={16} />
              Nashik Office
            </button>
          </div>

          <div className="w-full h-[350px] md:h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-white/5 relative group">
            <iframe
              src={mapLocations[activeMap as keyof typeof mapLocations]}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              className="grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-[1.02]"
            />
            <div className="absolute top-4 left-4 pointer-events-none">
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border border-[#01A0E2]/20 flex items-center gap-2">
                <Navigation size={14} className={activeMap === "Pune" ? "text-[#01A0E2]" : "text-[#2B4278]"} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Currently Viewing: {activeMap} Office
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <section className="mt-8 lg:mt-12 relative overflow-hidden">

          <div className="bg-[#2B4278] rounded-[3rem] w-fit mx-auto py-6 px-8 text-center text-white">

            <h2 className="text-xl lg:text-3xl font-black">
              Ready to Accelerate Your <span className="text-[#01A0E2]">Career?</span>
            </h2>

            <p className="text-lg text-blue-50 mt-3 max-w-xl mx-auto">
              Join our community of graduates who transformed their careers.
            </p>

            <Link
              href="/Course"
              className="inline-flex items-center px-6 py-3 bg-white text-[#2B4278] font-black rounded-2xl mt-6 hover:bg-[#01A0E2] hover:text-white"
            >
              Explore All Courses
            </Link>

          </div>

        </section>

      </main>

      <Toaster position="bottom-right" />
    </div>
  );
};

export default ContactPage;