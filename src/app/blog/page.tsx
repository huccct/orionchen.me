import { BlogFilter } from '@/components/blog-filter'
import { getBlogPageCount, getBlogPagePosts, getPublishedPosts } from '@/lib/posts'

export const metadata = { title: 'Writing' }

export default function BlogPage() {
  const allPosts = getPublishedPosts()
  const page = 1
  const pageCount = getBlogPageCount(allPosts)
  const pagedPosts = getBlogPagePosts(page, allPosts)

  return (
    <BlogFilter
      allPosts={allPosts}
      page={page}
      pageCount={pageCount}
      pagedPosts={pagedPosts}
    />
  )
}
