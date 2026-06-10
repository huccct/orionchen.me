import type { Metadata } from 'next'
import { allWorks } from 'content-collections'
import { MDXContent } from '@content-collections/mdx/react'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/json-ld'
import { mdxComponents } from '@/components/mdx/mdx-components'
import { StatusPill } from '@/components/status-pill'
import { createBreadcrumbJsonLd, createMetadata, createWorkJsonLd } from '@/lib/seo'
import { getWorkBySlug } from '@/lib/works'

export const dynamicParams = false

export function generateStaticParams() {
  return allWorks.filter((work) => work.hasDetail).map((work) => ({ slug: work.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const work = getWorkBySlug(slug)

  if (!work || !work.hasDetail) notFound()

  return createMetadata({
    title: work.title,
    description: work.summary,
    path: `/works/${work.slug}`,
    keywords: work.tags,
    image: work.cover,
  })
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const work = getWorkBySlug(slug)

  if (!work || !work.hasDetail) notFound()

  return (
    <article className="mx-auto w-full max-w-2xl">
      <JsonLd
        data={[
          createWorkJsonLd(work),
          createBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Works', path: '/works' },
            { name: work.title, path: `/works/${work.slug}` },
          ]),
        ]}
      />
      <header className="mb-8 space-y-3">
        <div className="flex flex-wrap gap-2">
          <StatusPill kind={work.type} />
          <StatusPill kind={work.status} />
        </div>
        <h1 className="font-serif text-3xl leading-tight text-balance break-words sm:text-4xl">
          {work.title}
        </h1>
        <p className="text-muted-foreground break-words">{work.summary}</p>
      </header>
      <div className="prose min-w-0">
        <MDXContent code={work.body} components={mdxComponents} />
      </div>
    </article>
  )
}
