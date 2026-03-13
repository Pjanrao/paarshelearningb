'use client'
import { useEffect, useState } from "react";
import PreLoader from "@/components/Common/PreLoader";
import AOS from "aos"
import 'aos/dist/aos.css';

const Aoscompo = ({ children }: any) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    AOS.init({
      duration: 800,
      once: false,
    })
  }, [])
  return (
    <div>
      {loading ? <PreLoader /> : children}
    </div>
  )
}

export default Aoscompo
