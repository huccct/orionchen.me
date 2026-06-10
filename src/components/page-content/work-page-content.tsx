import { allWorks } from 'content-collections'
import { MDXContent } from '@content-collections/mdx/react'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/json-ld'
import { mdxComponents } from '@/components/mdx/mdx-components'
import { StatusPill } from '@/components/status-pill'
import type { Locale } from '@/i18n/config'
import { localePathPrefix } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import { createBreadcrumbJsonLd, createWorkJsonLd } from '@/lib/seo'

export function WorkPageContent({ locale, slug }: { locale: Locale; slug: string }) {
  const dict = getDictionary(locale)
  const prefix = localePathPrefix[locale]
  const work = allWorks.find((item) => item.slug === slug)

  if (!work || !work.hasDetail) notFound()

  return (
    <article className="mx-auto w-full max-w-2xl">
      <JsonLd
        data={[
          createWorkJsonLd(work),
          createBreadcrumbJsonLd([
            { name: dict.breadcrumb.home, path: prefix === '' ? '/' : prefix },
            { name: dict.breadcrumb.works, path: `${prefix}/works` },
            { name: work.title, path: `${prefix}/works/${work.slug}` },
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
