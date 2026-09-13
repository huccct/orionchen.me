import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import '@/components/room-header.css'
import { MDXContent } from '@content-collections/mdx/react'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/json-ld'
import { mdxComponents } from '@/components/mdx/mdx-components'
import { StatusPill } from '@/components/status-pill'
import type { Locale } from '@/i18n/config'
import { localePathPrefix } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import { createBreadcrumbJsonLd, createWorkJsonLd } from '@/lib/seo'
import { getWorkBySlug } from '@/lib/works'

export function WorkPageContent({ locale, slug }: { locale: Locale; slug: string }) {
  const dict = getDictionary(locale)
  const prefix = localePathPrefix[locale]
  const work = getWorkBySlug(slug, locale)

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
      <nav
        className="room-navigation detail-navigation"
        aria-label={locale === 'zh' ? '作品导航' : 'Work navigation'}
      >
        <Link href={`${prefix || '/'}#works-room`}>
          <ArrowLeft size={15} />
          {locale === 'zh' ? '回到工作室' : 'Back to the studio'}
        </Link>
        <Link href={`${prefix}/works`}>{locale === 'zh' ? '作品目录' : 'Works archive'}</Link>
      </nav>
      <header className="mb-8 space-y-3">
        <div className="flex flex-wrap gap-2">
          <StatusPill kind={work.type} label={dict.works.types[work.type]} />
          <StatusPill kind={work.status} label={dict.works.statuses[work.status]} />
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
