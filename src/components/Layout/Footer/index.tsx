
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getImgPath } from "@/utils/image";
import { useSiteImages } from "@/hooks/useSiteImages";
import { ChevronRight } from "lucide-react";

const Footer = () => {
  const { getImageUrl } = useSiteImages();
  const [settings, setSettings] = React.useState<any>(null);

  React.useEffect(() => {
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

  return (
    <footer className="bg-darkmode border-t border-dark_border pt-10 pb-6">
      <div className="container mx-auto max-w-6xl px-4">

        <div className="flex flex-col lg:flex-row justify-between gap-10">

          {/* LEFT */}
          <div className="flex-1 lg:max-w-sm">
            <Link href="/">
              <Image
                src={getImageUrl("SITE_LOGO_DARK", getImgPath("/images/logo/logo-wide.webp"))}
                alt="Paarsh eLearning"
                width={250}
                height={100}
                className="mb-4"
              />
            </Link>

            <p className="text-white/70 text-sm leading-relaxed">
              Paarsh E-Learning is a leading edtech platform in Pune,
              Nashik, and Surat, offering career-oriented courses in digital marketing
              and in-demand skills. Learn from industry experts through a secure and trusted
              online platform designed to help students build practical knowledge and achieve
              real career growth.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="flex-1 flex flex-col items-start">
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>

            <div className="flex gap-16 text-white/70 text-sm font-medium">

              {/* Column 1 */}
              <ul className="space-y-3">
                <li className="group">
                  <Link href="/" className="flex items-center gap-1 hover:text-secondary">
                    <ChevronRight className="w-3 h-3 text-secondary opacity-0 group-hover:opacity-100 transition" />
                    Home
                  </Link>
                </li>

                <li className="group">
                  <Link href="/about-us" className="flex items-center gap-1 hover:text-secondary">
                    <ChevronRight className="w-3 h-3 text-secondary opacity-0 group-hover:opacity-100 transition" />
                    About
                  </Link>
                </li>

                <li className="group">
                  <Link href="/blog" className="flex items-center gap-1 hover:text-secondary">
                    <ChevronRight className="w-3 h-3 text-secondary opacity-0 group-hover:opacity-100 transition" />
                    Blogs
                  </Link>
                </li>

                <li className="group">
                  <Link href="/inquiry" className="flex items-center gap-1 hover:text-secondary">
                    <ChevronRight className="w-3 h-3 text-secondary opacity-0 group-hover:opacity-100 transition" />
                    Inquiry
                  </Link>
                </li>
              </ul>

              {/* Column 2 */}
              <ul className="space-y-3">
                <li className="group">
                  <Link href="/Course" className="flex items-center gap-1 hover:text-secondary">
                    <ChevronRight className="w-3 h-3 text-secondary opacity-0 group-hover:opacity-100 transition" />
                    Courses
                  </Link>
                </li>

                <li className="group">
                  <Link href="/workshops" className="flex items-center gap-1 hover:text-secondary">
                    <ChevronRight className="w-3 h-3 text-secondary opacity-0 group-hover:opacity-100 transition" />
                    Workshops
                  </Link>
                </li>

                <li className="group">
                  <Link href="/careers" className="flex items-center gap-1 hover:text-secondary">
                    <ChevronRight className="w-3 h-3 text-secondary opacity-0 group-hover:opacity-100 transition" />
                    Careers
                  </Link>
                </li>

                <li className="group">
                  <Link href="/contact-us" className="flex items-center gap-1 hover:text-secondary">
                    <ChevronRight className="w-3 h-3 text-secondary opacity-0 group-hover:opacity-100 transition" />
                    Contact
                  </Link>
                </li>
              </ul>

            </div>
          </div>

          {/* CONTACT */}
          <div className="flex-1 lg:max-w-xs">
            <h3 className="text-white font-semibold mb-4">Contact</h3>

            <ul className="space-y-3 text-white/70 text-sm">
              <li>{settings?.contactDetails?.phone || "+91 90752 01035"}</li>
              <li>{settings?.contactDetails?.openHours || "(09:30 AM - 07:30 PM)"}</li>
              <li>
                <Link href={`mailto:${settings?.contactDetails?.email || "info@paarshelearning.com"}`}>
                  {settings?.contactDetails?.email || "info@paarshelearning.com"}
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 mt-8 pt-4 flex flex-col sm:flex-row justify-between items-center text-sm text-white/60 gap-2">
          <p>© {new Date().getFullYear()} Paarsh E-Learning. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/return-policy">Return Policy</Link>
            <Link href="/terms-and-conditions">Terms & Conditions</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;


// "use client";

// import React from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { getImgPath } from "@/utils/image";
// import { useSiteImages } from "@/hooks/useSiteImages";
// import { ChevronRight } from "lucide-react";

// const Footer = () => {
//   const { getImageUrl } = useSiteImages();
//   const [settings, setSettings] = React.useState<any>(null);

//   React.useEffect(() => {
//     const fetchSettings = async () => {
//       try {
//         const response = await fetch("/api/settings");
//         if (response.ok) {
//           const data = await response.json();
//           setSettings(data);
//         }
//       } catch (error) {
//         console.error("Failed to fetch settings:", error);
//       }
//     };
//     fetchSettings();
//   }, []);

//   return (
//     <footer className="bg-darkmode border-t border-dark_border pt-10 pb-6 mt-0">
//       <div className="container mx-auto max-w-6xl px-4">

//         <div className="flex flex-col lg:flex-row justify-between gap-8">

//           <div className="flex-1 text-left lg:max-w-xs">
//             <Link href="/" className="flex justify-start">
//               <Image
//                 src={getImageUrl("SITE_LOGO_DARK", getImgPath("/images/logo/logo-wide.webp"))}
//                 alt="Paarsh eLearning digital marketing training institute"
//                 width={250}
//                 height={100}
//                 className="mb-4"
//               />
//             </Link>

//             <p className="md:w-[400px] w-full text-white/70 text-sm leading-relaxed text-left">
//               Paarsh E-Learning is a leading edtech platform in Pune,<span className="hidden md:inline"><br></br></span> Nashik, and Surat, offering career-oriented courses in digital marketing and in-demand skills. Learn from industry experts through a secure and trusted online platform designed to help students build practical knowledge and achieve real career growth.
//             </p>

//           </div>

//           <div className="flex-1 text-left lg:max-w-xs ml-0 lg:ml-[22%]">
//             <h3 className="text-white font-semibold mb-4 text-left">Quick Links</h3>
//             <ul className="ggrid grid-cols-2 gap-x-10 gap-y-3 w-fit text-white/70 text-sm text-left font-medium">
//               <li className="group">
//                 <Link href="/#" className="flex items-center gap-1 hover:text-secondary transition-all duration-300">
//                   <ChevronRight className="w-3 h-3 text-secondary opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
//                   <span className="group-hover:translate-x-1 transition-transform duration-300">Home</span>
//                 </Link>
//               </li>
//               <li className="group">
//                 <Link href="/Course" className="flex items-center gap-1 hover:text-secondary transition-all duration-300">
//                   <ChevronRight className="w-3 h-3 text-secondary opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
//                   <span className="group-hover:translate-x-1 transition-transform duration-300">Courses</span>
//                 </Link>
//               </li>
//               <li className="group">
//                 <Link href="/about-us" className="flex items-center gap-1 hover:text-secondary transition-all duration-300">
//                   <ChevronRight className="w-3 h-3 text-secondary opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
//                   <span className="group-hover:translate-x-1 transition-transform duration-300">About</span>
//                 </Link>
//               </li>
//               <li className="group">
//                 <Link href="/workshops" className="flex items-center gap-1 hover:text-secondary transition-all duration-300">
//                   <ChevronRight className="w-3 h-3 text-secondary opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
//                   <span className="group-hover:translate-x-1 transition-transform duration-300">Workshops</span>
//                 </Link>
//               </li>
//               <li className="group">
//                 <Link href="/blog" className="flex items-center gap-1 hover:text-secondary transition-all duration-300">
//                   <ChevronRight className="w-3 h-3 text-secondary opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
//                   <span className="group-hover:translate-x-1 transition-transform duration-300">Blogs</span>
//                 </Link>
//               </li>
//               <li className="group">
//                 <Link href="/careers" className="flex items-center gap-1 hover:text-secondary transition-all duration-300">
//                   <ChevronRight className="w-3 h-3 text-secondary opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
//                   <span className="group-hover:translate-x-1 transition-transform duration-300">Careers</span>
//                 </Link>
//               </li>
//               <li className="group">
//                 <Link href="/inquiry" className="flex items-center gap-1 hover:text-secondary transition-all duration-300">
//                   <ChevronRight className="w-3 h-3 text-secondary opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
//                   <span className="group-hover:translate-x-1 transition-transform duration-300">Inquiry</span>
//                 </Link>
//               </li>
//               <li className="group">
//                 <Link href="/contact-us" className="flex items-center gap-1 hover:text-secondary transition-all duration-300">
//                   <ChevronRight className="w-3 h-3 text-secondary opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
//                   <span className="group-hover:translate-x-1 transition-transform duration-300">Contact</span>
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           <div className="flex-1 text-left lg:max-w-xs ml-0 lg:ml-[10%]">
//             <h3 className="text-white font-semibold mb-4 text-left">Contact</h3>
//             <ul className="space-y-3 text-white/70 text-sm flex flex-col items-start text-left">
//               <li className="flex items-center justify-start gap-2 hover:text-secondary transition cursor-pointer">
//                 <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1v3.5a1 1 0 01-1 1C9.16 22 2 14.84 2 5.5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.35.26 2.67.76 3.88.15.33.07.72-.21 1.11l-2.2 2.2z" />
//                 </svg>
//                 {settings?.contactDetails?.phone || "+91 90752 01035"}
//               </li>
//               <li className="flex items-center justify-start gap-2 hover:text-secondary transition cursor-pointer">
//                 <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm.5 10.5h4v-1h-3V7h-1v5.5z" />
//                 </svg>
//                 {settings?.contactDetails?.openHours || "(09:30 AM - 07:30 PM)"}
//               </li>
//               <li className="flex items-center justify-start gap-2 hover:text-secondary transition cursor-pointer">
//                 <Link href={`mailto:${settings?.contactDetails?.email || "info@paarshelearning.com"}`} className="flex items-center gap-2">
//                   <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 18V8l8 5 8-5v10H4z" />
//                   </svg>
//                   {settings?.contactDetails?.email || "info@paarshelearning.com"}
//                 </Link>
//               </li>

//               <ul className="flex items-center justify-start gap-4 mt-8 lg:mt-5">

//                 <li>
//                   <a
//                     href="https://www.facebook.com/paarsh.elearning/"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#2F73F2] transition duration-300 hover:scale-110"
//                   >
//                     <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.9h2.54V9.41c0-2.5 1.5-3.88 3.77-3.88 1.1 0 2.25.2 2.25.2v2.48h-1.27c-1.25 0-1.63.78-1.63 1.58v1.9h2.78l-.44 2.9h-2.34V22c4.78-.75 8.44-4.91 8.44-9.93z" />
//                     </svg>
//                   </a>
//                 </li>

//                 <li>
//                   <a
//                     href="https://www.instagram.com/accounts/login/?next=%2Fpaarsh_elearning%2F&source=omni_redirect"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#C13584] transition duration-300 hover:scale-110"
//                   >
//                     <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5zm0 2h8.5C18.55 4 20 5.45 20 7.75v8.5c0 2.3-1.45 3.75-3.75 3.75h-8.5C5.45 20 4 18.55 4 16.25v-8.5C4 5.45 5.45 4 7.75 4zm8.75 1.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
//                     </svg>
//                   </a>
//                 </li>

//                 <li>
//                   <a
//                     href="https://www.linkedin.com/in/paarsh-e-learning/?originalSubdomain=in"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#0077B5] transition duration-300 hover:scale-110"
//                   >
//                     <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M6.94 6.5A2.44 2.44 0 114.5 4.06 2.44 2.44 0 016.94 6.5zM4.75 8.75h4.38V20H4.75zM13.25 8.75h4.19v1.55h.06a4.6 4.6 0 014.14-2.28c4.43 0 5.25 2.91 5.25 6.7V20h-4.38v-4.94c0-1.18 0-2.69-1.64-2.69s-1.89 1.28-1.89 2.6V20h-4.38z" />
//                     </svg>
//                   </a>
//                 </li>

//                 <li>
//                   <a
//                     href="https://x.com/EPaarsh"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#1DA1F2] transition duration-300 hover:scale-110"
//                   >
//                     <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M18.9 2H22l-6.8 7.78L23 22h-6.9l-5.4-7.06L4.5 22H1.4l7.3-8.36L1 2h7l4.9 6.47L18.9 2zm-2.4 18h1.9L7.7 4H5.7l10.8 16z" />
//                     </svg>
//                   </a>
//                 </li>

//                 <li>
//                   <a
//                     href="https://www.youtube.com/@PaarshE-learning"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#FF0000] transition duration-300 hover:scale-110"
//                   >
//                     <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M23.498 6.186a2.993 2.993 0 00-2.112-2.122C19.653 3.5 12 3.5 12 3.5s-7.653 0-9.386.564a2.993 2.993 0 00-2.112 2.122A31.24 31.24 0 000 12a31.24 31.24 0 00.502 5.814 2.993 2.993 0 002.112 2.122C4.347 20.5 12 20.5 12 20.5s7.653 0 9.386-.564a2.993 2.993 0 002.112-2.122A31.24 31.24 0 0024 12a31.24 31.24 0 00-.502-5.814zM9.75 15.02V8.98l6.5 3.02-6.5 3.02z" />
//                     </svg>
//                   </a>
//                 </li>

//               </ul>
//             </ul>
//           </div>
//         </div>

//         <div className="border-t border-white/10 mt-8 pt-4 flex flex-col sm:flex-row justify-between items-center text-sm text-white/60 gap-2">
//           <p>© {new Date().getFullYear()} Paarsh E-Learning. All rights reserved.</p>
//           <p className="flex gap-9">
//             <Link href="/return-policy" className="hover:text-secondary transition-colors">Return Policy</Link>
//             <Link href="/terms-and-conditions" className="hover:text-secondary transition-colors">Terms & Conditions</Link>
//             <Link href="/privacy-policy" className="hover:text-secondary transition-colors">Privacy Policy</Link>
//           </p>
//         </div>
//       </div>
//     </footer>

//   );
// };

// export default Footer;

