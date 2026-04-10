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
  const router = useRouter()
  const dispatch = useDispatch()

  const reduxUser = useSelector((state: any) => state.auth.user);

  const user =
    reduxUser ||
    (typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null);

  const role =
    user?.role ||
    (typeof window !== "undefined"
      ? localStorage.getItem("role")
      : null);


  // const role = user?.role;

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
    window.location.href = "/";
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
    <>
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

          {role ? (
            <div className="flex items-center gap-3 relative">
              {role === "student" && (
                <button
                  onClick={() => router.push("/student")}
                  className="flex px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-primary text-white shadow-md text-sm sm:text-base transition hover:bg-primary/90"
                >
                  Dashboard
                </button>
              )}

              {role !== "admin" && (
                <>
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

                  {profileOpen && (
                    <div className="absolute right-2 top-12 w-64 bg-white shadow-xl dark:bg-gray-800 border dark:border-gray-700 p-4 rounded-xl z-50 animate-in fade-in slide-in-from-top-2">
                      <p className="font-bold text-gray-900 dark:text-white truncate">{user?.name || "User"}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email || ""}</p>
                      <div className="my-3 border-t dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition shadow-md active:scale-95"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                href='/signin'
                className='hidden sm:inline-flex px-5 py-2.5 rounded-full text-primary hover:bg-primary/5 font-semibold'>
                Sign In
              </Link>

              <Link
                href='/signup'
                className='hidden sm:inline-flex px-6 py-2.5 rounded-full bg-primary text-white shadow-md font-semibold hover:bg-primary/90 active:scale-95 transition-all'>
                Sign Up
              </Link>
            </>
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
    </header>

      {/* Mobile Menu */}
      {navbarOpen && (
        <div className='fixed inset-0 bg-black/60 z-[1000] backdrop-blur-sm' onClick={() => setNavbarOpen(false)} />
      )}

      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed top-0 right-0 h-full w-[300px] bg-white dark:bg-[#1a1c23] shadow-[-10px_0_30px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out ${navbarOpen ? 'translate-x-0' : 'translate-x-full'
          } z-[1001] flex flex-col`}>

        <div className='flex items-center justify-between p-6 border-b dark:border-gray-800'>
          <Logo />
          <button
            onClick={() => setNavbarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            ✕
          </button>
        </div>

        <nav className='flex-1 overflow-y-auto p-6 space-y-2'>
          {headerData.map((item, index) => (
            <MobileHeaderLink key={index} item={item} />
          ))}

          <div className='pt-8 mt-4 border-t dark:border-gray-800 flex flex-col gap-4'>
            {role ? (
              <>
                {role === "student" && (
                  <button
                    onClick={() => {
                      router.push("/student");
                      setNavbarOpen(false);
                    }}
                    className="w-full flex items-center justify-center font-bold px-6 py-3 rounded-xl bg-primary text-white shadow-lg transition-all active:scale-95"
                  >
                    Dashboard
                  </button>
                )}

                {role !== "admin" && (
                  <button
                    onClick={() => {
                      handleLogout();
                      setNavbarOpen(false);
                    }}
                    className="w-full flex items-center justify-center font-bold px-6 py-3 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/5 transition-all"
                  >
                    Logout
                  </button>
                )}
              </>
            ) : (
              <>
                <Link
                  href='/signin'
                  onClick={() => setNavbarOpen(false)}
                  className='w-full flex items-center justify-center font-bold px-6 py-3 rounded-xl border border-primary text-primary hover:bg-primary/5 transition-all'>
                  Sign In
                </Link>
                <Link
                  href='/signup'
                  onClick={() => setNavbarOpen(false)}
                  className='w-full flex items-center justify-center font-bold px-6 py-3 rounded-xl bg-primary text-white shadow-lg hover:shadow-xl transition-all active:scale-95'>
                  Sign Up
                </Link>
              </>
            )}
          </div>

        </nav>
      </div>
    </>
  )
}

export default Header


// 'use client'
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import { useEffect, useRef, useState } from 'react'
// import { headerData } from '../Header/Navigation/menuData'
// import Logo from './Logo'
// import HeaderLink from '../Header/Navigation/HeaderLink'
// import MobileHeaderLink from '../Header/Navigation/MobileHeaderLink'
// // import { useTheme } from 'next-themes'
// import { Icon } from '@iconify/react/dist/iconify.js'

// const Header: React.FC = () => {
//   const pathUrl = usePathname()
//   // const { theme, setTheme } = useTheme()

//   const [navbarOpen, setNavbarOpen] = useState(false)
//   const [sticky, setSticky] = useState(false)

//   const navbarRef = useRef<HTMLDivElement>(null)
//   const mobileMenuRef = useRef<HTMLDivElement>(null)

//   const handleScroll = () => {
//     setSticky(window.scrollY >= 80)
//   }

//   const handleClickOutside = (event: MouseEvent) => {
//     if (
//       mobileMenuRef.current &&
//       !mobileMenuRef.current.contains(event.target as Node) &&
//       navbarOpen
//     ) {
//       setNavbarOpen(false)
//     }
//   }

//   useEffect(() => {
//     window.addEventListener('scroll', handleScroll)
//     document.addEventListener('mousedown', handleClickOutside)
//     return () => {
//       window.removeEventListener('scroll', handleScroll)
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [navbarOpen])

//   const path = usePathname()

//   useEffect(() => {
//     if (navbarOpen) {
//       document.body.style.overflow = 'hidden'
//     } else {
//       document.body.style.overflow = ''
//     }
//   }, [navbarOpen])

//   return (
//     <header
//       className={`fixed top-0 z-999 w-full transition-all duration-300 ${sticky
//         ? 'py-2 bg-white/80 dark:bg-darkmode/80 backdrop-blur-md shadow-lg border-b border-gray-100 dark:border-white/10'
//         : 'py-4 bg-transparent shadow-none'
//         }`}>
//       <div className='container mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8'>
//         <div className="flex-shrink-0">
//           <Logo />
//         </div>

//         <nav className='hidden lg:flex items-center justify-center gap-8 flex-1'>
//           {headerData.map((item, index) => (
//             <HeaderLink key={index} item={item} />
//           ))}
//         </nav>

//         <div className='flex items-center gap-3'>
//           <Link
//             href='/signin'
//             className='hidden sm:inline-flex items-center justify-center font-semibold text-sm transition-all duration-200 px-5 py-2.5 rounded-full text-primary hover:bg-primary/5'>
//             Sign In
//           </Link>
//           <Link
//             href='/signup'
//             className='hidden sm:inline-flex items-center justify-center font-semibold text-sm transition-all duration-200 px-6 py-2.5 rounded-full bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg active:scale-95'>
//             Sign Up
//           </Link>
//           <button
//             onClick={() => setNavbarOpen(!navbarOpen)}
//             className='lg:hidden relative z-50 p-2 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors'
//             aria-label='Toggle mobile menu'>
//             <div className="w-6 h-5 flex flex-col justify-between items-center transition-all duration-300">
//               <span className={`block w-6 h-0.5 bg-midnight_text dark:bg-white transform transition-transform duration-300 ${navbarOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
//               <span className={`block w-6 h-0.5 bg-midnight_text dark:bg-white transition-opacity duration-300 ${navbarOpen ? 'opacity-0' : ''}`}></span>
//               <span className={`block w-6 h-0.5 bg-midnight_text dark:bg-white transform transition-transform duration-300 ${navbarOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
//             </div>
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu Backdrop */}
//       {navbarOpen && (
//         <div
//           className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity'
//           onClick={() => setNavbarOpen(false)}
//         />
//       )}

//       {/* Mobile Menu Sidebar */}
//       <div
//         ref={mobileMenuRef}
//         className={`lg:hidden fixed top-0 right-0 h-full w-[300px] bg-white dark:bg-darkmode shadow-2xl transform transition-transform duration-300 ease-in-out ${navbarOpen ? 'translate-x-0' : 'translate-x-full'
//           } z-50 flex flex-col`}>
//         <div className='flex items-center justify-between p-6 border-b dark:border-white/10'>
//           <Logo />
//           <button
//             onClick={() => setNavbarOpen(false)}
//             aria-label='Close mobile menu'
//             className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
//             <Icon icon="ic:round-close" className='text-2xl text-midnight_text dark:text-white' />
//           </button>
//         </div>
//         <nav className='flex-1 overflow-y-auto p-6 space-y-2'>
//           {headerData.map((item, index) => (
//             <MobileHeaderLink key={index} item={item} />
//           ))}
//           <div className='pt-8 flex flex-col gap-3'>
//             <Link
//               href='/signin'
//               className='w-full flex items-center justify-center font-bold px-6 py-3 rounded-xl border border-primary text-primary hover:bg-primary/5 transition-all'
//               onClick={() => setNavbarOpen(false)}>
//               Sign In
//             </Link>
//             <Link
//               href='/signup'
//               className='w-full flex items-center justify-center font-bold px-6 py-3 rounded-xl bg-primary text-white shadow-lg hover:shadow-xl transition-all active:scale-95'
//               onClick={() => setNavbarOpen(false)}>
//               Sign Up
//             </Link>
//           </div>
//         </nav>
//       </div>
//     </header>
//   )
// }

// export default Header
// 'use client'


// 'use client'
// import Link from 'next/link'
// import { usePathname, useRouter } from 'next/navigation'
// import { useEffect, useRef, useState } from 'react'
// import { headerData } from '../Header/Navigation/menuData'
// import Logo from './Logo'
// import HeaderLink from '../Header/Navigation/HeaderLink'
// import MobileHeaderLink from '../Header/Navigation/MobileHeaderLink'
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from '@/redux/authSlice'

// const Header: React.FC = () => {
//   const pathUrl = usePathname()
//   const router = useRouter()
//   const dispatch = useDispatch()

//   const user = useSelector((state: any) => state.auth.user);

//   const [navbarOpen, setNavbarOpen] = useState(false)
//   const [sticky, setSticky] = useState(false)
//   const [profileOpen, setProfileOpen] = useState(false);

//   const mobileMenuRef = useRef<HTMLDivElement>(null)

//   const handleScroll = () => {
//     setSticky(window.scrollY >= 80)
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("user");

//     dispatch(logout());
//     router.push("/");
//   };

//   const handleClickOutside = (event: MouseEvent) => {
//     if (
//       mobileMenuRef.current &&
//       !mobileMenuRef.current.contains(event.target as Node) &&
//       navbarOpen
//     ) {
//       setNavbarOpen(false)
//     }
//   }

//   useEffect(() => {
//     window.addEventListener('scroll', handleScroll)
//     document.addEventListener('mousedown', handleClickOutside)
//     return () => {
//       window.removeEventListener('scroll', handleScroll)
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [navbarOpen])

//   useEffect(() => {
//     if (navbarOpen) {
//       document.body.style.overflow = 'hidden'
//     } else {
//       document.body.style.overflow = ''
//     }
//   }, [navbarOpen])

//   return (
//     <header className={`fixed top-0 z-999 w-full transition-all duration-300 ${sticky
//         ? 'py-2 bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100'
//         : 'py-4 bg-transparent shadow-none'
//       }`}>

//       <div className='container mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8'>

//         <Logo />

//         {/* Desktop Menu */}
//         <nav className='hidden lg:flex items-center justify-center gap-8 flex-1'>
//           {headerData.map((item, index) => (
//             <HeaderLink key={index} item={item} />
//           ))}
//         </nav>

//         {/* Right Section */}
//         <div className='flex items-center gap-3 relative'>

//           {/* ✅ SHOW SIGNIN/SIGNUP FOR ADMIN OR NO USER */}
//           {!user || user?.role === "admin" ? (
//             <>
//               <Link
//                 href='/signin'
//                 className='hidden sm:inline-flex px-5 py-2.5 rounded-full text-primary hover:bg-primary/5'>
//                 Sign In
//               </Link>

//               <Link
//                 href='/signup'
//                 className='hidden sm:inline-flex px-6 py-2.5 rounded-full bg-primary text-white shadow-md'>
//                 Sign Up
//               </Link>
//             </>
//           ) : (
//             user?.role === "student" && (
//               <div className="flex items-center gap-3 relative">

//                 {/* Dashboard */}
//                 <button
//                   onClick={() => router.push("/student")}
//                   className="hidden sm:inline-flex px-5 py-2.5 rounded-full bg-primary text-white shadow-md"
//                 >
//                   Dashboard
//                 </button>

//                 {/* Profile */}
//                 <div
//                   onClick={() => setProfileOpen(!profileOpen)}
//                   className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2C4276] to-blue-500 text-white flex items-center justify-center font-semibold shadow-md hover:scale-105 transition cursor-pointer"
//                 >
//                   {user?.name
//                     ?.split(" ")
//                     .map((n: string) => n[0])
//                     .join("")
//                     .toUpperCase() || "U"}
//                 </div>

//                 {/* Popup */}
//                 {profileOpen && (
//                   <div className="absolute right-2 top-12 w-64 bg-white/95 backdrop-blur-md border border-gray-100 rounded-xl shadow-lg p-4 z-50">

//                     <div className="flex items-center gap-3 mb-3">
//                       <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2C4276] to-blue-500 text-white flex items-center justify-center text-sm font-semibold">
//                         {user?.name
//                           ?.split(" ")
//                           .map((n: string) => n[0])
//                           .join("")
//                           .toUpperCase()}
//                       </div>

//                       <div>
//                         <p className="font-semibold text-gray-800 text-sm">
//                           {user?.name}
//                         </p>
//                         <p className="text-xs text-gray-500 truncate">
//                           {user?.email}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="border-t my-2"></div>

//                     <button
//                       onClick={handleLogout}
//                       className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md text-sm font-medium transition"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )
//           )}

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setNavbarOpen(!navbarOpen)}
//             className='lg:hidden p-2 rounded-xl bg-gray-50'
//           >
//             ☰
//           </button>

//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {navbarOpen && (
//         <div className='fixed inset-0 bg-black/60 z-40' onClick={() => setNavbarOpen(false)} />
//       )}

//       <div
//         ref={mobileMenuRef}
//         className={`lg:hidden fixed top-0 right-0 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ${navbarOpen ? 'translate-x-0' : 'translate-x-full'
//           } z-50`}>

//         <div className='flex justify-between p-6 border-b'>
//           <Logo />
//           <button onClick={() => setNavbarOpen(false)}>✕</button>
//         </div>

//         <nav className='p-6 space-y-3'>
//           {headerData.map((item, index) => (
//             <MobileHeaderLink key={index} item={item} />
//           ))}

//           {/* Mobile Auth */}
//           <div className='pt-6 flex flex-col gap-3'>
//             {!user || user?.role === "admin" ? (
//               <>
//                 <Link href='/signin'>Sign In</Link>
//                 <Link href='/signup'>Sign Up</Link>
//               </>
//             ) : (
//               user?.role === "student" && (
//                 <>
//                   <button
//                     onClick={() => {
//                       router.push("/student");
//                       setNavbarOpen(false);
//                     }}
//                   >
//                     Dashboard
//                   </button>

//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setNavbarOpen(false);
//                     }}
//                     className="text-red-500"
//                   >
//                     Logout
//                   </button>
//                 </>
//               )
//             )}
//           </div>

//         </nav>
//       </div>
//     </header>
//   )
// }

// export default Header