"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Users,
  GraduationCap,
  FileText,
  BarChart3,
  CreditCard,
  Settings,
  Briefcase,
  ClipboardCheck,
  PenBox,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Video,
  Gift,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// import Image from "next/image";

interface SidebarProps {
  role: string;
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ role, collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const handleItemClick = () => {
    if (window.innerWidth < 768) {
      onToggle(); // close sidebar on mobile
    }
  };

  const adminMenu = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },

    {
      name: "Courses",
      icon: BookOpen,
      subItems: [
        { name: "Courses", path: "/admin/courses" },
        { name: "Category", path: "/admin/categories" },
        { name: "Subcategory", path: "/admin/subcategories" },

      ]
    },

    {
      name: "Meetings",
      icon: Video,
      path: "/admin/meetings",

    },

    { name: "Inquiries", path: "/admin/inquiries", icon: MessageSquare },
    {
      name: "Entrance Exam",
      icon: PenBox,
      subItems: [
        { name: "College Management", path: "/admin/entrance/management" },
        { name: "Students", path: "/admin/entrance/sstudents" },
        { name: "Entrance Management", path: "/admin/entrance/entrance-management" },
        { name: "Entrance Test Logs", path: "/admin/entrance/entrance-test-logs" },
        { name: "Bulk Upload Questions", path: "/admin/entrance/bulk-upload" },
      ],
    },
    { name: "Students", path: "/admin/students", icon: GraduationCap },
    { name: "Payments", path: "/admin/payments", icon: CreditCard },
    { name: "Teachers", path: "/admin/teachers", icon: Users },
    { name: "Batches", path: "/admin/batches", icon: Users },
    // { name: "Group Consent", path: "/admin/group-management", icon: ClipboardCheck },
    { name: "Blogs", path: "/admin/blogs", icon: FileText },
    // { name: "Placement", path: "/admin/placement", icon: Briefcase },
    { name: "Reports", path: "/admin/reports", icon: BarChart3 },
    // { name: "Payments", path: "/admin/payments", icon: CreditCard },
    { name: "Testimonials", path: "/admin/testimonial", icon: FileText },
    {
      name: "Practice Tests",
      icon: ClipboardCheck,
      subItems: [
        { name: "Practice Test", path: "/admin/practice-tests" },
        { name: "Test Log", path: "/admin/practice-tests/all-logs" },
      ],
    },
    // { name: "Workshops", path: "/admin/workshops", icon: BookOpen },
    { name: "Industry Partners", path: "/admin/industry-partners", icon: Briefcase },
    { name: "Referral", path: "/admin/referral", icon: Gift },
    { name: "Withdrawals", path: "/admin/withdrawals", icon: CreditCard },
    { name: "Track Time", path: "/admin/track-time", icon: Clock },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (name: string) => {
    if (collapsed) return;
    setOpenSubmenu((prev) => (prev === name ? null : name));
  };

  const menu = adminMenu;

  return (
    <motion.div
      initial={false}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className={`
  fixed md:relative left-0 top-16 md:top-0 h-[calc(100vh-64px)] md:h-full z-50 bg-white border-r border-gray-200 shadow-lg
  flex flex-col overflow-hidden flex-shrink-0
  transition-all duration-300
  ${collapsed ? "-translate-x-full md:translate-x-0 md:w-16" : "translate-x-0 w-64"}
`}>
      {/* Logo / Brand
      <div className={`flex items-center border-b border-gray-100 flex-shrink-0 transition-all duration-250 ${collapsed ? "justify-center px-2 py-4" : "gap-2 px-4 py-4"}`}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2C4276] to-blue-400 flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-white font-bold text-sm">P</span>
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <span className="text-[#2C4276] font-bold text-base tracking-tight">Paarsh Edu</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div> */}

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
        <ul className="space-y-0.5">
          {menu.map((item) => {
            const hasSubItems = "subItems" in item && item.subItems && item.subItems.length > 0;
            const isActive = "path" in item ? pathname === item.path : false;
            const isSubmenuActive =
              hasSubItems &&
              "subItems" in item &&
              item.subItems.some((sub) => pathname === sub.path);
            const isOpen = !collapsed && (openSubmenu === item.name || isSubmenuActive);

            return (
              <li key={item.name} className="select-none">
                {hasSubItems ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      title={collapsed ? item.name : undefined}
                      className={`w-full flex items-center px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${collapsed ? "justify-center" : "justify-between"}
                        ${isSubmenuActive
                          ? "text-blue-600 bg-blue-50/50"
                          : "text-gray-800 hover:bg-gray-50 hover:text-blue-600"}`}
                    >
                      <div className={`flex items-center ${collapsed ? "" : "gap-3"}`}>
                        <item.icon
                          size={18}
                          className={`flex-shrink-0 ${isSubmenuActive ? "text-blue-600" : "text-gray-600"}`}
                        />
                        <AnimatePresence initial={false}>
                          {!collapsed && (
                            <motion.span
                              key="label"
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden whitespace-nowrap"
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                      {!collapsed && (
                        <ChevronDown
                          size={15}
                          className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${isSubmenuActive ? "text-blue-600" : "text-gray-500"}`}
                        />
                      )}
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && "subItems" in item && (
                        <motion.ul
                          key="submenu"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden mt-0.5 ml-4 space-y-0.5 border-l border-gray-200 pl-3"
                        >
                          {item.subItems.map((sub) => {
                            const isSubActive = pathname === sub.path;
                            return (
                              <li key={sub.name}>
                                <Link
                                  href={sub.path} onClick={handleItemClick}
                                  className={`flex items-center gap-2.5 px-2 py-1.5 text-[13px] rounded-md transition-all duration-200
                                    ${isSubActive
                                      ? "text-blue-600 font-semibold bg-blue-50/80"
                                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"}`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0
                                      ${isSubActive
                                        ? "bg-blue-600 shadow-[0_0_6px_rgba(37,99,235,0.4)]"
                                        : "bg-gray-500"}`}
                                  />
                                  <span className="truncate">{sub.name}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  "path" in item &&
                  item.path && (
                    <Link
                      href={item.path} onClick={handleItemClick}
                      title={collapsed ? item.name : undefined}
                      className={`flex items-center px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${collapsed ? "justify-center" : "gap-3"}
                        ${isActive
                          ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100/50"
                          : "text-gray-800 hover:bg-gray-50 hover:text-blue-600"}`}
                    >
                      <item.icon
                        size={18}
                        className={`flex-shrink-0 ${isActive ? "text-blue-600" : "text-gray-600"}`}
                      />
                      <AnimatePresence initial={false}>
                        {!collapsed && (
                          <motion.span
                            key="label"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden whitespace-nowrap"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  )
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer with Toggle Button */}
      {/* <div className={`border-t border-gray-200 flex-shrink-0 transition-all duration-250 ${collapsed ? "px-2 py-3 flex justify-center" : "px-4 py-3"}`}>
        {collapsed ? (
          <button
            onClick={onToggle}
            title="Expand sidebar"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
          >
            <PanelLeftOpen size={18} />
          </button>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-blue-600">Admin Portal</p>
              <p className="text-[10px] text-gray-600">© 2026 All Rights Reserved</p>
            </div>
            <button
              onClick={onToggle}
              title="Collapse sidebar"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex-shrink-0"
            >
              <PanelLeftClose size={18} />
            </button>
          </div>
        )}
      </div> */}
    </motion.div>
  );
}
