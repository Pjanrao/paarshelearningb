// 'use client'
// import { getImgPath } from '@/utils/image'
// import Image from 'next/image'
// import Link from 'next/link'

// const Hero = () => {
//   return (
//     <section className='relative md:pt-32 pt-20 bg-white dark:bg-darklight bg-cover text-white'>
//       <div className='container mx-auto max-w-6xl px-4 grid grid-cols-12 gap-4 relative z-10'>
//         <div
//           className='md:col-span-6 col-span-12 p-4 md:px-4 px-0 space-y-4 flex flex-col items-start justify-center'
//           data-aos='fade-right'
//           data-aos-delay='200'
//           data-aos-duration='1000'>
//           <div className='flex gap-2 items-center'>
//             <span className='w-3 h-3 rounded-full bg-success'></span>
//             <span className='font-medium text-midnight_text text-sm dark:text-white/50 mt-0'>
//               Learn & Grow
//             </span>
//           </div>
//           <h1 className='text-midnight_text font-bold dark:text-white text-4xl md:text-5xl md:leading-[1.15]'>
//             Education: The Gateway to Success
//           </h1>
//           <p className='text-grey dark:text-white/70 text-xl font-normal'>
//             Education is door for future & Paarsh E-Learning is the key for Bright your future
//           </p>
//           <a
//             href='/Course'
//             className='py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 px-8'>
//             Explore More
//           </a>

//           <div className='flex items-center mt-12 gap-4'>
//             <div className='flex items-center'>
//               <Image
//                 src={getImgPath('/images/hero/hero-profile-1.jpg')}
//                 alt='hero-image'
//                 width={40}
//                 height={40}
//                 quality={100}
//                 className='w-10! h-10! rounded-full border border-solid border-white -ml-0'
//               />
//               <Image
//                 src={getImgPath('/images/hero/hero-profile-2.jpg')}
//                 alt='hero-image'
//                 width={40}
//                 height={40}
//                 quality={100}
//                 className='w-10! h-10! rounded-full border border-solid border-white -ml-3'
//               />
//               <Image
//                 src={getImgPath('/images/hero/hero-profile-3.jpg')}
//                 alt='hero-image'
//                 width={40}
//                 height={40}
//                 quality={100}
//                 className='w-10! h-10! rounded-full border border-solid border-white -ml-3'
//               />
//             </div>
//             <div>
//               <p className='text-sm font-normal text-grey max-w-56'>
//                 Need help?{' '}
//                 <Link href='/contact-us' className='text-primary hover:text-blue-700'>
//                   Contact our experts
//                 </Link>{' '}
//                 Tell us about your project
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="md:col-span-6 col-span-12 relative flex justify-center items-center">
//           <Image
//             src={getImgPath('/images/hero/Class2.png')}
//             alt='hero-image'
//             width={700}
//             height={450}
//             quality={100}
//             className="w-full h-auto sm:h-[50px] lg:h-[350px] object-cover rounded-[10px] mt-8"
//           />
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Hero

"use client";
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { useSiteImages } from '@/hooks/useSiteImages'
import { getImgPath } from '@/utils/image'
import { motion, Variants } from 'framer-motion'

