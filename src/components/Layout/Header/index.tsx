'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { headerData } from '../Header/Navigation/menuData'
import Logo from './Logo'
import HeaderLink from '../Header/Navigation/HeaderLink'
import MobileHeaderLink from '../Header/Navigation/MobileHeaderLink'
// import { useTheme } from 'next-themes'
import { Icon } from '@iconify/react/dist/iconify.js'

const Header: React.FC = () => {
  const pathUrl = usePathname()
  // const { theme, setTheme } = useTheme()

  const [navbarOpen, setNavbarOpen] = useState(false)
  const [sticky, setSticky] = useState(false)

  const navbarRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    setSticky(window.scrollY >= 80)
  }

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

  const path = usePathname()

  useEffect(() => {
    if (navbarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [navbarOpen])

  return (
    <header
      className={`fixed top-0 z-999 w-full transition-all duration-300 ${sticky
        ? 'py-2 bg-white/80 dark:bg-darkmode/80 backdrop-blur-md shadow-lg border-b border-gray-100 dark:border-white/10'
        : 'py-4 bg-transparent shadow-none'
        }`}>
      <div className='container mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8'>
        <div className="flex-shrink-0">
          <Logo />
        </div>

        <nav className='hidden lg:flex items-center justify-center gap-8 flex-1'>
          {headerData.map((item, index) => (
            <HeaderLink key={index} item={item} />
          ))}
        </nav>

        <div className='flex items-center gap-3'>
          <Link
            href='/signin'
            className='hidden sm:inline-flex items-center justify-center font-semibold text-sm transition-all duration-200 px-5 py-2.5 rounded-full text-primary hover:bg-primary/5'>
            Sign In
          </Link>
          <Link
            href='/signup'
            className='hidden sm:inline-flex items-center justify-center font-semibold text-sm transition-all duration-200 px-6 py-2.5 rounded-full bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg active:scale-95'>
            Sign Up
          </Link>
          <button
            onClick={() => setNavbarOpen(!navbarOpen)}
            className='lg:hidden relative z-50 p-2 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors'
            aria-label='Toggle mobile menu'>
            <div className="w-6 h-5 flex flex-col justify-between items-center transition-all duration-300">
              <span className={`block w-6 h-0.5 bg-midnight_text dark:bg-white transform transition-transform duration-300 ${navbarOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-midnight_text dark:bg-white transition-opacity duration-300 ${navbarOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-midnight_text dark:bg-white transform transition-transform duration-300 ${navbarOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {navbarOpen && (
        <div
          className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity'
          onClick={() => setNavbarOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed top-0 right-0 h-full w-[300px] bg-white dark:bg-darkmode shadow-2xl transform transition-transform duration-300 ease-in-out ${navbarOpen ? 'translate-x-0' : 'translate-x-full'
          } z-50 flex flex-col`}>
        <div className='flex items-center justify-between p-6 border-b dark:border-white/10'>
          <Logo />
          <button
            onClick={() => setNavbarOpen(false)}
            aria-label='Close mobile menu'
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
            <Icon icon="ic:round-close" className='text-2xl text-midnight_text dark:text-white' />
          </button>
        </div>
        <nav className='flex-1 overflow-y-auto p-6 space-y-2'>
          {headerData.map((item, index) => (
            <MobileHeaderLink key={index} item={item} />
          ))}
          <div className='pt-8 flex flex-col gap-3'>
            <Link
              href='/signin'
              className='w-full flex items-center justify-center font-bold px-6 py-3 rounded-xl border border-primary text-primary hover:bg-primary/5 transition-all'
              onClick={() => setNavbarOpen(false)}>
              Sign In
            </Link>
            <Link
              href='/signup'
              className='w-full flex items-center justify-center font-bold px-6 py-3 rounded-xl bg-primary text-white shadow-lg hover:shadow-xl transition-all active:scale-95'
              onClick={() => setNavbarOpen(false)}>
              Sign Up
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
