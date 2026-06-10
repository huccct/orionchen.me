import Link from 'next/link'
import { JsonLd } from '@/components/json-ld'
import { SectionHeader } from '@/components/section-header'
import type { Locale } from '@/i18n/config'
import { localePathPrefix } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import { getPublishedTags } from '@/lib/posts'
import { createBreadcrumbJsonLd, createCollectionPageJsonLd } from '@/lib/seo'

export function TagsListPageContent({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale)
  const prefix = localePathPrefix[locale]
  const sorted = [...getPublishedTags().entries()].sort((a, b) => b[1] - a[1])

  return (
    <>
      <JsonLd
        data={[
          createCollectionPageJsonLd({
            name: dict.blog.tagsTitle,
            description: dict.site.tagsDescription,
            path: `${prefix}/tags`,
          }),
          createBreadcrumbJsonLd([
            { name: dict.breadcrumb.home, path: prefix === '' ? '/' : prefix },
            { name: dict.breadcrumb.tags, path: `${prefix}/tags` },
          ]),
        ]}
      />
      <div>
        <SectionHeader>{dict.blog.tagsTitle}</SectionHeader>
        <div className="flex flex-wrap gap-2 font-mono text-sm">
          {sorted.map(([tag, count]) => (
            <Link
              key={tag}
              href={`${prefix}/tags/${encodeURIComponent(tag)}`}
              className="border-border hover:text-accent rounded-sm border px-2 py-1"
            >
              {tag} <span className="text-muted-foreground">{count}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
