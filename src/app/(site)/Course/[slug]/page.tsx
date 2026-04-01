// import React from "react";
// import CourseDetails from "./CourseDeatils";
// import fs from "fs";
// import path from "path";

// interface BlogDetailPageProps {
//     params: {
//         slug: string;
//     };
// }

// export function generateStaticParams() {
//     try {
//         const postsDirectory = path.join(process.cwd(), "markdown/Course");
//         const files = fs.readdirSync(postsDirectory);
//         return files.map((file) => ({
//             slug: file.replace(/\.mdx$/, ""),
//         }));
//     } catch (error) {
//         console.error("Error reading blog posts:", error);
//         return [
//             { slug: "Course_1" },
//             { slug: "Course_2" },
//             { slug: "Course_3" },
//             { slug: "Course_4" },
//             { slug: "Course_5" },
//             { slug: "Course_6" },
//             { slug: "Course_7" },
//             { slug: "Course_8" },
//             { slug: "Course_9" },
//         ];
//     }
// }

// const BlogDetailPage = ({ params }: BlogDetailPageProps) => {
//     return (
//         <>
//             <CourseDetails />
//         </>
//     );
// };

// export default BlogDetailPage;
// app/(site)/Course/[slug]/page.ts
  
import CourseDetails from "./CourseDetails";
import { Metadata } from "next";
import { coursesData } from "@/data/coursesData";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;

  return <CourseDetails slug={slug} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Course: ${slug}`,
  };
}

export function generateStaticParams() {
  return coursesData.map((course) => ({
    slug: course.slug,
  }));
}