const Hero = () => {
  const { getImageUrl } = useSiteImages();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const }
    }
  };

  return (
    <section className='relative min-h-[50vh] flex items-center pt-10 mt-5 md:mt-12 overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#e0f7ff] via-[#b9eaff] to-[#ffffff] dark:from-slate-900 dark:to-slate-800 -mb-10'>

      {/* Decorative Blur Shapes */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>

      <div className='container mx-auto max-w-7xl px-6 grid grid-cols-12 gap-8 relative z-10'>

        {/* Left Content */}
        <motion.div
          className='md:col-span-6 col-span-12 flex flex-col items-start justify-center'
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          <motion.div 
            variants={itemVariants}
            className='flex gap-2 items-center mb-6 mt-8 md:mt-0 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-primary/20 shadow-sm'
          >
            <span className='w-2 h-2 rounded-full bg-primary'></span>
            <span className='font-semibold text-primary/80 text-xs uppercase tracking-widest'>
              Learn & Grow
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className='text-[#0f172a] font-black dark:text-white text-3xl sm:text-4xl md:text-5xl leading-[1.1] mb-4 tracking-tight'
          >
            Education : <br />
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary'>
              The Gateway to Success
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className='text-slate-600 dark:text-slate-300 text-base md:text-lg font-normal max-w-xl mb-8 leading-relaxed'
          >
            Paarsh eLearning is a leading institute in Nashik offering industry-focused programming language training with real-time projects and placement support.
          </motion.p>

          <motion.div variants={itemVariants} className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="relative"
            >
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-2xl animate-ping bg-primary/30 pointer-events-none" />
              <Link
                href='/Course'
                className='relative py-4 px-10 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary/90 transition-colors duration-200 inline-block'>
                Enroll Now
              </Link>
            </motion.div>
          </motion.div>


          <motion.div variants={itemVariants} className='flex items-center gap-3 mt-10'>
            <div className='flex -space-x-3'>
              {[1, 2, 3].map((i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -5, scale: 1.1, zIndex: 30 }}
                  className='w-12 h-12 rounded-full border-4 border-white overflow-hidden shadow-sm transition-all duration-300 relative'
                >
                  <Image
                    src={getImgPath(`/images/hero/hero-profile-${i}.jpg`)}
                    alt='Learn SEO with practical projects'
                    width={60}
                    height={60}
                  />
                </motion.div>
              ))}
            </div>
            <p className='text-sm font-normal text-grey max-w-56'>
              Need help?<br />
              <Link href='/contact-us' className='text-primary hover:text-blue-700'>
                Contact our experts<br />
              </Link>
              Tell us about your project
            </p>
          </motion.div>
        </motion.div>


        <motion.div
          className="md:col-span-6 col-span-12 relative flex justify-center items-center py-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        >

          <div className="relative w-full max-w-[500px] lg:max-w-[600px] group">
            {/* Multiple Layered Background Decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
            <motion.div 
              animate={{ 
                y: [0, -15, 0],
                x: [0, 10, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-[60px]"
            ></motion.div>

            {/* Decorative Grid Pattern (SVG) */}
            <div className="absolute inset-0 opacity-20 dark:opacity-10 z-0 pointer-events-none" style={{ backgroundImage: `radial-gradient(#2F73F2 1px, transparent 1px)`, backgroundSize: '30px 30px' }}></div>

            {/* Main Image with Glassmorphism Frame */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative z-10 p-2 md:p-3 rounded-[40px] md:rounded-[60px] bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] overflow-hidden animate-float"
            >
              <div className="relative overflow-hidden rounded-[30px] md:rounded-[50px] aspect-[4/3]">
                <Image
                  src={getImageUrl("HOME_HERO_BG", getImgPath('/images/hero/digital-marketing-course.png'))}
                  alt='Advanced digital marketing training in Nashik'
                  fill
                  priority
                  quality={100}
                  className="object-cover transform group-hover:scale-110 transition-transform duration-[2000ms]"
                />

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/10 opacity-60"></div>
              </div>
            </motion.div>

            {/* Floating Elements / Icons */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -left-4 w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center text-primary z-20 border border-primary/10"
            >
              <Icon icon="ic:round-school" className="text-2xl" />
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/4 -right-6 w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center text-secondary z-20 border border-secondary/10"
            >
              <Icon icon="ic:round-menu-book" className="text-2xl" />
            </motion.div>

            <motion.div 
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute -bottom-8 left-10 w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center text-blue-400 z-20 border border-blue-400/10"
            >
              <Icon icon="ic:round-code" className="text-2xl" />
            </motion.div>

            {/* Enhanced Success Badge */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
              className="absolute -bottom-4 -right-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-primary/20 z-20 hidden md:flex items-center gap-4 animate-float"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                <Icon icon="ic:round-verified" className="text-2xl" />
              </div>
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-[2px] leading-none mb-1">Success Rate</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-800 dark:text-white">98%</span>
                  <span className="text-xs font-bold text-slate-400 uppercase">Verified</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

export default Hero