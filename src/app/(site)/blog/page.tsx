import React from "react";
import BlogGallery from "./BlogGallery";
import BlogHero from "./blogHero";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Blogs | Paarsh E - Learning",
	 icons: {
    icon: '/favicon.png',
  },
};

const BlogPage = () => {
	return (
		<>
			<BlogHero />
			<BlogGallery />
		</>
	);
};

export default BlogPage;

