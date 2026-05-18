import { allPosts } from 'content-collections'
import { MDXContent } from '@content-collections/mdx/react'
import { notFound } from 'next/navigation'
import { EarlyContentBanner } from '@/components/early-content-banner'
import { mdxComponents } from '@/components/mdx/mdx-components'

export function generateStaticParams() {
  return allPosts.filter((post) => !post.draft).map((post) => ({ slug: post.slug }))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = allPosts.find((item) => item.slug === slug && !item.draft)

  if (!post) notFound()

  return (
    <article className="mx-auto max-w-2xl">
      <header className="mb-8 space-y-2">
        <h1 className="font-serif text-xl">{post.title}</h1>
        <time className="font-mono text-xs text-[var(--color-muted)]">{post.date}</time>
      </header>
      {post.earlyContent && <EarlyContentBanner />}
      <div className="prose">
        <MDXContent code={post.body} components={mdxComponents} />
      </div>
    </article>
  )
}
