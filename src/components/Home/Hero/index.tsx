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


'use client'
import { getImgPath } from '@/utils/image'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react'

const Hero = () => {
  return (
    <section className='relative min-h-[50vh] flex items-center pt-10 mt-5 md:mt-12 overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#e0f7ff] via-[#b9eaff] to-[#ffffff] dark:from-slate-900 dark:to-slate-800 -mb-10'>

      {/* Decorative Blur Shapes */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>

      <div className='container mx-auto max-w-7xl px-6 grid grid-cols-12 gap-8 relative z-10'>

        {/* Left Content */}
        <div
          className='md:col-span-6 col-span-12 flex flex-col items-start justify-center'
          data-aos='fade-right'
          data-aos-duration='1000'>

          <div className='flex gap-2 items-center mb-6 mt-8 md:mt-0 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-primary/20 shadow-sm'>
            <span className='w-2 h-2 rounded-full bg-primary'></span>
            <span className='font-semibold text-primary/80 text-xs uppercase tracking-widest'>
              Learn & Grow
            </span>
          </div>

          <h1 className='text-[#0f172a] font-black dark:text-white text-4xl md:text-5xl leading-[1.1] mb-4 tracking-tight'>
            Education : <br />
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary'>
              The Gateway to Success
            </span>
          </h1>

          <p className='text-slate-600 dark:text-slate-300 text-lg font-normal max-w-xl mb-8 leading-relaxed'>
            Paarsh eLearning is a leading institute in Nashik offering industry-focused programming language training with real-time projects and placement support.
          </p>

          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
            <Link
              href='/Course'
              className='py-4 px-10 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 hover:-translate-y-1 transition-all duration-300'>
              Enroll Now
            </Link>
          </div>


          <div className='flex items-center gap-3 mt-10'>
            <div className='flex -space-x-3'>
              {[1, 2, 3].map((i) => (
                <div key={i} className='w-12 h-12 rounded-full border-4 border-white overflow-hidden shadow-sm'>
                  <Image
                    src={getImgPath(`/images/hero/hero-profile-${i}.jpg`)}
                    alt='Learn SEO with practical projects'
                    width={60}
                    height={60}

                  />
                </div>
              ))}
            </div>
            <p className='text-sm font-normal text-grey max-w-56'>
              Need help?<br />
              <Link href='/contact-us' className='text-primary hover:text-blue-700'>
                Contact our experts<br />
              </Link>
              Tell us about your project
            </p>
          </div>
        </div>


        <div
          className="md:col-span-6 col-span-12 relative flex justify-center items-center py-10"
          data-aos='zoom-in'
          data-aos-duration='1200'>

          <div className="relative w-full max-w-[500px] lg:max-w-[600px] group">
            {/* Multiple Layered Background Decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-[60px] animate-float-slow"></div>

            {/* Decorative Grid Pattern (SVG) */}
            <div className="absolute inset-0 opacity-20 dark:opacity-10 z-0 pointer-events-none" style={{ backgroundImage: `radial-gradient(#2F73F2 1px, transparent 1px)`, backgroundSize: '30px 30px' }}></div>

            {/* Main Image with Glassmorphism Frame */}
            <div className="relative z-10 p-2 md:p-3 rounded-[40px] md:rounded-[60px] bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] overflow-hidden animate-float">
              <div className="relative overflow-hidden rounded-[30px] md:rounded-[50px] aspect-[4/3]">
                <Image
                  src={getImgPath('/images/hero/digital-marketing-course.png')}
                  alt='Advanced digital marketing training in Nashik'
                  fill
                  priority
                  quality={100}
                  className="object-cover transform group-hover:scale-110 transition-transform duration-2000"
                />

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/10 opacity-60"></div>
              </div>
            </div>

            {/* Floating Elements / Icons */}
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center text-primary z-20 animate-float-slow border border-primary/10">
              <Icon icon="ic:round-school" className="text-2xl" />
            </div>

            <div className="absolute top-1/4 -right-6 w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center text-secondary z-20 animate-float border border-secondary/10" style={{ animationDelay: '1s' }}>
              <Icon icon="ic:round-menu-book" className="text-2xl" />
            </div>

            <div className="absolute -bottom-8 left-10 w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center text-blue-400 z-20 animate-float-slow border border-blue-400/10" style={{ animationDelay: '2s' }}>
              <Icon icon="ic:round-code" className="text-2xl" />
            </div>

            {/* Enhanced Success Badge */}
            <div className="absolute -bottom-4 -right-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-primary/20 z-20 hidden md:flex items-center gap-4 animate-float hover:scale-105 transition-transform duration-300">
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
            </div>
          </div>
        </div>

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