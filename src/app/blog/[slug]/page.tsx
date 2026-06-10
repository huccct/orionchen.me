import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostPageContent } from '@/components/page-content/post-page-content'
import { getPostAvailableLocales, getPublishedPost, getPublishedPosts } from '@/lib/posts'
import { createMetadata } from '@/lib/seo'

export function generateStaticParams() {
  return getPublishedPosts('zh').map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPublishedPost(slug, 'zh')

  if (!post) notFound()

  return createMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.summary ?? post.title,
    path: `/blog/${post.slug}`,
    keywords: post.seoKeywords.length > 0 ? post.seoKeywords : post.tags,
    image: `/blog/${post.slug}/opengraph-image`,
    type: 'article',
    publishedTime: post.date,
    modifiedTime: post.date,
    authors: ['Orion Chen'],
    tags: post.tags,
    availableLocales: getPostAvailableLocales(slug),
  })
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return <PostPageContent locale="zh" slug={slug} />
}
