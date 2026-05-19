import { MDXContent } from '@content-collections/mdx/react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EarlyContentBanner } from '@/components/early-content-banner'
import { mdxComponents } from '@/components/mdx/mdx-components'
import { getPostWithNeighbors, getPublishedPosts, type PublishedPost } from '@/lib/posts'

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { post, newerPost, olderPost } = getPostWithNeighbors(slug)

  if (!post) notFound()

  return (
    <article className="mx-auto max-w-2xl">
      <header className="mb-8 space-y-2">
        <h1 className="font-serif text-4xl">{post.title}</h1>
        <time className="text-muted-foreground font-mono text-xs">{post.date}</time>
      </header>
      {post.earlyContent && <EarlyContentBanner />}
      <div className="prose">
        <MDXContent code={post.body} components={mdxComponents} />
      </div>
      <PostNavigation newerPost={newerPost} olderPost={olderPost} />
    </article>
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
      <div className="mt-2 font-serif text-base">{post.title}</div>
      <time className="text-muted-foreground mt-1 block font-mono text-xs">{post.date}</time>
    </Link>
  )
}
