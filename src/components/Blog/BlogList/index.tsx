import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getAllPosts, attachBlogImageOverrides } from '@/utils/markdown'

const BlogList = async () => {
  let posts = getAllPosts(['title', 'date', 'excerpt', 'coverImage', 'slug','blog'])
  // Attach DB overrides if any
  try {
    posts = await attachBlogImageOverrides(posts);
  } catch (e) {
    // ignore
  }
  return (
    <section
      className='flex flex-wrap justify-center pt-8 md:pb-24 pb-16 dark:bg-darkmode'
      id='blog'>
      <div className='container mx-auto  max-w-6xl'>
        <div className='grid grid-cols-12 gap-7'>
          {posts.map((blog, i) => (
            <div
              key={i}
              className='w-full lg:col-span-4 md:col-span-6 col-span-12'
              data-aos='fade-up'
              data-aos-delay='200'
              data-aos-duration='1000'>
              <article className='bg-white dark:bg-gray-900 rounded overflow-hidden shadow'>
                {blog.coverImage && (
                  <Link href={`/blog/${blog.slug}`}>
                    <a className='block w-full h-48 relative'>
                      <Image
                        src={blog.coverImage}
                        alt={blog.title || 'blog image'}
                        fill
                        sizes='(max-width: 768px) 100vw, 33vw'
                        style={{ objectFit: 'cover' }}
                      />
                    </a>
                  </Link>
                )}
                <div className='p-4'>
                  <h3 className='text-xl font-semibold mb-2'>{blog.title}</h3>
                  <p className='text-sm text-muted mb-3'>{blog.excerpt}</p>
                  <Link href={`/blog/${blog.slug}`}>
                    <a className='text-primary underline'>Read more</a>
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogList
