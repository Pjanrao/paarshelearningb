"use client"
import { useState } from 'react';
import Link from 'next/link';
import { HeaderItem } from '../../../../types/menu';
import { usePathname } from 'next/navigation';

const HeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const path = usePathname()
  const handleMouseEnter = () => {
    if (item.submenu) {
      setSubmenuOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setSubmenuOpen(false);
  };

  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={item.href} className={`text-[15px] flex items-center py-2 font-semibold transition-colors duration-300 hover:text-primary dark:hover:text-primary ${path === item.href ? 'text-primary dark:text-primary' : 'text-midnight_text dark:text-gray-300'}`}>
        <span>{item.label}</span>
        {item.submenu && (
          <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" className="ml-0.5 opacity-60 group-hover:scale-110 transition-transform">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 10l5 5l5-5" />
          </svg>
        )}
        {/* Animated Underline */}
        <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${path === item.href ? 'w-full' : ''}`}></span>
      </Link>

      {submenuOpen && (
        <div
          className="absolute top-full left-0 pt-2 w-56 transform origin-top transition-all"
        >
          <div className="bg-white dark:bg-darklight shadow-2xl rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden backdrop-blur-xl">
            {item.submenu?.map((subItem, index) => (
              <Link
                key={index}
                href={subItem.href}
                className={`block px-5 py-3 text-sm font-medium transition-all duration-200 border-l-2 ${path === subItem.href
                  ? "bg-primary/5 text-primary border-primary"
                  : "text-midnight_text dark:text-gray-400 border-transparent hover:bg-gray-50 dark:hover:bg-white/5 hover:text-primary hover:border-primary/40"
                  }`}
              >
                {subItem.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderLink;
