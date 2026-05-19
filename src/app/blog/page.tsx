import { BlogArchive } from '@/components/blog-archive'
import { getBlogPageCount, getBlogPagePosts, getPublishedPosts } from '@/lib/posts'

export const metadata = { title: 'Writing' }

export default function BlogPage() {
  const allPosts = getPublishedPosts()
  const page = 1
  const pageCount = getBlogPageCount(allPosts)
  const posts = getBlogPagePosts(page, allPosts)

  return (
    <BlogArchive page={page} pageCount={pageCount} posts={posts} totalPosts={allPosts.length} />
  )
}
