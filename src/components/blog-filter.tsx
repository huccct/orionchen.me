import Link from 'next/link'
import { PostCard } from '@/components/post-card'
import { SectionHeader } from '@/components/section-header'
import type { Dictionary } from '@/i18n/get-dictionary'
import { getBlogPageHref, POSTS_PER_PAGE, type PublishedPost } from '@/lib/posts'

export function BlogFilter({
  allPosts,
  dict,
  page,
  pageCount,
  pagedPosts,
  pathPrefix = '',
}: {
  allPosts: PublishedPost[]
  dict: Dictionary
  page: number
  pageCount: number
  pagedPosts: PublishedPost[]
  /** Locale path prefix, e.g. '' for zh or '/en' for en. */
  pathPrefix?: string
}) {
  const showPager = pageCount > 1
  const totalPosts = allPosts.length
  const firstPostNumber = totalPosts === 0 ? 0 : (page - 1) * POSTS_PER_PAGE + 1
  const lastPostNumber = Math.min(page * POSTS_PER_PAGE, totalPosts)

  return (
    <div>
      <SectionHeader action={<span>{`${firstPostNumber}-${lastPostNumber} / ${totalPosts}`}</span>}>
        {dict.blog.title}
      </SectionHeader>

      <div>
        {pagedPosts.map((post) => (
          <PostCard key={post.slug} pathPrefix={pathPrefix} post={post} />
        ))}
      </div>

      {showPager && (
        <nav className="border-border mt-8 flex items-center justify-between border-t pt-4 font-mono text-xs">
          {page > 1 ? (
            <Link href={getBlogPageHref(page - 1, pathPrefix)} className="hover:text-accent">
              {dict.blog.newer}
            </Link>
          ) : (
            <span className="text-muted-foreground">{dict.blog.newer}</span>
          )}
          <span className="text-muted-foreground">
            {`${firstPostNumber}-${lastPostNumber} / ${totalPosts}`}
          </span>
          {page < pageCount ? (
            <Link href={getBlogPageHref(page + 1, pathPrefix)} className="hover:text-accent">
              {dict.blog.older}
            </Link>
          ) : (
            <span className="text-muted-foreground">{dict.blog.older}</span>
          )}
        </nav>
      )}
    </div>
  )
}
