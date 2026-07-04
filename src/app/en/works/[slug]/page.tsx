import type { Metadata } from 'next'
import { allWorks } from 'content-collections'
import { notFound } from 'next/navigation'
import { WorkPageContent } from '@/components/page-content/work-page-content'
import { getWorkAvailableLocales, getWorkBySlug } from '@/lib/works'
import { createMetadata } from '@/lib/seo'

export const dynamicParams = false

export function generateStaticParams() {
  return allWorks
    .filter((work) => work.hasDetail && work.lang === 'en')
    .map((work) => ({ slug: work.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const work = getWorkBySlug(slug, 'en')

  if (!work || !work.hasDetail) notFound()

  return createMetadata({
    title: work.title,
    description: work.summary,
    path: `/en/works/${work.slug}`,
    keywords: work.tags,
    image: work.cover,
    availableLocales: getWorkAvailableLocales(slug),
  })
}

export default async function EnWorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return <WorkPageContent locale="en" slug={slug} />
}
