import Link from 'next/link'
import { JsonLd } from '@/components/json-ld'
import { PostCard } from '@/components/post-card'
import { SectionHeader } from '@/components/section-header'
import { WorkCard } from '@/components/work-card'
import type { Locale } from '@/i18n/config'
import { localePathPrefix } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import { getPublishedPosts } from '@/lib/posts'
import { createBreadcrumbJsonLd, createCollectionPageJsonLd } from '@/lib/seo'
import { getVisibleWorks } from '@/lib/works'

/**
 * Home page body. Used by both `/` (zh) and `/en` route shells. Filters
 * posts and works by locale once it's wired through the schema.
 */
export function HomePageContent({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale)
  const prefix = localePathPrefix[locale]
  const featured = getVisibleWorks().filter((work) => work.featured).slice(0, 6)
  const latest = getPublishedPosts().slice(0, 5)

  return (
    <div className="space-y-12 md:space-y-16">
      <JsonLd
        data={[
          createCollectionPageJsonLd({
            name: 'Orion Chen',
            description: dict.site.homeCollectionDescription,
            path: prefix === '' ? '/' : prefix,
          }),
          createBreadcrumbJsonLd([
            { name: dict.breadcrumb.home, path: prefix === '' ? '/' : prefix },
          ]),
        ]}
      />
      <section className="py-10 sm:py-14 md:py-16">
        <h1 className="font-serif text-4xl leading-tight text-balance sm:text-5xl md:text-6xl">
          {dict.home.heroLine1}
          <br />
          {dict.home.heroLine2}
          <br />
          {dict.home.heroLine3}{' '}
          <span className="text-foreground relative isolate inline-block whitespace-nowrap after:absolute after:inset-x-[-0.08em] after:bottom-[0.08em] after:-z-10 after:h-[0.34em] after:bg-[var(--site-accent)] after:opacity-50 after:content-['']">
            Orion Chen
          </span>
          .
        </h1>
        <div className="mt-8 font-mono uppercase sm:mt-10">
          <div className="text-muted-foreground flex items-center gap-2.5 text-[11px] tracking-[0.28em] sm:tracking-[0.35em]">
            <span
              aria-hidden="true"
              className="inline-block size-1.5 animate-pulse rounded-full bg-red-500"
            />
            <span>{dict.home.rec}</span>
          </div>
          <p className="mt-3 text-xs tracking-[0.22em] sm:text-sm sm:tracking-[0.3em] md:text-base">
            {dict.home.watching}
          </p>
        </div>
      </section>

      <section>
        <SectionHeader action={<Link href={`${prefix}/works`}>{dict.home.all}</Link>}>
          {dict.home.worksTitle}
        </SectionHeader>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((work) => (
            <WorkCard key={work.slug} work={work} pathPrefix={prefix} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader action={<Link href={`${prefix}/blog`}>{dict.home.all}</Link>}>
          {dict.home.writingTitle}
        </SectionHeader>
        <div>
          {latest.map((post) => (
            <PostCard key={post.slug} post={post} pathPrefix={prefix} />
          ))}
        </div>
      </section>
    </div>
  )
}
