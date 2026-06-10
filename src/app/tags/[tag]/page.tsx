import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/json-ld'
import { PostCard } from '@/components/post-card'
import { SectionHeader } from '@/components/section-header'
import {
  getPublishedPostsByTag,
  getPublishedTags,
} from '@/lib/posts'
import {
  createBreadcrumbJsonLd,
  createCollectionPageJsonLd,
  createMetadata,
} from '@/lib/seo'

export function generateStaticParams() {
  return [...getPublishedTags().keys()].map((tag) => ({ tag }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const { tag: rawTag } = await params
  const tag = decodeURIComponent(rawTag)
  const posts = getPublishedPostsByTag(tag)

  if (posts.length === 0) notFound()

  return createMetadata({
    title: `Tag: ${tag}`,
    description: `${tag} 相关文章归档，共 ${posts.length} 篇。`,
    path: `/tags/${encodeURIComponent(tag)}`,
    keywords: [tag],
    noIndex: true,
  })
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: rawTag } = await params
  const tag = decodeURIComponent(rawTag)
  const posts = getPublishedPostsByTag(tag)

  if (posts.length === 0) notFound()

  return (
    <>
      <JsonLd
        data={[
          createCollectionPageJsonLd({
            name: `Tag: ${tag}`,
            description: `${tag} 相关文章归档，共 ${posts.length} 篇。`,
            path: `/tags/${encodeURIComponent(tag)}`,
          }),
          createBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Tags', path: '/tags' },
            { name: tag, path: `/tags/${encodeURIComponent(tag)}` },
          ]),
        ]}
      />
      <div>
        <SectionHeader>{`tag: ${tag}`}</SectionHeader>
        <div>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </>
  )
}
