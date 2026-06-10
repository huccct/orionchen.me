import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TagPageContent } from '@/components/page-content/tag-page-content'
import { format, getDictionary } from '@/i18n/get-dictionary'
import { getPublishedPostsByTag, getPublishedTags } from '@/lib/posts'
import { createMetadata } from '@/lib/seo'

const dict = getDictionary('en')

export function generateStaticParams() {
  return [...getPublishedTags('en').keys()].map((tag) => ({ tag }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const { tag: rawTag } = await params
  const tag = decodeURIComponent(rawTag)
  const posts = getPublishedPostsByTag(tag, 'en')

  if (posts.length === 0) notFound()

  return createMetadata({
    title: `${dict.breadcrumb.tags}: ${tag}`,
    description: format(dict.blog.tagDescription, { tag, count: posts.length }),
    path: `/en/tags/${encodeURIComponent(tag)}`,
    keywords: [tag],
    noIndex: true,
  })
}

export default async function EnTagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: rawTag } = await params
  const tag = decodeURIComponent(rawTag)

  return <TagPageContent locale="en" tag={tag} />
}
