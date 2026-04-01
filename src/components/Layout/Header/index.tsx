'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { headerData } from '../Header/Navigation/menuData'
import Logo from './Logo'
import HeaderLink from '../Header/Navigation/HeaderLink'
import MobileHeaderLink from '../Header/Navigation/MobileHeaderLink'
import { useSelector, useDispatch } from "react-redux";
import { logout } from '@/redux/authSlice'

const Header: React.FC = () => {
  const pathUrl = usePathname()
  const router = useRouter()
  const dispatch = useDispatch()

  const user = useSelector((state: any) => state.auth.user);

  const [navbarOpen, setNavbarOpen] = useState(false)
  const [sticky, setSticky] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false);

  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    setSticky(window.scrollY >= 80)
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    dispatch(logout());
    router.push("/");
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node) &&
      navbarOpen
    ) {
      setNavbarOpen(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [navbarOpen])

  useEffect(() => {
    if (navbarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [navbarOpen])

  return (
    <header className={`fixed top-0 z-999 w-full transition-all duration-300 ${sticky
        ? 'py-2 bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100'
        : 'py-4 bg-transparent shadow-none'
      }`}>

      <div className='container mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8'>

        <Logo />

        {/* Desktop Menu */}
        <nav className='hidden lg:flex items-center justify-center gap-8 flex-1'>
          {headerData.map((item, index) => (
            <HeaderLink key={index} item={item} />
          ))}
        </nav>

        {/* Right Section */}
        <div className='flex items-center gap-3 relative'>

          {/* ✅ SHOW SIGNIN/SIGNUP FOR ADMIN OR NO USER */}
          {!user || user?.role === "admin" ? (
            <>
              <Link
                href='/signin'
                className='hidden sm:inline-flex px-5 py-2.5 rounded-full text-primary hover:bg-primary/5'>
                Sign In
              </Link>

              <Link
                href='/signup'
                className='hidden sm:inline-flex px-6 py-2.5 rounded-full bg-primary text-white shadow-md'>
                Sign Up
              </Link>
            </>
          ) : (
            user?.role === "student" && (
              <div className="flex items-center gap-3 relative">

                {/* Dashboard */}
                <button
                  onClick={() => router.push("/student")}
                  className="hidden sm:inline-flex px-5 py-2.5 rounded-full bg-primary text-white shadow-md"
                >
                  Dashboard
                </button>

                {/* Profile */}
                <div
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2C4276] to-blue-500 text-white flex items-center justify-center font-semibold shadow-md hover:scale-105 transition cursor-pointer"
                >
                  {user?.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </div>

                {/* Popup */}
                {profileOpen && (
                  <div className="absolute right-2 top-12 w-64 bg-white/95 backdrop-blur-md border border-gray-100 rounded-xl shadow-lg p-4 z-50">

                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2C4276] to-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                        {user?.name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <div className="border-t my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md text-sm font-medium transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setNavbarOpen(!navbarOpen)}
            className='lg:hidden p-2 rounded-xl bg-gray-50'
          >
            ☰
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {navbarOpen && (
        <div className='fixed inset-0 bg-black/60 z-40' onClick={() => setNavbarOpen(false)} />
      )}

      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed top-0 right-0 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ${navbarOpen ? 'translate-x-0' : 'translate-x-full'
          } z-50`}>

        <div className='flex justify-between p-6 border-b'>
          <Logo />
          <button onClick={() => setNavbarOpen(false)}>✕</button>
        </div>

        <nav className='p-6 space-y-3'>
          {headerData.map((item, index) => (
            <MobileHeaderLink key={index} item={item} />
          ))}

          {/* Mobile Auth */}
          <div className='pt-6 flex flex-col gap-3'>
            {!user || user?.role === "admin" ? (
              <>
                <Link href='/signin'>Sign In</Link>
                <Link href='/signup'>Sign Up</Link>
              </>
            ) : (
              user?.role === "student" && (
                <>
                  <button
                    onClick={() => {
                      router.push("/student");
                      setNavbarOpen(false);
                    }}
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={() => {
                      handleLogout();
                      setNavbarOpen(false);
                    }}
                    className="text-red-500"
                  >
                    Logout
                  </button>
                </>
              )
            )}
          </div>

        </nav>
      </div>
    </header>
  )
}

export default Header