// import React from 'react'
// import Link from 'next/link'

// const Location = () => {
//   const breadcrumbLinks = [
//     { href: '/', text: 'Home' },
//     { href: '/contact', text: 'Contact' },
//   ]
//   return (
//     <>
//       <section>
//         <div className='container mx-auto max-w-4xl px-4 h-full w-50 bg-white/50 dark:bg-dark_border p-5 rounded-md shadow shadow-gray-300 dark:shadow-black/20 shadow-lg'>
//           <div>
//             <div className='grid md:grid-cols-6 lg:grid-cols-9 grid-cols-1 gap-10'>
//               <div className='col-span-3'>
//                 <h2 className='text-black max-w-66 text-[30px] leading-tight font-bold'>
//                   Nashik Office
//                 </h2>
//                 <hr className="mb-5 border-gray-500" />
//                 <p className='sm:text-xl text-xl text-gray-500 font-normal max-w-64 leading-7 pt-5'>
//                   Office no 1, Bhakti Apartment,
//                   Near Rasoi Hotel, Suchita Nagar,
//                   Mumbai Naka,
//                   Nashik 422001
//                 </p>

//               </div>
//             </div>

//             <div>
//               <Link
//                 href='tel:731-621-5503'
//                 className='sm:text-xl text-xl text-gray-500 items-center gap-2 hover:text-opacity-100 w-fit'>
//                 <p className='text-black font-bold'>Email</p>
//                 info@paarshelearning.com
//               </Link>
//               <Link
//                 href='tel:731-621-5503'
//                 className='sm:text-xl text-xl text-gray-500 items-center gap-2 hover:text-opacity-100 w-fit'>
//                 <p className='text-black font-bold pt-5'>Call</p>
//                 +91 90752 01035
//               </Link>
//             </div>
//             {/* <div className='grid md:grid-cols-6 lg:grid-cols-9 grid-cols-1 gap-7 pt-12'>
//               <div className='col-span-3'>
//                 <h2 className='text-white max-w-52 text-[40px] leading-tight font-bold'>
//                   Bengaluru Office
//                 </h2>
//               </div>
//               <div className='col-span-3'>
//                 <p className='sm:text-2xl text-xl text-white/50 font-normal max-w-64 leading-7'>
//                   3502 Marcus Street Geraldine Zip code 35974
//                 </p>
//               </div>
//               <div className='col-span-3'>
//                 <Link
//                   href='mailto:Office@venus.com'
//                   className='sm:text-2xl text-xl text-white font-medium underline'>
//                   Office@venus.com
//                 </Link>
//                 <Link
//                   href='tel:731-235-7993'
//                   className='sm:text-2xl text-white/80 text-xl text-IceBlue flex items-center gap-2 hover:text-opacity-100 w-fit'>
//                   <span className='text-white/40!'>Call</span>
//                   731-235-7993
//                 </Link>
import { Mail, Phone, MapPin } from "lucide-react";

export default function Location() {
  return (
    <div className="max-w-7xl mx-auto px-4 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Nashik Office Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 shrink-0">
              <MapPin className="text-blue-600" size={20} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Nashik Office
            </h3>
          </div>

          <hr className="mb-5 border-gray-200" />

          <div className="flex flex-col xl:grid xl:grid-cols-[1fr_auto_1fr] gap-6 items-start">
            <div className="text-gray-600 leading-relaxed text-md text-justify">
              Office no 1, Bhakti Apartment, Near Rasoi Hotel, Suchita Nagar,
              Mumbai Naka, Nashik 422001
            </div>

            <div className="hidden xl:block w-px bg-blue-400 h-full mx-auto" />
            <hr className="xl:hidden border-blue-200 w-full" />

            <div className="space-y-4 w-full">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Mail className="text-blue-600" size={18} />
                </div>
                <div className="overflow-hidden">
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-600 text-md break-all">
                    info@paarshelearning.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Phone className="text-blue-600" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Call</p>
                  <p className="text-gray-600 text-md">
                    +91 90752 01035
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pune Office Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 shrink-0">
              <MapPin className="text-blue-600" size={20} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Pune Office
            </h3>
          </div>

          <hr className="mb-5 border-gray-200" />

          <div className="flex flex-col xl:grid xl:grid-cols-[1fr_auto_1fr] gap-6 items-start">
            <div className="text-gray-600 leading-relaxed text-md text-justify">
              Second Floor, Wisteriaa Fortune, C-206-207, Bhumkar Das Gugre Rd, near Bhumkar Chowk, Wakad, Pune, Maharashtra 411057
            </div>

            <div className="hidden xl:block w-px bg-blue-400 h-full mx-auto" />
            <hr className="xl:hidden border-blue-200 w-full" />

            <div className="space-y-4 w-full">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Mail className="text-blue-600" size={18} />
                </div>
                <div className="overflow-hidden">
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-600 text-md break-all">
                    info@paarshelearning.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Phone className="text-blue-600" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Call</p>
                  <p className="text-gray-600 text-md">
                    +91 90752 01035
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
