// import React from 'react'
// import Link from 'next/link'
// import Image from 'next/image'
// import { getImgPath } from '@/utils/image'

// const ContactForm = () => {
//   return (
//     <>
//       <section className='dark:bg-darkmode md:pb-24 pb-16'>
//         <div className='container mx-auto max-w-6xl px-4'>
//           <div className='grid md:grid-cols-12 grid-cols-1 gap-8'>
//             <div className='col-span-6 order-2 md:order-none'>
//               <h2 className='hidden md:block max-w-72 text-[40px] leading-tight font-bold mb-9 text-[#2F73F2] dark:text-white'>
//                 Contact Us
//               </h2>
//               <form className='flex flex-wrap w-full m-auto justify-between'>
//                 <div className='sm:flex gap-3 w-full'>
//                   <div className='mx-0 my-2.5 flex-1'>
//                     <label
//                       htmlFor='first-name'
//                       className='pb-3 inline-block text-base'>
//                       First Name
//                     </label>
//                     <input
//                       className='w-full text-base px-4 rounded-lg py-2.5 border-border dark:border-dark_border border-solid dark:text-white  dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0'
//                       type='text'
//                     />
//                   </div>
//                   <div className='mx-0 my-2.5 flex-1'>
//                     <label
//                       htmlFor='last-name'
//                       className='pb-3 inline-block text-base'>
//                       Last Name
//                     </label>
//                     <input
//                       className='w-full text-base px-4 py-2.5 rounded-lg border-border dark:border-dark_border border-solid dark:text-white  dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0'
//                       type='text'
//                     />
//                   </div>
//                 </div>
//                 <div className='sm:flex gap-3 w-full'>
//                   <div className='mx-0 my-2.5 flex-1'>
//                     <label
//                       htmlFor='email'
//                       className='pb-3 inline-block text-base'>
//                       Email address
//                     </label>
//                     <input
//                       type='email'
//                       className='w-full text-base px-4 py-2.5 rounded-lg border-border dark:border-dark_border border-solid dark:text-white  dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0'
//                     />
//                   </div>
//                   <div className='mx-0 my-2.5 flex-1'>
//                     <label
//                       htmlFor='number'
//                       className='pb-3 inline-block text-base'>
//                       Mobile Number
//                       <input
//                         type='number'
//                         className='w-full text-base px-4 py-2.5 rounded-lg border-border dark:border-dark_border border-solid dark:text-white  dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0 mt-3'
//                       />
//                     </label>
//                     {/* <select className='w-full text-base px-4 py-2.5 rounded-lg border-border dark:text-white border-solid dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary dark:border-dark_border focus:border-solid focus:outline-0'>
//                       <option value=''>Choose a specialist</option>
//                       <option value='Baking &amp; Pastry'>
//                         Choose a specialist
//                       </option>
//                       <option value='Exotic Cuisine'>Exotic Cuisine</option>
//                       <option value='French Desserts'>French Desserts</option>
//                       <option value='Seafood &amp; Wine'>
//                         Choose a specialist
//                       </option>
//                     </select> */}
//                   </div>
//                 </div>
//                 <div className='sm:flex gap-3 w-full'>
//                   <div className='mx-0 my-2.5 flex-1'>
//                     <label
//                       htmlFor='text'
//                       className='pb-3 inline-block text-base'>
//                       Subject
//                     </label>
//                     <input
//                       className='w-full text-base px-4 rounded-lg  py-2.5 outline-hidden dark:text-white dark:bg-darkmode border-border border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary dark:border-dark_border focus:border-solid focus:outline-0'
//                       type='text'
//                     />
//                   </div>
//                   <div className='mx-0 my-2.5 flex-1'>
//                     <label
//                       htmlFor='text'
//                       className='pb-3 inline-block text-base'>
//                       Message
//                     </label>
//                     <textarea
//                       className='w-full text-base px-4 rounded-lg py-2.5 border-border outline-hidden dark:text-white dark:bg-darkmode border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary dark:border-dark_border focus:border-solid focus:outline-0'

//                       typeof=' text'
//                     />
//                   </div>
//                 </div>
//                 <div className='mx-0 my-2.5 w-full'>
//                   <Link
//                     href='#'
//                     className='bg-primary rounded-full text-white py-4 px-8 mt-4 inline-block hover:bg-blue-700'
//                     type='submit'>
//                     Send
//                   </Link>
//                 </div>
//               </form>
//             </div>
//             <div className='col-span-6 order-1 md:order-none'>
//               <Image
//                 src={getImgPath('/images/contact-page/contact.png')}
//                 alt='Contact'
//                 width={400}
//                 height={620}
//                 quality={100}
//                 className='bg-no-repeat bg-contain w-full max-w-[400px] h-auto mx-auto md:ml-[100px] -mt-[50px] md:w-[400px] md:h-[600px]'
//               />
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   )
// }

