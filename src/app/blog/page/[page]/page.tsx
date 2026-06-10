import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { JsonLd } from '@/components/json-ld'
import { BlogFilter } from '@/components/blog-filter'
import {
  createBreadcrumbJsonLd,
  createCollectionPageJsonLd,
  createMetadata,
} from '@/lib/seo'
import { getBlogPageCount, getBlogPagePosts, getPublishedPosts } from '@/lib/posts'

function parsePageParam(value: string) {
  if (!/^[1-9]\d*$/.test(value)) return null

  return Number(value)
}

export function generateStaticParams() {
  const pageCount = getBlogPageCount()

  return Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) => ({
    page: String(index + 2),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>
}): Promise<Metadata> {
  const page = parsePageParam((await params).page)

  return {
    ...createMetadata({
      title: page ? `Writing · Page ${page}` : 'Writing',
      description: page
        ? `Writing 归档第 ${page} 页。`
        : '技术教程、AI 观察和个人写作归档。',
      path: page ? `/blog/page/${page}` : '/blog',
      noIndex: true,
    }),
  }
}

export default async function BlogPageNumber({ params }: { params: Promise<{ page: string }> }) {
  const page = parsePageParam((await params).page)

  if (!page) notFound()
  if (page === 1) redirect('/blog')

  const allPosts = getPublishedPosts()
  const pageCount = getBlogPageCount(allPosts)

  if (page > pageCount) notFound()

  const posts = getBlogPagePosts(page, allPosts)

  return (
    <>
      <JsonLd
        data={[
          createCollectionPageJsonLd({
            name: `Writing Page ${page}`,
            description: `Writing 归档第 ${page} 页。`,
            path: `/blog/page/${page}`,
          }),
          createBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Writing', path: '/blog' },
            { name: `Page ${page}`, path: `/blog/page/${page}` },
          ]),
        ]}
      />
      <BlogFilter allPosts={allPosts} page={page} pageCount={pageCount} pagedPosts={posts} />
    </>
  )
}
