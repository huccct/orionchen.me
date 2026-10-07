import Link from 'next/link'
import { PostCard } from '@/components/post-card'
import { Fragment } from 'react'
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
  const topics = new Map<string, number>()
  for (const post of allPosts) {
    for (const tag of post.tags ?? []) topics.set(tag, (topics.get(tag) ?? 0) + 1)
  }
  const topTopics = [...topics].sort((a, b) => b[1] - a[1]).slice(0, 8)
  const en = pathPrefix === '/en'
  const showPager = pageCount > 1
  const totalPosts = allPosts.length
  const firstPostNumber = totalPosts === 0 ? 0 : (page - 1) * POSTS_PER_PAGE + 1
  const lastPostNumber = Math.min(page * POSTS_PER_PAGE, totalPosts)

  return (
    <div className="writing-layout">
      <div className="writing-main">
        <div className="writing-index">
          {pagedPosts.map((post, index) => (
            <Fragment key={post.slug}>
              {(index === 0 ||
                post.date.slice(0, 4) !== pagedPosts[index - 1]?.date.slice(0, 4)) && (
                <h2 className="writing-year">{post.date.slice(0, 4)}</h2>
              )}
              <PostCard pathPrefix={pathPrefix} post={post} />
            </Fragment>
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
      <aside className="writing-sidebar">
        <section>
          <h2>{en ? 'Follow a thread' : '沿着兴趣读下去'}</h2>
          <p>
            {en
              ? `${totalPosts} articles, collected over time.`
              : `${totalPosts} 篇文字，慢慢积累。`}
          </p>
          <nav aria-label={en ? 'Topics' : '文章主题'}>
            {topTopics.map(([tag, count]) => (
              <Link key={tag} href={`${pathPrefix}/tags/${encodeURIComponent(tag)}`}>
                <span>{tag}</span>
                <small>{count}</small>
              </Link>
            ))}
          </nav>
          <Link className="writing-sidebar-more" href={`${pathPrefix}/tags`}>
            {en ? 'All topics' : '查看全部主题'}
          </Link>
        </section>
        <section>
          <h2>{en ? 'From the bookshelf' : '书架的一角'}</h2>
          {dict.about.readingItems.slice(0, 2).map((book) => (
            <a className="writing-book" key={book.href} href={book.href}>
              <h3>{book.title}</h3>
              <p>{book.note}</p>
            </a>
          ))}
          <Link className="writing-sidebar-more" href={`${pathPrefix}/reading`}>
            {en ? 'Browse the reading list' : '翻翻完整书单'}
          </Link>
        </section>
        <a className="writing-sidebar-more" href="/rss.xml">
          {en ? 'Follow via RSS' : '通过 RSS 订阅更新'}
        </a>
      </aside>
    </div>
  )
}
