"use client";

import React, { useState } from "react";
import HeroSub from "@/components/SharedComponent/HeroSub";
import Counter from "@/components/Home/Counter";
import Progresswork from "@/components/Home/WorkProgress";
import "./page.css";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import {
  GraduationCap,
  Globe,
  BookOpen,
  Briefcase,
  Rocket,
  Lightbulb,
  BarChart3,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { getImgPath } from '@/utils/image'
import Image from 'next/image'
import { useSiteImages } from '@/hooks/useSiteImages'
import { motion, Variants } from "framer-motion";

/* ─── Reusable animation variants ─────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } }
};

const fadeDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } }
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } }
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } }
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
};

const itemFadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: "easeOut" as const } }
};

/* ─── Component ─────────────────────────────────────────── */
const AboutPage = () => {
  const { getImageUrl } = useSiteImages();
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [isFounderExpanded, setIsFounderExpanded] = useState(false);

  const missions = [
    {
      icon: <GraduationCap size={24} />,
      title: "High-Quality Education",
      desc: "Deliver industry-relevant courses designed by experts."
    },
    {
      icon: <Globe size={24} />,
      title: "Foster Accessibility",
      desc: "Make learning accessible worldwide with flexible options."
    },
    {
      icon: <BookOpen size={24} />,
      title: "Promote Lifelong Learning",
      desc: "Empower learners to continuously upgrade their skills."
    },
    {
      icon: <Briefcase size={24} />,
      title: "Facilitate Job Placement",
      desc: "Bridge learning and employment with placement assistance."
    },
    {
      icon: <Rocket size={24} />,
      title: "Embrace Innovation & Technology",
      desc: "Adopt latest technologies for engaging learning experiences."
    }
  ]

  return (
    <>
      {/* ── Hero / Intro ───────────────────────────────────── */}
      <div className="w-full pt-20 pb-4 md:pt-32 text-center bg-white text-primary dark:bg-[#18181b] dark:text-white transition-colors duration-300 relative overflow-hidden">

        {/* Floating background orbs — properly visible */}
        <motion.div
          className="absolute top-10 left-10 w-52 h-52 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(59,130,246,0.12)" }}
          animate={{ scale: [1, 1.35, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(99,102,241,0.12)" }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(99,102,241,0.06)" }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating sparkle dots — visible with proper colours */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${6 + (i % 3) * 4}px`,
              height: `${6 + (i % 3) * 4}px`,
              left: `${8 + i * 8.5}%`,
              top: `${18 + (i % 5) * 14}%`,
              background: i % 2 === 0
                ? "rgba(59,130,246,0.45)"
                : "rgba(99,102,241,0.45)",
              boxShadow: i % 2 === 0
                ? "0 0 8px rgba(59,130,246,0.5)"
                : "0 0 8px rgba(99,102,241,0.5)",
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 3 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.28,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Page title */}
        <motion.div
          className="text-center mb-16 md:mb-10"
          variants={fadeDown}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-950 dark:text-white mb-6">
            About Us
          </h2>
          <motion.div
            className="w-20 h-1.5 bg-secondary mx-auto rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" as const }}
            style={{ originX: 0.5 }}
          />
          {/* Pulsing glow under underline */}
          <motion.div
            className="w-8 h-1 bg-blue-400/40 mx-auto rounded-full mt-1 blur-sm"
            animate={{ scaleX: [1, 2, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          />
        </motion.div>

        {/* About text block */}
        <motion.div
          className="about-text dark:bg-transparent tracking-tighter mx-auto max-w-6xl relative z-10"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <div className={`relative transition-all duration-700 ease-in-out ${isAboutExpanded ? 'max-h-[3000px]' : 'max-h-[350px] overflow-hidden'}`}>
            <p>Welcome to Paarsh E-Learning, your premier destination for online and offline learning across a wide range of courses. We are committed to providing high-quality education and empowering individuals to achieve their career goals. With our unique approach, we strive to make learning accessible, engaging, and effective.</p>
            <p>Founded in 2018 in Nashik, Paarsh E-Learning has quickly emerged as a leading platform for both online and offline education. Our mission is to bridge the gap between traditional learning methods and the evolving needs of modern learners. We understand that education should not be limited by geographical boundaries, and that's why we offer our courses through both online and offline channels.</p>
            <p>Our comprehensive course catalog covers a diverse range of subjects, ensuring that learners from various backgrounds and interests can find the right program for their needs. Whether you're interested in technology, business, design, health sciences, or any other field, we have courses designed to enhance your skills and knowledge.</p>
            <p>At Paarsh E-Learning, we take pride in our commitment to ensuring your success. We offer a unique 100% job placement guarantee, where we work closely with industry partners to provide you with promising career opportunities upon completion of your chosen course. We believe that education should be a stepping stone towards meaningful employment, and we strive to equip our learners with the necessary skills and connections to thrive in their chosen fields.</p>
            <p>To create a dynamic learning experience, we offer daily live sessions conducted by industry experts. These sessions enable you to interact with instructors and fellow learners in real-time, fostering a collaborative and engaging learning environment. Additionally, we provide one-to-one mentorship, where experienced mentors guide and support you throughout your learning journey. This personalized attention ensures that you receive the guidance and feedback needed to excel in your studies.</p>
            <p>With Paarsh E-Learning, you can access your courses at your convenience, allowing you to learn at your own pace and from any location. Our user-friendly platform provides seamless navigation, interactive resources, and a range of multimedia content to enhance your learning experience. We believe that education should be enjoyable and immersive, and we continuously strive to provide you with the best learning environment possible.</p>
            <p>Join us at Paarsh E-Learning and embark on a transformative educational journey. Whether you're looking to acquire new skills, enhance your career prospects, or simply pursue a passion, we are here to support you every step of the way. Explore our courses, engage with our community, and unlock your full potential with Paarsh E-Learning.</p>
            <p>We look forward to having you on board!</p>
            <p className="text-left font-bold border-t border-gray-100 dark:border-white/10 pt-10 mt-1">Sincerely,</p>
            <p className="text-left mb-5 text-secondary font-bold">The Paarsh E-Learning Team</p>

            {!isAboutExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#18181b] dark:via-[#18181b]/80 z-20" />
            )}
          </div>

          <div className="mt-[-25px] relative z-30 pb-10">
            {/* Pulse ring behind button */}
            <div className="relative inline-block">
              <motion.div
                className="absolute inset-0 rounded-full border border-blue-400/30 pointer-events-none"
                animate={{ scale: [1, 1.5, 1.8], opacity: [0.5, 0.2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.button
                onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 mx-auto px-8 py-3 rounded-full bg-white dark:bg-gray-800 border border-blue-500/30 text-primary font-bold shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 group"
              >
                <span className="group-hover:text-secondary">{isAboutExpanded ? "Read Less" : "Read More"}</span>
                <div className={`transition-transform duration-300 ${isAboutExpanded ? 'rotate-180' : ''}`}>
                  <ChevronDown size={20} className="text-primary" />
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Animated Wave Divider between Hero & Mission/Vision ── */}
      <div className="relative h-16 bg-white dark:bg-[#18181b] overflow-hidden">
        <motion.svg
          viewBox="0 0 1440 64"
          className="absolute bottom-0 w-full"
          preserveAspectRatio="none"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.path
            d="M0,32 C240,64 480,0 720,32 C960,64 1200,0 1440,32 L1440,64 L0,64 Z"
            fill="rgba(249,251,255,1)"
            className="dark:fill-[#1f1f27]"
            animate={{ d: [
              "M0,32 C240,64 480,0 720,32 C960,64 1200,0 1440,32 L1440,64 L0,64 Z",
              "M0,16 C240,48 480,16 720,16 C960,16 1200,48 1440,16 L1440,64 L0,64 Z",
              "M0,32 C240,64 480,0 720,32 C960,64 1200,0 1440,32 L1440,64 L0,64 Z",
            ]}}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.svg>
      </div>

      {/* ── Mission / Vision ──────────────────────────────── */}
      <section className="py-32 bg-[#f9fbff] dark:bg-[#1f1f27]">
        {/* Animated section heading badge */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full border"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.10) 0%, rgba(99,102,241,0.10) 100%)",
              borderColor: "rgba(59,130,246,0.25)",
            }}
            animate={{
              boxShadow: [
                "0 0 0px rgba(59,130,246,0)",
                "0 0 18px rgba(59,130,246,0.25)",
                "0 0 0px rgba(59,130,246,0)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.span
              className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500"
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <span className="text-blue-700 dark:text-blue-300 font-bold text-sm tracking-wide uppercase">
              Mission &amp; Vision
            </span>
            <motion.span
              className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500"
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: 0.7 }}
            />
          </motion.div>
        </motion.div>

        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-4 items-stretch">

            {/* Our Mission — slides in from left */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-[30px] p-6 md:p-10 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-50 dark:border-white/5 flex flex-col group/missionCard transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/5 min-h-[620px]"
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <h3 className="text-2xl font-black text-blue-950 dark:text-white mb-8 flex items-center gap-4">
                Our Mission
                <div className="h-1 flex-1 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-0 group-hover/missionCard:w-full bg-blue-600 transition-all duration-1000 ease-out" />
                </div>
              </h3>

              {/* Staggered mission items */}
              <motion.div
                className="space-y-3 flex-1"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {missions.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemFadeUp}
                    whileHover={{ y: -4, transition: { duration: 0.25 } }}
                    className="group relative flex gap-4 p-4 rounded-2xl transition-all duration-500 bg-blue-50/50 dark:bg-blue-950/20 border border-transparent hover:border-blue-200/50 dark:hover:border-blue-800/50 hover:shadow-xl backdrop-blur-sm"
                  >
                    {/* Hover Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/10 to-blue-100/10 dark:via-white/5 dark:to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                    {/* Icon Container */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-white/5 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                        {item.icon}
                      </div>
                      {/* Decorative point */}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-white dark:border-gray-800 bg-secondary scale-0 group-hover:scale-100 transition-transform duration-500 delay-100" />
                    </div>

                    <div className="relative z-10 flex-1">
                      <h4 className="font-bold text-lg text-blue-950 dark:text-white mb-1 group-hover:translate-x-1 transition-transform duration-500 leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed group-hover:text-primary dark:group-hover:text-blue-300 transition-colors">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Animated bottom accent bar */}
              <motion.div
                className="mt-6 h-1 rounded-full bg-gradient-to-r from-blue-600 via-indigo-400 to-blue-300 opacity-30"
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
              />

              {/* NEW: Animated counter row at bottom of Mission card */}
              <motion.div
                className="mt-6 grid grid-cols-3 gap-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                {[
                  { value: "5K+", label: "Students" },
                  { value: "100%", label: "Placement" },
                  { value: "2018", label: "Founded" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    variants={itemFadeUp}
                    whileHover={{ scale: 1.08, y: -3 }}
                    className="flex flex-col items-center bg-blue-50 dark:bg-blue-900/20 rounded-2xl py-3 px-2 border border-blue-100/60 dark:border-blue-800/20 cursor-default"
                  >
                    <motion.span
                      className="text-lg font-black text-blue-700 dark:text-blue-300"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.12, type: "spring", stiffness: 200 }}
                    >
                      {stat.value}
                    </motion.span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                      {stat.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Our Vision — slides in from right */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-[30px] p-6 md:p-10 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-50 dark:border-white/5 flex flex-col items-center group/card transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/5 min-h-[620px]"
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <h3 className="text-2xl font-black text-blue-950 dark:text-white mb-8 self-start flex items-center gap-4 w-full">
                Our Vision
                <div className="h-1 flex-1 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-0 group-hover/card:w-full bg-blue-600 transition-all duration-1000 ease-out" />
                </div>
              </h3>

              <div className="w-full flex-1 flex flex-col items-center justify-center py-2">
                {/* Image with scale-in + floating animation */}
                <motion.div
                  className="w-full max-w-[380px] mb-6 group/img mx-auto md:mx-0 relative"
                  variants={scaleIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {/* NEW: Animated glowing ring around image */}
                  <motion.div
                    className="absolute -inset-3 rounded-2xl pointer-events-none"
                    style={{
                      background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.2), rgba(59,130,246,0.2))",
                      backgroundSize: "200% 200%",
                    }}
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                      opacity: [0.5, 0.9, 0.5],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {/* floating animation wrapper */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl group-hover/img:scale-[1.02] transition-transform duration-700 ease-in-out">
                      <div className="absolute inset-0 bg-blue-600/5 group-hover/img:bg-transparent transition-colors duration-500 z-10" />
                      <Image src={getImageUrl("ABOUT_US_BANNER", "/images/contact-page/Working.png")} alt="Vision" fill className="object-contain p-2 relative z-0" />
                    </div>
                  </motion.div>
                </motion.div>

                {/* Vision quote */}
                <motion.div
                  className="text-center mb-6 px-4"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                >
                  <p className="text-xl md:text-2xl font-black text-blue-950 dark:text-blue-400 leading-tight italic">
                    "To empower individuals worldwide through
                    <span className="text-secondary decoration-secondary/30 decoration-4 underline-offset-4 decoration-skip-ink-none not-italic"> accessible and innovative </span>
                    learning."
                  </p>
                </motion.div>
              </div>

              {/* Bottom icon row — staggered */}
              <motion.div
                className="grid grid-cols-3 gap-4 w-full pt-8 border-t border-gray-100 dark:border-white/10 mt-auto"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
              >
                {[
                  { icon: <Globe size={24} />, label: <>Global<br />Learning</> },
                  { icon: <BarChart3 size={24} />, label: <>Career<br />Growth</> },
                  { icon: <Lightbulb size={24} />, label: <>Innovation<br />First</> },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={itemFadeUp}
                    whileHover={{ scale: 1.08, y: -4 }}
                    transition={{ type: "spring", stiffness: 350, damping: 18 }}
                    className="flex flex-col items-center gap-3 group/item cursor-pointer"
                  >
                    {/* rotating icon on mount */}
                    <motion.div
                      className="w-14 h-14 flex items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all duration-500 shadow-sm border border-blue-100/50 dark:border-blue-800/20"
                      initial={{ rotate: -15, opacity: 0 }}
                      whileInView={{ rotate: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 * i, duration: 0.5, type: "spring", stiffness: 200 }}
                    >
                      {item.icon}
                    </motion.div>
                    <span className="text-[10px] font-black text-gray-400 group-hover/item:text-secondary transition-colors uppercase tracking-[0.2em] text-center leading-tight">
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Animated bottom accent bar */}
              <motion.div
                className="mt-6 h-1 rounded-full bg-gradient-to-r from-indigo-300 via-blue-500 to-indigo-600 opacity-30 w-full"
                initial={{ scaleX: 0, originX: 1 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Animated Section Divider before Founder ── */}
      <div className="relative overflow-hidden" style={{ height: "80px", background: "transparent" }}>
        {/* Travelling dot trail */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{ background: i % 2 === 0 ? "rgba(59,130,246,0.6)" : "rgba(99,102,241,0.6)" }}
            animate={{ x: ["-10%", "110%"] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.55,
              ease: "linear",
            }}
          />
        ))}
        {/* Animated horizontal line */}
        <motion.div
          className="absolute top-1/2 left-4 right-4 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)" }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </div>

      {/* ── Founder Section ───────────────────────────────── */}
      <motion.div
        className="founder-section"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="social-media-container founder-section-dark">

          <motion.h1
            className="founder-text"
            variants={fadeDown}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            Pratiksha Baviskar
          </motion.h1>
          <motion.h3
            className="ceo-text"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.1 }}
          >
            Founder
          </motion.h3>

          {/* Social icons — staggered + bounce entrance */}
          <motion.div
            className="social-icons-row"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            {[
              { href: "https://m.facebook.com/pratiksha.baviskar.2025/", icon: <FaFacebookF size={18} />, cls: "social-icon facebook" },
              { href: "https://www.instagram.com/pratikshabaviskar?igsh=bGE5Nng1ZDhiaWV3", icon: <FaInstagram size={18} />, cls: "social-icon instagram" },
              { href: "https://www.linkedin.com/in/pratiksha-baviskar-425b43141?utm_source=share_via&utm_content=profile&utm_medium=member_android", icon: <FaLinkedinIn size={18} />, cls: "social-icon linkedin" },
            ].map((s, i) => (
              <motion.a
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.7 },
                  visible: {
                    opacity: 1, y: 0, scale: 1,
                    transition: { type: "spring", stiffness: 300, damping: 14, delay: i * 0.12 }
                  }
                }}
                whileHover={{ scale: 1.18, rotate: 6 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 14 }}
                className={s.cls}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.icon}
              </motion.a>
            ))}
          </motion.div>

          <motion.div
            className="mission-vision-container mission-vision-container-dark rounded-3xl p-3 mt-1 relative"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* NEW: animated glowing top-border on founder bio card */}
            <motion.div
              className="absolute top-0 left-8 right-8 h-0.5 rounded-full"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.6), rgba(99,102,241,0.6), transparent)",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            <motion.h2
              className="text-xl md:text-2xl font-bold mb-6"
              variants={fadeDown}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              "Visionary Leader and Education Advocate"
            </motion.h2>

            <div className={`relative transition-all duration-700 ease-in-out ${isFounderExpanded ? 'max-h-[2000px]' : 'max-h-[250px] overflow-hidden'}`}>
              <p>
                Pratiksha Baviskar, the Founder of Paarsh E-Learning, is a visionary leader with a passion for transforming the education landscape. With a deep understanding of the power of learning and its potential to shape lives, Pratiksha is dedicated to providing accessible and innovative educational opportunities to individuals worldwide.
              </p>
              <p>
                Driven by a strong belief in the value of education, Pratiksha has spearheaded the growth of Paarsh E-Learning since its inception in 2018. Under her leadership, the platform has become a trusted destination for learners seeking high-quality courses and holistic support.
              </p>
              <p>
                With a forward-thinking mindset, Pratiksha remains at the forefront of educational advancements, embracing technology and innovative teaching methodologies to enhance the learning experience. She continuously collaborates with industry experts and partners to ensure that Paarsh E-Learning's courses align with current market trends and industry demands, giving learners a competitive edge in their chosen fields.
              </p>
              <p>
                Pratiksha's commitment to empowering individuals extends beyond the classroom. She is deeply invested in promoting lifelong learning, cultivating a supportive community, and facilitating job placements for learners, enabling them to thrive personally and professionally. Her dedication to ethical practices and responsible learning creates an environment where learners can grow, connect, and contribute positively to society.
              </p>
              <p>
                As the Founder, Pratiksha Baviskar brings a unique blend of visionary thinking, strategic acumen, and a genuine passion for education to Paarsh E-Learning. With his leadership, the platform continues to expand its reach, making a lasting impact on the lives of learners worldwide.
              </p>

              {!isFounderExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 z-20" />
              )}
            </div>

            <div className="mt-[-20px] relative z-30">
              {/* Pulse ring behind founder Read More button */}
              <div className="relative inline-block">
                <motion.div
                  className="absolute inset-0 rounded-full border border-blue-400/30 pointer-events-none"
                  animate={{ scale: [1, 1.5, 1.8], opacity: [0.5, 0.2, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.button
                  onClick={() => setIsFounderExpanded(!isFounderExpanded)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 mx-auto px-8 py-3 rounded-full bg-white dark:bg-gray-800 border border-blue-500/30 text-primary font-bold shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 group"
                >
                  <span className="group-hover:text-secondary">{isFounderExpanded ? "Read Less" : "Read More"}</span>
                  <div className={`transition-transform duration-300 ${isFounderExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} className="text-primary" />
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default AboutPage;