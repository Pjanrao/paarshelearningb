import Image from 'next/image'
import { getImgPath } from "@/utils/image";

const PreLoader = () => {
  return (
    <div className="fixed left-0 top-0 z-999999 flex h-screen w-screen items-center justify-center bg-white">
      <div className="relative flex items-center justify-center">
        <div className="h-24 w-24 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        <Image
          src={getImgPath('/favicon.png')}
          alt="logo"
          width={80}
          height={80}
          className="absolute pb-1"
          priority
        />
      </div>
    </div>
  );
};

export default PreLoader;