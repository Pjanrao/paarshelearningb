"use client";

import { getImgPath } from '@/utils/image';
import Image from 'next/image';
import Link from 'next/link';
import { useSiteImages } from '@/hooks/useSiteImages';

const Logo: React.FC = () => {
  const { getImageUrl } = useSiteImages();

  return (
    <Link href="/">
      <Image
        src={getImageUrl("SITE_LOGO", "/images/logo/logo-wide.webp")}
        alt="Paarsh eLearning digital marketing training institute"
        width={180}
        height={72}
        className="h-10 sm:h-[50px] w-auto dark:hidden"
        priority
      />
      <Image
        src={getImageUrl("SITE_LOGO_DARK", getImgPath("/images/logo/logo-wide.webp"))}
        alt="Paarsh eLearning digital marketing training institute"
        width={180}
        height={72}
        style={{ width: '180px', height: 'auto' }}
        quality={100}
        className='dark:block hidden'
      />
    </Link>
  );
};

export default Logo;
