// import React from 'react'
// import Image from 'next/image'
// import { getImgPath } from '@/utils/image'
// import { achievements } from '@/app/api/data'

// const Testimonial = () => {
//   return (
//     <section
//       className='scroll-mt-24 bg-section dark:bg-darklight border-none'
//       id='testimonials'>
//       <div className='container mx-auto max-w-6xl px-4'>
//         <div>
//           <div className='pt-10'>
//             <h2
//               className='sm:text-4xl text-[28px] leading-tight font-bold text-[#2F73F2] md:text-center text-start pb-20 md:w-4/6 w-full m-auto dark:text-white'
//               data-aos='fade-up'
//               data-aos-delay='200'
//               data-aos-duration='1000'>
//               Our Benefits
//             </h2>
//             <div className="ml-23 text-center">
//               <ul className="space-y-5">
//                 {achievements.map((item, index) => (
//                   <li key={index} className="flex items-start gap-4">
//                     <span className="mt-2 h-2.5 w-2.5 rounded-full bg-primary shrink-0"></span>
//                     <p className="text-md font-normal text-grey dark:text-white/70">
//                       {item.title}
//                     </p>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <Image
//               src={getImgPath('/images/testimonial/vector-smart.png')}
//               alt='logo'
//               width={150}
//               height={0}
//               quality={100}
//               className='w_f w-95! h-58! mr-10 -mt-[20%] ml-45'
//             />
//           </div>
//           {/* <div className='text-center'>
//             <strong className='text-lg font-bold text-midnight_text dark:text-primary'>
//               Jonathan Diesel
//             </strong>
//             <p className='text-base text-gray dark:text-white/50 '>
//               Happy Customer, Apple inc
//             </p>
//           </div> */}
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Testimonial
'use client'
import React from 'react'
import Image from 'next/image'
import { getImgPath } from '@/utils/image'
import { achievements } from '@/app/api/data'

const Testimonial = () => {
  return (
    <section
      className={`relative overflow-hidden scroll-mt-24 py-15 lg:py-20 bg-section dark:bg-darklight`}
      id='testimonials'
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className='container mx-auto max-w-7xl px-4 relative z-10'>
        <div className='text-center'>
          <div className='inline-flex items-center gap-2 bg-primary/5 dark:bg-primary/20 px-4 py-1.5 rounded-full border border-primary/10 mb-6'>
            <span className='w-2 h-2 rounded-full bg-primary animate-pulse'></span>
            <span className='font-bold text-primary dark:text-primary-light text-xs uppercase tracking-widest'>
              Value Proposition
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-primary dark:text-white tracking-tight">
            Our <span className="text-secondary relative">Benefits
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 150 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9C20 4 50 2 75 2C100 2 130 4 147 9" stroke="#01A0E2" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
        </div>

        <div className='grid lg:grid-cols-2 gap-8 lg:gap-14 items-center min-h-[auto] lg:min-h-[500px] mt-8 lg:-mt-15 mb-10 lg:-mb-20'>
          {/* Illustration with Floating Effect */}
          <div
            className='relative flex justify-center order-2 lg:order-2 group h-full items-center'
            data-aos='zoom-in'
            data-aos-duration='1200'
          >
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
            <div className="relative z-10 transform group-hover:scale-105 transition-transform duration-1000">
              <Image
                src={getImgPath('/images/testimonial/benefits.png')}
                alt='Benefits illustration'
                width={550}
                height={600}
                className='w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[500px] drop-shadow-2xl'
              />
            </div>

            {/* Floating Accents */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-secondary/20 rounded-2xl rotate-12 blur-sm animate-pulse" />
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-primary/10 rounded-full blur-md animate-bounce-slow" />
          </div>

          {/* Benefits List (Vertically Centered to match Image Height) */}
          <div className='order-1 lg:order-1 flex flex-col justify-center h-full'>
            <div className="space-y-8">
              {achievements.map((item, index) => (
                <div
                  key={index}
                  data-aos='fade-right'
                  data-aos-delay={index * 150}
                  className="flex items-start gap-5 group"
                >
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 dark:bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-primary dark:text-secondary group-hover:text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75 11.25 19 19.5 5.25" />
                    </svg>
                  </div>
                  <p className="text-gray-700 dark:text-white/80 font-bold text-lg leading-relaxed group-hover:text-primary dark:group-hover:text-white transition-colors duration-300">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-10px); }
          50% { transform: translateY(10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 5s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

export default Testimonial