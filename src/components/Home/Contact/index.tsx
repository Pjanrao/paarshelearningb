// import React from 'react'
// import Image from 'next/image'
// import { getImgPath } from '@/utils/image'

// const Contactform = () => {
//   return (
//     <section className='overflow-x-hidden bg-darkmode dark:bg-darklight'>
//       <div className='container mx-auto max-w-6xl px-4'>
//         <div className='grid md:grid-cols-12 grid-cols-1 md:gap-7 gap-0'>
//           <div
//             className='row-start-1 col-start-1 row-end-2 md:col-end-7 col-end-12'
//             data-aos='fade-left'
//             data-aos-delay='200'
//             data-aos-duration='1000'>
//             <div className='flex gap-2 items-center justify-start'>
//               <span className='w-3 h-3 rounded-full bg-success'></span>
//               <span className='font-medium text-sm text-white'>
//                 build everything
//               </span>
//             </div>
//             <h2 className='sm:text-4xl text-[28px] leading-tight font-bold text-white py-12'>
//               Let’s discuss about your project and take it the next level.
//             </h2>
//             <div className='grid grid-cols-6 pb-12 border-b border-dark_border '>
//               <div className='col-span-3'>
//                 <span className='text-white/50 text-lg'>Phone</span>
//                 <p className='bg-transparent border-0 text-white text-lg'>
//                   +323-25-8964
//                 </p>
//               </div>
//               <div className='col-span-3'>
//                 <span className='text-white/50 text-lg'>Email</span>
//                 <p className='bg-transparent border-0 text-white text-lg'>
//                   me@landingpro.com
//                 </p>
//               </div>
//               <div className='col-span-6 pt-8'>
//                 <span className='text-white/50 text-lg'>Location</span>
//                 <p className='bg-transparent border-0 text-white text-lg'>
//                   Mark Avenue, Dalls Road, New York
//                 </p>
//               </div>
//             </div>
//             <div className='pt-12'>
//               <p className='text-white/50 pb-4 text-base'>Trusted by</p>
//               <div className='flex items-center flex-wrap md:gap-14 gap-7'>
//                 <Image
//                   src={getImgPath('/images/contact/contact1.png')}
//                   alt='Google-pay'
//                   width={100}
//                   height={20}
//                   style={{ width: 'auto', height: 'auto' }}
//                   quality={100}
//                   className='w_f max-w-28 w-full h-5'/>
//                 <Image
//                   src={getImgPath('/images/contact/play-juction.png')}
//                   alt='play-juction'
//                   width={100}
//                   height={20}
//                   style={{ width: 'auto', height: 'auto' }}
//                   quality={100}
//                   className='w_f max-w-24 w-full h-6'/>
//                 <Image
//                   src={getImgPath('/images/contact/stripe.png')}
//                   alt='stripe'
//                   width={100}
//                   height={20}
//                   style={{ width: 'auto', height: 'auto' }}
//                   quality={100}
//                   className='w_f max-w-14 w-full h-6'/>
//                 <Image
//                   src={getImgPath('/images/contact/wise.png')}
//                   alt='wise'
//                   width={100}
//                   height={20}
//                   style={{ width: 'auto', height: 'auto' }}
//                   quality={100}
//                   className='w_f max-w-16 w-full h-4'/>
//               </div>
//             </div>
//           </div>
//           <div
//             data-aos='fade-right'
//             data-aos-delay='200'
//             data-aos-duration='1000'
//             className="relative before:content-[''] before:absolute before:bg-[url('/images/contact/form-line.png')] before:bg-no-repeat before:w-[13rem] before:h-24 before:top-5% before:bg-contain before:left-[35%] before:z-1 before:translate-x-full lg:before:inline-block before:hidden after:content-[''] after:absolute after:bg-[url('/images/contact/from-round-line.png')] after:bg-no-repeat after:w-[6.3125rem] after:h-[6.3125rem] after:bg-contain after:top-1/2 after:-left-[25%] after:z-1 after:translate-x-1/2 after:translate-y-1/2 md:after:inline-block after:hidden md:row-start-1 row-start-2 md:col-start-8 col-start-1 row-end-2 col-end-13">
//             <div className='lg:mt-0 mt-8  bg-white dark:bg-darkmode max-w-[50rem] m-auto pt-[2.1875rem] pb-8 px-[2.375rem] rounded-md relative z-10'>
//               <h2 className='sm:text-3xl text-lg font-bold text-midnight_text mb-3 dark:text-white'>
//                 Start the project
//               </h2>
//               <form className='flex w-full m-auto justify-between flex-wrap gap-4'>
//                 <div className='flex gap-4'>
//                   <input
//                     className='text-midnight_text w-full text-base transition-[0.5s] bg-transparent dark:border-dark_border dark:text-white px-[0.9375rem] py-[0.830rem] border border-border border-solid focus:border-primary dark:focus:border-primary placeholder:text-grey rounded-lg focus-visible:outline-0'
//                     type='text'
//                     placeholder='First name'/>
//                   <input
//                     type='text'
//                     className='text-midnight_text w-full text-base transition-[0.5s] bg-transparent dark:border-dark_border dark:text-white px-[0.9375rem] py-[0.830rem] border border-border border-solid focus:border-primary dark:focus:border-primary placeholder:text-grey rounded-lg focus-visible:outline-0'
//                     placeholder='Last name'/>
//                 </div>
//                 <div className='w-full'>
//                   <input
//                     type='email'
//                     className='text-midnight_text w-full text-base transition-[0.5s] bg-transparent dark:border-dark_border dark:text-white px-[0.9375rem] py-[0.830rem] border border-border border-solid focus:border-primary dark:focus:border-primary placeholder:text-grey rounded-lg focus-visible:outline-0'
//                     placeholder='youremail@website.com'/>
//                 </div>
//                 <div className='w-full'>
//                   <input
//                     className='text-midnight_text w-full text-base transition-[0.5s] bg-transparent dark:border-dark_border dark:text-white px-[0.9375rem] py-[0.830rem] border border-border border-solid focus:border-primary dark:focus:border-primary placeholder:text-grey rounded-lg focus-visible:outline-0'
//                     type='text'
//                     placeholder='Country'/>
//                 </div>
//                 <div className='w-full'>
//                   <textarea
//                     className='text-midnight_text h-[9.375rem] w-full text-base transition-[0.5s] bg-transparent dark:border-dark_border dark:text-white px-[0.9375rem] py-[0.830rem] border! border-border border-solid! focus:border-primary dark:focus:border-primary placeholder:text-grey rounded-lg focus-visible:outline-0'
//                     placeholder='Let us know about your project'></textarea>
//                 </div>
//                 <div className='flex'>
//                   <input
//                     id='wp-comment-cookies-consent'
//                     name='wp-comment-cookies-consent'
//                     type='checkbox'
//                     value='yes'
//                     className="hover:opacity-1 checked:bg-primary checked:opacity-1 relative border-2 border-solid border-primary rounded-xs bg-none cursor-pointer leading-none mr-2 outline-0 p-0! align-text-top h-[1.25rem] sm:w-[1.25rem] w-[2.25rem] opacity-[0.5] before:content-[''] before:absolute before:right-1/2 before:top-1/2 before:w-1 before:h-2 before:z-2 before:-mt-[0.0625rem] before:-ml-[0.0625rem] before:-mr-[0.0625rem] before:transform before:rotate-45 before:translate-x-[-50%] before:translate-y-[-50%] dark:focus:border-primary"
//                   />
//                   <div className='text-grey dark:text-white/50'>
//                     I have read and acknowledge the{' '}
//                     <p className='text-primary inline cursor-pointer'>
//                       Terms and Conditions{' '}
//                     </p>
//                   </div>
//                 </div>  
//                 <div className='w-full'>
//                   <button
//                     className='w-full bg-primary hover:bg-blue-700 text-white py-3 rounded-lg'
//                     type='submit'>
//                     Submit Inquiry
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Contactform


