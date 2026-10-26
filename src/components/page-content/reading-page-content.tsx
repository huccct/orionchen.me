import Image from 'next/image'
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

      <div className="archive-page reading-page">
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
                <Image
                  src={item.cover}
                  alt={locale === 'zh' ? `${item.title}封面` : `Cover of ${item.title}`}
                  fill
                  sizes="(max-width: 767px) 105px, 118px"
                />
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
      </div>
    </>
  )
}
