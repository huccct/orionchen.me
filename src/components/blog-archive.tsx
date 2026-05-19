import Link from 'next/link'
import { PostCard } from '@/components/post-card'
import { SectionHeader } from '@/components/section-header'
import { getBlogPageHref, POSTS_PER_PAGE, type PublishedPost } from '@/lib/posts'

export function BlogArchive({
  page,
  pageCount,
  posts,
  totalPosts,
}: {
  page: number
  pageCount: number
  posts: PublishedPost[]
  totalPosts: number
}) {
  const firstPostNumber = totalPosts === 0 ? 0 : (page - 1) * POSTS_PER_PAGE + 1
  const lastPostNumber = Math.min(page * POSTS_PER_PAGE, totalPosts)

  return (
    <div>
      <SectionHeader>Writing</SectionHeader>
      <div className="text-muted-foreground mb-4 font-mono text-xs">
        {`${totalPosts} posts · page ${page} of ${pageCount}`}
      </div>
      <div>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      {pageCount > 1 && (
        <nav className="border-border mt-8 flex items-center justify-between border-t pt-4 font-mono text-xs">
          {page > 1 ? (
            <Link href={getBlogPageHref(page - 1)} className="hover:text-accent">
              newer
            </Link>
          ) : (
            <span className="text-muted-foreground">newer</span>
          )}
          <span className="text-muted-foreground">
            {`${firstPostNumber}-${lastPostNumber} / ${totalPosts}`}
          </span>
          {page < pageCount ? (
            <Link href={getBlogPageHref(page + 1)} className="hover:text-accent">
              older
            </Link>
          ) : (
            <span className="text-muted-foreground">older</span>
          )}
        </nav>
      )}
    </div>
  )
}
