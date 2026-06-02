import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { NextResponse } from "next/server";

const postsDirectory = join(process.cwd(), "markdown/Blog");

export async function GET() {
    try {
        const files = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.mdx'));
        const posts = files.map((file) => {
            const fullPath = join(postsDirectory, file);
            const contents = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(contents);
            const slug = file.replace(/\.mdx$/, '');
            return {
                slug,
                title: data.title || slug,
                coverImage: data.coverImage || null,
            };
        });

        return NextResponse.json(posts);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
