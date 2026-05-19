import { allWorks } from 'content-collections'
import { MDXContent } from '@content-collections/mdx/react'
import { notFound } from 'next/navigation'
import { mdxComponents } from '@/components/mdx/mdx-components'
import { StatusPill } from '@/components/status-pill'

export const dynamicParams = false

export function generateStaticParams() {
  return allWorks.filter((work) => work.hasDetail).map((work) => ({ slug: work.slug }))
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const work = allWorks.find((item) => item.slug === slug)

  if (!work || !work.hasDetail) notFound()

  return (
    <article className="mx-auto max-w-2xl">
      <header className="mb-8 space-y-3">
        <div className="flex gap-2">
          <StatusPill kind={work.type} />
          <StatusPill kind={work.status} />
        </div>
        <h1 className="font-serif text-4xl">{work.title}</h1>
        <p className="text-muted-foreground">{work.summary}</p>
      </header>
      <div className="prose">
        <MDXContent code={work.body} components={mdxComponents} />
      </div>
    </article>
  )
}