"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import { getImgPath } from '@/utils/image'
import toast, { Toaster } from 'react-hot-toast'
import { validateEmail, validatePhone } from '@/utils/validation'

const Contactform = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<any>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      return;
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          country: formData.country,
          type: "Contact Form"
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Inquiry submitted successfully!");
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          country: '',
          message: ''
        });
      } else {
        toast.error(result.error || "Failed to submit inquiry.");
      }
    } catch (error) {
      console.error("Home contact error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className='overflow-x-hidden bg-darkmode dark:bg-darklight'>
      <div className='container mx-auto max-w-6xl px-4'>
        <div className='grid md:grid-cols-12 grid-cols-1 md:gap-7 gap-0'>
          <div
            className='row-start-1 col-start-1 row-end-2 md:col-end-7 col-end-12'
            data-aos='fade-left'
            data-aos-delay='200'
            data-aos-duration='1000'>
            <div className='flex gap-2 items-center justify-start'>
              <span className='w-3 h-3 rounded-full bg-success'></span>
              <span className='font-medium text-sm text-white'>
                Build Everything
              </span>
            </div>
            <h2 className='sm:text-4xl text-[28px] leading-tight font-bold text-white py-12'>
              Let’s discuss about your project and take it to the next level.
            </h2>
            <div className='grid grid-cols-6 pb-12 border-b border-dark_border '>
              <div className='col-span-3'>
                <span className='text-white/50 text-lg'>Phone</span>
                <p className='bg-transparent border-0 text-white text-lg'>
                  {settings?.contactDetails?.phone || "+91 90752 01033"}
                </p>
              </div>
              <div className='col-span-3'>
                <span className='text-white/50 text-lg'>Email</span>
                <p className='bg-transparent border-0 text-white text-lg'>
                  {settings?.contactDetails?.email || "paarshelearning@gmail.com"}
                </p>
              </div>
              <div className='col-span-6 pt-8'>
                <span className='text-white/50 text-lg'>Location</span>
                <p className='bg-transparent border-0 text-white text-lg'>
                  Pune & Nashik, Maharashtra
                </p>
              </div>
            </div>
            <div className='pt-12'>
              <p className='text-white/50 pb-4 text-base'>Trusted by</p>
              <div className='flex items-center flex-wrap md:gap-14 gap-7'>
                <Image
                  src={getImgPath('/images/contact/contact1.png')}
                  alt='Google-pay'
                  width={100}
                  height={20}
                  style={{ width: 'auto', height: 'auto' }}
                  quality={100}
                  className='w_f max-w-28 w-full h-5' />
                <Image
                  src={getImgPath('/images/contact/play-juction.png')}
                  alt='play-juction'
                  width={100}
                  height={20}
                  style={{ width: 'auto', height: 'auto' }}
                  quality={100}
                  className='w_f max-w-24 w-full h-6' />
                <Image
                  src={getImgPath('/images/contact/stripe.png')}
                  alt='stripe'
                  width={100}
                  height={20}
                  style={{ width: 'auto', height: 'auto' }}
                  quality={100}
                  className='w_f max-w-14 w-full h-6' />
                <Image
                  src={getImgPath('/images/contact/wise.png')}
                  alt='wise'
                  width={100}
                  height={20}
                  style={{ width: 'auto', height: 'auto' }}
                  quality={100}
                  className='w_f max-w-16 w-full h-4' />
              </div>
            </div>
          </div>
          <div
            data-aos='fade-right'
            data-aos-delay='200'
            data-aos-duration='1000'
            className="relative before:content-[''] before:absolute before:bg-[url('/images/contact/form-line.png')] before:bg-no-repeat before:w-[13rem] before:h-24 before:top-5% before:bg-contain before:left-[35%] before:z-1 before:translate-x-full lg:before:inline-block before:hidden after:content-[''] after:absolute after:bg-[url('/images/contact/from-round-line.png')] after:bg-no-repeat after:w-[6.3125rem] after:h-[6.3125rem] after:bg-contain after:top-1/2 after:-left-[25%] after:z-1 after:translate-x-1/2 after:translate-y-1/2 md:after:inline-block after:hidden md:row-start-1 row-start-2 md:col-start-8 col-start-1 row-end-2 col-end-13">
            <div className='lg:mt-0 mt-8  bg-white dark:bg-darkmode max-w-[50rem] m-auto pt-[2.1875rem] pb-8 px-[2.375rem] rounded-md relative z-10'>
              <h2 className='sm:text-3xl text-lg font-bold text-midnight_text mb-3 dark:text-white'>
                Start the project
              </h2>
              <form onSubmit={handleSubmit} className='flex w-full m-auto justify-between flex-wrap gap-4'>
                <div className='flex gap-4 w-full'>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className='text-midnight_text w-full text-base transition-[0.5s] bg-transparent dark:border-dark_border dark:text-white px-[0.9375rem] py-[0.830rem] border border-border border-solid focus:border-primary dark:focus:border-primary placeholder:text-grey rounded-lg focus-visible:outline-0'
                    type='text'
                    placeholder='First name' />
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    type='text'
                    className='text-midnight_text w-full text-base transition-[0.5s] bg-transparent dark:border-dark_border dark:text-white px-[0.9375rem] py-[0.830rem] border border-border border-solid focus:border-primary dark:focus:border-primary placeholder:text-grey rounded-lg focus-visible:outline-0'
                    placeholder='Last name' />
                </div>
                <div className='flex gap-4 w-full'>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    type='email'
                    className='text-midnight_text w-[60%] text-base transition-[0.5s] bg-transparent dark:border-dark_border dark:text-white px-[0.9375rem] py-[0.830rem] border border-border border-solid focus:border-primary dark:focus:border-primary placeholder:text-grey rounded-lg focus-visible:outline-0'
                    placeholder='Email address' />
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    type='tel'
                    className='text-midnight_text w-[40%] text-base transition-[0.5s] bg-transparent dark:border-dark_border dark:text-white px-[0.9375rem] py-[0.830rem] border border-border border-solid focus:border-primary dark:focus:border-primary placeholder:text-grey rounded-lg focus-visible:outline-0'
                    placeholder='Phone Number' />
                </div>
                <div className='w-full'>
                  <input
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className='text-midnight_text w-full text-base transition-[0.5s] bg-transparent dark:border-dark_border dark:text-white px-[0.9375rem] py-[0.830rem] border border-border border-solid focus:border-primary dark:focus:border-primary placeholder:text-grey rounded-lg focus-visible:outline-0'
                    type='text'
                    placeholder='Country' />
                </div>
                <div className='w-full'>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className='text-midnight_text h-[9.375rem] w-full text-base transition-[0.5s] bg-transparent dark:border-dark_border dark:text-white px-[0.9375rem] py-[0.830rem] border! border-border border-solid! focus:border-primary dark:focus:border-primary placeholder:text-grey rounded-lg focus-visible:outline-0'
                    placeholder='Let us know about your project'></textarea>
                </div>
                <div className='flex'>
                  <input
                    id='wp-comment-cookies-consent'
                    name='wp-comment-cookies-consent'
                    type='checkbox'
                    required
                    className="hover:opacity-1 checked:bg-primary checked:opacity-1 relative border-2 border-solid border-primary rounded-xs bg-none cursor-pointer leading-none mr-2 outline-0 p-0! align-text-top h-[1.25rem] sm:w-[1.25rem] w-[2.25rem] opacity-[0.5] before:content-[''] before:absolute before:right-1/2 before:top-1/2 before:w-1 before:h-2 before:z-2 before:-mt-[0.0625rem] before:-ml-[0.0625rem] before:-mr-[0.0625rem] before:transform before:rotate-45 before:translate-x-[-50%] before:translate-y-[-50%] dark:focus:border-primary"
                  />
                  <div className='text-grey dark:text-white/50 text-sm'>
                    I have read and acknowledge the{' '}
                    <span className='text-primary inline cursor-pointer'>
                      Terms and Conditions{' '}
                    </span>
                  </div>
                </div>
                <div className='w-full'>
                  <button
                    disabled={isSubmitting}
                    className='w-full bg-primary hover:bg-blue-700 text-white py-3 rounded-lg font-bold disabled:opacity-50'
                    type='submit'>
                    {isSubmitting ? "Sending..." : "Get Free Consultation"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </section>
  )
}

export default Contactform