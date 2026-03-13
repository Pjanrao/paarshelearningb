import React, { FC } from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import { BreadcrumbLink } from '@/types/breadcrumb'

interface HeroSubProps {
  title: string
  description: string
  breadcrumbLinks: BreadcrumbLink[]
}

const HeroSub: FC<HeroSubProps> = ({ title, description, breadcrumbLinks }) => {
  return (
    <>
      <section className='text-start md:py-24 py-5 md:pt-44 pt-36 dark:bg-darkmode ml-0 lg:ml-20 px-4 lg:px-0'>
        <h2 className='dark:text-white md:text-[40px] leading-tight text-3xl md:text-4xl font-bold text-midnight_text tracking-tighter'>
          {title}
        </h2>
        <p className=' md:text-xl text-lg text-grey dark:text-white/50 font-normal w-full max-w-full lg:max-w-45 my-6 lg:my-[1.875rem] text-justify'>
          {description}
        </p>
        {/* <Breadcrumb links={breadcrumbLinks} /> */}
      </section>
    </>
  )
}

export default HeroSub
