import type { Metadata } from 'next'
import { JsonLd } from '@/components/json-ld'
import { BlogFilter } from '@/components/blog-filter'
import { createBreadcrumbJsonLd, createCollectionPageJsonLd, createMetadata } from '@/lib/seo'
import { getBlogPageCount, getBlogPagePosts, getPublishedPosts } from '@/lib/posts'

export const metadata: Metadata = createMetadata({
  title: 'Writing',
  description: '技术教程、AI 观察和个人写作归档。',
  path: '/blog',
  keywords: ['blog', 'writing', 'AI', 'frontend', 'essay'],
})

export default function BlogPage() {
  const allPosts = getPublishedPosts()
  const page = 1
  const pageCount = getBlogPageCount(allPosts)
  const pagedPosts = getBlogPagePosts(page, allPosts)

  return (
    <>
      <JsonLd
        data={[
          createCollectionPageJsonLd({
            name: 'Writing',
            description: '技术教程、AI 观察和个人写作归档。',
            path: '/blog',
          }),
          createBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Writing', path: '/blog' },
          ]),
        ]}
      />
      <BlogFilter
        allPosts={allPosts}
        page={page}
        pageCount={pageCount}
        pagedPosts={pagedPosts}
      />
    </>
  )
}
