import { JsonLd } from '@/components/json-ld'
import { SectionHeader } from '@/components/section-header'
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
        <section>
          <SectionHeader>{dict.reading.title}</SectionHeader>
          <div className="max-w-2xl space-y-5">
            <p className="text-muted-foreground font-mono text-xs tracking-[0.24em] uppercase">
              {dict.reading.eyebrow}
            </p>
            <h1 className="font-serif text-4xl leading-[1.08] text-balance sm:text-5xl">
              {dict.reading.headline}
            </h1>
            <p className="text-muted-foreground leading-relaxed">{dict.reading.intro}</p>
          </div>
        </section>

        <ol className="grid gap-x-10 gap-y-5 md:grid-cols-2">
          {dict.about.readingItems.map((item, index) => (
            <li key={item.title} className="border-border border-t pt-4">
              <div className="flex items-start justify-between gap-4">
                <a
                  href={item.href}
                  className="text-accent font-serif text-xl leading-snug"
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.title}
                </a>
                <span className="text-muted-foreground shrink-0 font-mono text-[10px] tracking-wider">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{item.note}</p>
            </li>
          ))}
        </ol>
      </div>
    </>
  )
}
