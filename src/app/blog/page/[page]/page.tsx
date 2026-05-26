import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { BlogFilter } from '@/components/blog-filter'
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
    title: page ? `Writing · Page ${page}` : 'Writing',
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
    <BlogFilter allPosts={allPosts} page={page} pageCount={pageCount} pagedPosts={posts} />
  )
}
