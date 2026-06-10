import { JsonLd } from '@/components/json-ld'
import { SectionHeader } from '@/components/section-header'
import { WorksFilter } from '@/components/works-filter'
import type { Locale } from '@/i18n/config'
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
          }),
          createBreadcrumbJsonLd([
            { name: dict.breadcrumb.home, path: prefix === '' ? '/' : prefix },
            { name: dict.breadcrumb.works, path: `${prefix}/works` },
          ]),
        ]}
      />
      <div>
        <SectionHeader>{dict.works.title}</SectionHeader>
        <WorksFilter works={works} pathPrefix={prefix} />
      </div>
    </>
  )
}
