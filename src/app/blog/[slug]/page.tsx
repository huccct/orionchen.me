import { MDXContent } from '@content-collections/mdx/react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EarlyContentBanner } from '@/components/early-content-banner'
import { mdxComponents } from '@/components/mdx/mdx-components'
import type { TableOfContentsItem } from '@/lib/post-metadata'
import { getPostWithNeighbors, getPublishedPosts, type PublishedPost } from '@/lib/posts'

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { post, newerPost, olderPost } = getPostWithNeighbors(slug)

  if (!post) notFound()

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[minmax(0,42rem)_14rem] lg:items-start lg:justify-center">
      <article className="mx-auto w-full max-w-2xl min-w-0 lg:mx-0">
        <header className="mb-8 space-y-3">
          <h1 className="font-serif text-3xl leading-tight text-balance break-words sm:text-4xl">
            {post.title}
          </h1>
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs">
            <time>{post.date}</time>
            <span aria-hidden="true">/</span>
            <span>{post.readingTime.text}</span>
          </div>
        </header>
        {post.earlyContent && <EarlyContentBanner />}
        <div className="prose min-w-0">
          <MDXContent code={post.body} components={mdxComponents} />
        </div>
        <PostNavigation newerPost={newerPost} olderPost={olderPost} />
      </article>
      <PostTableOfContents items={post.tableOfContents} />
    </div>
  )
}

function PostTableOfContents({ items }: { items: TableOfContentsItem[] }) {
  if (items.length === 0) return null

  return (
    <aside className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto lg:block">
      <nav aria-label="文章目录" className="border-border/80 border-l py-1 pl-4">
        <div className="text-muted-foreground mb-3 font-mono text-xs tracking-normal">目录</div>
        <ol className="space-y-2">
          {items.map((item) => (
            <li key={`${item.id}-${item.title}`}>
              <a
                href={`#${item.id}`}
                className={`text-muted-foreground hover:text-accent block text-sm leading-snug transition-colors ${
                  item.level === 3 ? 'pl-3 text-xs' : ''
                }`}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  )
}

function PostNavigation({
  newerPost,
  olderPost,
}: {
  newerPost: PublishedPost | null
  olderPost: PublishedPost | null
}) {
  if (!newerPost && !olderPost) return null

  return (
    <nav className="border-border mt-12 grid gap-3 border-t pt-6 md:grid-cols-2">
      {newerPost ? (
        <PostNavigationLink post={newerPost} label="上一篇" />
      ) : (
        <div className="hidden md:block" />
      )}
      {olderPost ? (
        <PostNavigationLink post={olderPost} label="下一篇" align="end" />
      ) : (
        <div className="hidden md:block" />
      )}
    </nav>
  )
}

function PostNavigationLink({
  align = 'start',
  label,
  post,
}: {
  align?: 'start' | 'end'
  label: string
  post: PublishedPost
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`border-border hover:border-accent block rounded-md border p-4 transition-colors ${
        align === 'end' ? 'md:text-right' : ''
      }`}
    >
      <div className="text-muted-foreground font-mono text-xs">{label}</div>
      <div className="mt-2 font-serif text-base break-words">{post.title}</div>
      <time className="text-muted-foreground mt-1 block font-mono text-xs">{post.date}</time>
    </Link>
  )
}
