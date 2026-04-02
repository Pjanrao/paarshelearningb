// import React from 'react'
// import Link from 'next/link'
// import { Servicebox } from '@/app/api/data'
// import { Icon } from '@iconify/react'
// import Image from 'next/image'

// const Services = () => {
//   return (
//     <section className='bg-section dark:bg-darklight' id='services'>
//       <div className='container mx-auto max-w-6xl px-4'>
//         {/* <div
//           className='flex gap-2 items-center justify-center'
//           data-aos='fade-up'
//           data-aos-delay='200'
//           data-aos-duration='1000'>
//           <span className='w-3 h-3 rounded-full bg-success'></span>
//           <span className='font-medium text-midnight_text text-sm dark:text-white/50'>
//             our services
//           </span>
//         </div> */}
//         <h2
//           className='sm:text-4xl text-[28px] leading-tight font-bold text-[#2F73F2] md:text-center text-start pt-7 pb-20 md:w-4/6 w-full m-auto dark:text-white'
//           data-aos='fade-up'
//           data-aos-delay='200'
//           data-aos-duration='1000'>
//           Strategies for Students
//         </h2>
//         <div className='grid md:grid-cols-12 sm:grid-cols-8 grid-cols-1 gap-7'>
//           {Servicebox.map((item, index) => (
//             <div
//               key={index}
//               data-aos='fade-up'
//               data-aos-delay={`${index * 200}`}
//               data-aos-duration='1000'
//               data-aos-offset='300'
//               className='col-span-4 bg-white flex flex-col justify-between items-center text-center py-14 px-7 shadow-service rounded-md gap-8 dark:bg-darkmode'>
//               <Image
//                 src={item.icon}
//                 alt='Service Box'
//                 width={0}
//                 height={0}
//                 className='w-10 h-10 bg-no-repeat inline-block bg-contain'
//               />
//               <h3 className='max-w-44 mx-auto text-2xl font-bold'>
//                 {item.title}
//               </h3>
//               <p className='dark:text-white/50 font-normal'>
//                 {item.description}
//               </p>
//               {/* <Link
//                 href='#'
//                 className='hover:text-blue-700 text-lg font-medium text-primary group flex items-center'>
//                 Get Started
//                 <span>
//                   <Icon
//                     icon='ei:chevron-right'
//                     width='30'
//                     height='30'
//                     className=''
//                   />
//                 </span>
//               </Link> */}
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Services

'use client'
import React from 'react'
import { Servicebox } from '@/app/api/data'
import Image from 'next/image'

const Services = () => {

  return (
    <section className='bg-section dark:bg-darklight py-6 lg:py-12' id='services'>
      <div className='container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>

        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary dark:text-white mb-4">
            Strategies for Students
          </h2>
          <div className="w-16 h-1 bg-secondary mx-auto rounded-full" />
        </div>

        <div className='lg:hidden flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth px-2 no-scrollbar pb-2 text-justify '>
          {Servicebox.map((item, index) => (
            <div
              key={index}
              data-aos='fade-up'
              data-aos-delay='200'
              data-aos-duration='1000'
              className='min-w-[85%] sm:min-w-[48%] snap-center bg-white dark:bg-darkmode border border-transparent hover:border-primary rounded-2xl shadow-service p-4 sm:p-5 flex flex-col items-center text-center gap-3 transition duration-300 hover:shadow-xl'>
              <Image
                src={item.icon}
                alt="Service Box"
                width={36}
                height={36}
                className="w-auto h-9 object-contain"
              />

              <h3 className='text-md sm:text-lg font-bold max-w-[180px]'>
                {item.title}
              </h3>

              <p className='text-[13px] sm:text-sm dark:text-white/60 leading-snug'>
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className='hidden lg:grid grid-cols-3 gap-6'>
          {Servicebox.map((item, index) => (

            <div
              key={index}
              className='bg-white dark:bg-darkmode border border-transparent hover:border-secondary rounded-2xl shadow-service py-7 px-6 flex flex-col items-center text-center gap-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg'>
              <Image
                src={item.icon}
                alt="Service Box"
                width={36}
                height={36}
                className="w-auto h-9 object-contain"
              />
              <h3 className='text-lg font-bold max-w-44'>
                {item.title}
              </h3>

              <p className='text-sm dark:text-white/60 leading-relaxed'>
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Services
