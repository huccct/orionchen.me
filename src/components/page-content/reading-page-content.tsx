import { RoomHeader } from '@/components/room-header'
import { JsonLd } from '@/components/json-ld'
import { ArrowUpRight } from 'lucide-react'
import type { Locale } from '@/i18n/config'
import { localePathPrefix } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import { createBreadcrumbJsonLd, createCollectionPageJsonLd } from '@/lib/seo'

export function ReadingPageContent({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale)
  const prefix = localePathPrefix[locale]

  return (
    <>
      <JsonLd
        data={[
          createCollectionPageJsonLd({
            name: dict.reading.title,
            description: dict.site.readingDescription,
            path: `${prefix}/reading`,
            locale,
          }),
          createBreadcrumbJsonLd([
            { name: dict.breadcrumb.home, path: prefix === '' ? '/' : prefix },
            { name: dict.breadcrumb.reading, path: `${prefix}/reading` },
          ]),
        ]}
      />

      <div className="mx-auto max-w-4xl space-y-10">
        <RoomHeader room="reading" locale={locale} />
        <p className="text-muted-foreground max-w-2xl leading-relaxed">{dict.reading.intro}</p>
        <div className="book-shelf">
          {dict.about.readingItems.map((item) => (
            <details key={item.title}>
              <summary>
                <div>
                  <h2>{item.title}</h2>
                  <span>
                    {locale === 'zh' ? '翻开，看看推荐理由' : 'Open to read why it stayed with me'}
                  </span>
                </div>
              </summary>
              <p>{item.note}</p>
              <a href={item.href} target="_blank" rel="noreferrer">
                {locale === 'zh' ? '查看这本书（新窗口）' : 'View book (new window)'}
                <ArrowUpRight size={15} />
              </a>
            </details>
          ))}
        </div>
      </div>
    </>
  )
}
