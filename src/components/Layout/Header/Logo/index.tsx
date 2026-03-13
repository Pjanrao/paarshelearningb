import { getImgPath } from '@/utils/image';
import Image from 'next/image';
import Link from 'next/link';

const Logo: React.FC = () => {

  return (
    <Link href="/">
      <Image
        src={getImgPath("/images/logo/logo-wide.webp")}
        alt="logo"
        width={180}
        height={72}
        style={{ width: '180px', height: 'auto' }}
        quality={100}
        className='dark:hidden'
      />
      <Image
        src={getImgPath("/images/logo/logo-wide.webp")}
        alt="logo"
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
