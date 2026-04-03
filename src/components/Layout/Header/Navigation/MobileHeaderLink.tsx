import { useState } from 'react';
import Link from 'next/link';
import { HeaderItem } from '../../../../types/menu';
import { usePathname } from 'next/navigation';

const MobileHeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const handleToggle = () => {
    setSubmenuOpen(!submenuOpen);
  };

  const path = usePathname();

  return (
    <div className="relative w-full">
      <div className="flex items-center w-full">
        <Link
          href={item.href}
          className={`flex-1 py-3 px-4 text-base font-bold rounded-xl transition-all duration-200 ${path === item.href ? 'bg-primary/10 text-primary' : 'text-midnight_text dark:text-gray-300 hover:bg-primary/5 hover:text-primary'}`}
        >
          {item.label}
        </Link>
        {item.submenu && (
          <button
            onClick={handleToggle}
            className={`p-2 rounded-lg transition-transform duration-300 ${submenuOpen ? 'rotate-180 text-primary' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 10l5 5l5-5" />
            </svg>
          </button>
        )}
      </div>

      {submenuOpen && item.submenu && (
        <div className="mt-1 ml-4 border-l-2 border-gray-100 dark:border-white/5 space-y-1">
          {item.submenu.map((subItem, index) => (
            <Link
              key={index}
              href={subItem.href}
              className={`block py-1.5 px-6 text-sm font-medium transition-colors ${path === subItem.href ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-primary'}`}
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileHeaderLink;
