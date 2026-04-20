import { HeaderItem } from "@/types/menu";

export const headerData: HeaderItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us" },
  {
    label: "Courses",
    href: "/Course",
    // submenu: [
    //   { label: "Course List", href: "/Course" },
    //   { label: "Course Details", href: "/Course/Course_1" },
    // ],
  },
  // {
  //   label: "Blog",
  //   href: "/blog",
  //   // submenu: [
  //   //   { label: "Blog List", href: "/blog" },
  //   //   { label: "Blog Details", href: "/blog/Blog_1" },
  //   // ],
  // },
  { label: "Contact", href: "/contact-us" },
];
