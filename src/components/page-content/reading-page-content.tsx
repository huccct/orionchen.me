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

      <div className="reading-page mx-auto max-w-4xl">
        <RoomHeader room="reading" locale={locale} />
        <p className="text-muted-foreground max-w-2xl leading-relaxed">{dict.reading.intro}</p>
        <div className="book-shelf">
          {dict.about.readingItems.map((item) => (
            <article className="reading-book" key={item.href}>
              <a
                className="reading-book-cover"
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${item.title}${locale === 'zh' ? '（新窗口）' : ' (new window)'}`}
              >
                <span className="reading-book-title">{item.title}</span>
                <span className="reading-book-rule" aria-hidden="true" />
                <span className="reading-book-imprint" aria-hidden="true">
                  Orion’s bookshelf
                </span>
              </a>
              <div className="reading-book-note">
                <h2>{item.title}</h2>
                <p>{item.note}</p>
                <a href={item.href} target="_blank" rel="noreferrer">
                  {locale === 'zh' ? '了解这本书' : 'Explore this book'}
                  <ArrowUpRight size={14} />
                  <span className="sr-only">
                    {locale === 'zh' ? '（新窗口）' : ' (new window)'}
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
        <p className="reading-colophon">
          {locale === 'zh'
            ? '封面为本站书名排版，非原版书封。'
            : 'Covers are typographic interpretations, not publisher artwork.'}
        </p>
      </div>
    </>
  )
}
