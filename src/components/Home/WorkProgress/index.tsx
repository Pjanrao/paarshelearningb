// 'use client'
// import React, { useEffect, useState } from 'react'
// import Image from 'next/image'
// import { points } from '@/app/api/data'
// import { getImgPath } from '@/utils/image'


// interface ProgressItem {
//   title: string
//   Progress: number
// }

// const Progresswork = ({ isColorMode }: { isColorMode: Boolean }) => {


//   return (
//     <section
//       className={`scroll-mt-25 ${isColorMode
//         ? 'dark:bg-darklight bg-section'
//         : 'dark:bg-darkmode bg-white'
//         }`}
//       id='about'>
//       <div className='container mx-auto max-w-6xl px-4'>

//         <div className='grid md:grid-cols-12 items-center gap-7'>

//           <div className='md:col-span-6'>
//             <Image
//               src={getImgPath('/images/work-progress/Image.png')}
//               alt='logo'
//               width={375}
//               height={0}
//               quality={100}
//               style={{ width: 'auto', height: '700px',marginLeft:'80px' }}
//               className='md:block hidden'
//             />
//           </div>
//           <div
//             className='md:col-span-6'
//             data-aos='fade-left'
//             data-aos-delay='200'
//             data-aos-duration='1000'>
//             <div className='flex gap-2 items-center'>
//               <span className='w-3 h-3 rounded-full bg-success'></span>
//               <span className='font-medium text-midnight_text text-sm dark:text-white/50'>
//                 Why Choose ?
//               </span>
//             </div>
//             <h2 className='pt-9 pb-8 text-[#2F73F2] font-bold dark:text-white text-4xl'>
//               Paarsh E - Learning
//             </h2>
//             <p className='text-gray dark:text-white/70 text-base font-semibold'>
//               Paarsh E-Learning delivers industry-focused education through expert mentors and live interactive sessions.
//               We combine practical learning, quality resources, and career support to help you achieve real success.
//             </p>

//             <div className="block mx-auto pt-10">
//               <ul className="space-y-5">
//                 {points.map((item, index) => (
//                   <li key={index} className="flex items-start gap-4">
//                     <span className="mt-2 h-2.5 w-2.5 rounded-full bg-primary shrink-0"></span>
//                     <p className="text-sm font-normal text-grey dark:text-white/70">
//                       {item.title}
//                     </p>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Progresswork



'use client'
import React from 'react'
import Image from 'next/image'
import { points } from '@/app/api/data'
import { getImgPath } from '@/utils/image'

import { Icon } from '@iconify/react'

interface ProgressItem {
  title: string
  Progress: number
}

const Progresswork = ({ isColorMode }: { isColorMode: Boolean }) => {
  return (
    <section
      className={`relative overflow-hidden py-12 lg:py-20 ${isColorMode
        ? 'dark:bg-darklight bg-section'
        : 'dark:bg-darkmode bg-white'
        }`} id='about'>

      {/* Decorative Background Elements */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className='container mx-auto max-w-6xl px-4 relative z-10'>
        <div className='grid lg:grid-cols-2 gap-8 lg:gap-12 items-center'>

          {/* Left Side: Visual Content */}
          <div
            className='relative flex justify-center order-2 lg:order-1'
            data-aos='zoom-in-right'
            data-aos-duration='2000'>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-primary/5 rounded-full blur-[70px]" />

            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[45px] blur-xl opacity-40 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-2.5 rounded-[40px] shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden">
                <Image
                  src={getImgPath('/images/work-progress/why_choose.png')}
                  alt='Why Choose Paarsh'
                  width={280}
                  height={280}
                  quality={100}
                  className='h-auto w-fit max-w-[280px] sm:max-w-[360px] object-contain transform group-hover:scale-105 transition-transform duration-1000'
                />
              </div>

              {/* Success Badge */}
              <div className="absolute -bottom-4 -left-6 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-2xl border border-primary/10 hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Icon icon="ic:round-check-circle" className="text-2xl" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Success Rate</p>
                  <p className="text-xl font-black text-primary">100%</p>
                </div>
              </div>

              {/* Expert Badge */}
              <div className="absolute -top-4 -right-6 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-2xl border border-secondary/10 hidden sm:flex items-center gap-3">
                <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center text-white shadow-lg shadow-secondary/20">
                  <Icon icon="ic:round-school" className="text-xl" />
                </div>
                <p className="text-xs font-bold text-primary dark:text-white uppercase tracking-wider">Expert Mentors</p>
              </div>
            </div>
          </div>

          {/* Right Side: Content */}
          <div
            className='order-1 lg:order-2 text-left'
            data-aos='fade-left'
            data-aos-duration='800'
          >
            <div className='inline-flex items-center gap-2 bg-primary/5 dark:bg-primary/20 px-4 py-1.5 rounded-full border border-primary/10 mb-5'>
              <span className='w-2 h-2 rounded-full bg-primary animate-pulse'></span>
              <span className='font-bold text-primary dark:text-primary-light text-xs uppercase tracking-widest'>
                Why Choose ?
              </span>
            </div>

            <h2 className='text-xl sm:text-2xl lg:text-4xl font-black text-primary dark:text-white leading-[1.1] mb-6'>
              Paarsh <span className="text-secondary relative whitespace-nowrap">E-Learning
                <svg className="absolute bottom-0 md:-bottom-2 left-0 w-full" viewBox="0 0 318 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.5 9C27.2302 4.0492 68.3033 2 159 2C249.697 2 290.77 4.0492 314.5 9" stroke="#01A0E2" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
            </h2>

            <p className='text-gray-600 dark:text-white/70 text-sm md:text-base leading-relaxed mb-8 max-w-xl'>
              Deliver industry-focused education through expert mentors and live interactive sessions. We combine practical learning and career support for real success.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {points.map((item, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-white/5 border border-primary/5 hover:border-secondary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/5 dark:bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Icon icon="ic:round-check" className="text-primary dark:text-secondary group-hover:text-white text-xl" />
                  </div>
                  <p className="text-gray-700 dark:text-white/80 font-bold text-[11px] lg:text-[12px] leading-tight transition-colors duration-300 group-hover:text-primary dark:group-hover:text-white">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Progresswork
