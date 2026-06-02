import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import { connectDB } from "@/lib/db";
import SiteImage from "@/models/SiteImage";

const postsDirectory = join(process.cwd(), "markdown/Blog");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string, fields: string[] = []) {  
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  type Items = {
    // [key: string]: string;
    [key: string]: string | object;
  };

  const items: any = {};

  function processImages(content: string) {
    // You can modify this function to handle image processing
    // For example, replace image paths with actual HTML image tags
    return content.replace(/!\[.*?\]\((.*?)\)/g, '<img src="$1" alt="" />');
  }

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content") {
      // You can modify the content here to include Images
      items[field] = processImages(content);
    }

    if (field === "metadata") {
      // Include metadata, including the image information
      items[field] = { ...data, coverImage: data.coverImage || null };
    }

    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });

  return items;
}

// Attach DB override for single post (coverImage)
export async function getPostBySlugWithOverrides(slug: string, fields: string[] = []) {
  const items = getPostBySlug(slug, fields);
  try {
    await connectDB();
    const realSlug = (slug || "").replace(/\.mdx$/, "");
    const key = `BLOG_${realSlug}`;
    const img = await SiteImage.findOne({ key });
    if (img && img.url) {
      items.coverImage = img.url;
    }
  } catch (e) {
    // ignore DB errors and return items as-is
  }
  return items;
}

export function getAllPosts(fields: string[] = []) {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

  return posts;
}

// Helper to attach DB overrides for cover images (key: BLOG_<slug>)
export async function attachBlogImageOverrides(posts: any[]) {
  try {
    await connectDB();
    const keys = posts.map((p) => `BLOG_${p.slug}`);
    const images = await SiteImage.find({ key: { $in: keys } });
    const imgMap: Record<string, string> = {};
    images.forEach((img) => {
      imgMap[img.key] = img.url;
    });
    return posts.map((p) => ({
      ...p,
      coverImage: imgMap[`BLOG_${p.slug}`] || p.coverImage || null,
    }));
  } catch (e) {
    return posts;
  }
}
