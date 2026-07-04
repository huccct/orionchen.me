import Link from 'next/link'
import { JsonLd } from '@/components/json-ld'
import { SectionHeader } from '@/components/section-header'
import { WorksFilter } from '@/components/works-filter'
import { defaultLocale, type Locale } from '@/i18n/config'
import { localePathPrefix } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import { createBreadcrumbJsonLd, createCollectionPageJsonLd } from '@/lib/seo'
import { getVisibleWorks } from '@/lib/works'

export function WorksListPageContent({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale)
  const prefix = localePathPrefix[locale]
  const works = getVisibleWorks(locale)

  return (
    <>
      <JsonLd
        data={[
          createCollectionPageJsonLd({
            name: dict.works.title,
            description: dict.site.worksDescription,
            path: `${prefix}/works`,
            locale,
          }),
          createBreadcrumbJsonLd([
            { name: dict.breadcrumb.home, path: prefix === '' ? '/' : prefix },
            { name: dict.breadcrumb.works, path: `${prefix}/works` },
          ]),
        ]}
      />
      <div>
        <SectionHeader>{dict.works.title}</SectionHeader>
        {works.length === 0 && locale !== defaultLocale ? (
          <p className="text-muted-foreground text-sm">
            {dict.works.emptyEnglish}{' '}
            <Link href="/works" className="text-accent">
              {dict.works.emptyEnglishLink}
            </Link>
          </p>
        ) : (
          <WorksFilter dict={dict} works={works} pathPrefix={prefix} />
        )}
      </div>
    </>
  )
}