// export default ContactForm



"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import { getImgPath } from '@/utils/image'
import toast, { Toaster } from 'react-hot-toast'
import { validateEmail, validatePhone } from '@/utils/validation'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          message: `Subject: ${formData.subject} | Message: ${formData.message}`,
          type: "Contact Form"
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Message sent successfully!");
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        toast.error(result.error || "Failed to send message.");
      }
    } catch (error) {
      console.error("Contact Form error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className='dark:bg-darkmode md:pb-24 pb-16'>
        <div className='container mx-auto max-w-6xl px-4'>
          <div className='grid md:grid-cols-12 grid-cols-1 gap-8'>
            <div className='col-span-6 order-2 md:order-none'>
              <h2 className='hidden md:block max-w-72 text-[40px] leading-tight font-bold mb-9 text-[#2F73F2] dark:text-white'>
                Contact Us
              </h2>
              <form onSubmit={handleSubmit} className='flex flex-wrap w-full m-auto justify-between'>
                <div className='sm:flex gap-3 w-full'>
                  <div className='mx-0 my-2.5 flex-1'>
                    <label
                      htmlFor='firstName'
                      className='pb-3 inline-block text-base'>
                      First Name
                    </label>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className='w-full text-base px-4 rounded-lg py-2.5 border-border dark:border-dark_border border-solid dark:text-white  dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0'
                      type='text'
                    />
                  </div>
                  <div className='mx-0 my-2.5 flex-1'>
                    <label
                      htmlFor='lastName'
                      className='pb-3 inline-block text-base'>
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className='w-full text-base px-4 py-2.5 rounded-lg border-border dark:border-dark_border border-solid dark:text-white  dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0'
                      type='text'
                    />
                  </div>
                </div>
                <div className='sm:flex gap-3 w-full'>
                  <div className='mx-0 my-2.5 flex-1'>
                    <label
                      htmlFor='email'
                      className='pb-3 inline-block text-base'>
                      Email address
                    </label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      type='email'
                      className='w-full text-base px-4 py-2.5 rounded-lg border-border dark:border-dark_border border-solid dark:text-white  dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0'
                    />
                  </div>
                  <div className='mx-0 my-2.5 flex-1'>
                    <label
                      htmlFor='phone'
                      className='pb-3 inline-block text-base'>
                      Mobile Number
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      type='tel'
                      className='w-full text-base px-4 py-2.5 rounded-lg border-border dark:border-dark_border border-solid dark:text-white  dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0'
                    />
                  </div>
                </div>
                <div className='sm:flex gap-3 w-full'>
                  <div className='mx-0 my-2.5 flex-1'>
                    <label
                      htmlFor='subject'
                      className='pb-3 inline-block text-base'>
                      Subject
                    </label>
                    <input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className='w-full text-base px-4 rounded-lg  py-2.5 outline-hidden dark:text-white dark:bg-darkmode border-border border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary dark:border-dark_border focus:border-solid focus:outline-0'
                      type='text'
                    />
                  </div>
                  <div className='mx-0 my-2.5 flex-1'>
                    <label
                      htmlFor='message'
                      className='pb-3 inline-block text-base'>
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className='w-full text-base px-4 rounded-lg py-2.5 border-border outline-hidden dark:text-white dark:bg-darkmode border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary dark:border-dark_border focus:border-solid focus:outline-0'
                    />
                  </div>
                </div>
                <div className='mx-0 my-2.5 w-full'>
                  <button
                    disabled={isSubmitting}
                    className='bg-primary rounded-full text-white py-4 px-12 mt-4 inline-block hover:bg-blue-700 font-bold disabled:opacity-50 transition-all'
                    type='submit'>
                    {isSubmitting ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            </div>
            <div className='col-span-6 order-1 md:order-none'>
              <Image
                src={getImgPath('/images/contact-page/contact.png')}
                alt='Contact'
                width={400}
                height={620}
                quality={100}
                className='bg-no-repeat bg-contain w-full max-w-[400px] h-auto mx-auto md:ml-[100px] -mt-[50px] md:w-[400px] md:h-[600px]'
              />
            </div>
          </div>
        </div>
      </section>
      <Toaster position="bottom-right" />
    </>
  )
}

export default ContactForm