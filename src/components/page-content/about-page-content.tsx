import { SectionHeader } from '@/components/section-header'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import { siteConfig } from '@/lib/site-config'

export function AboutPageContent({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale)

  return (
    <div className="mx-auto max-w-4xl space-y-14">
      <section>
        <SectionHeader>{dict.about.title}</SectionHeader>
        <div className="grid gap-8 md:grid-cols-[1fr_13rem] md:items-end">
          <div className="space-y-6">
            <p className="text-muted-foreground font-mono text-xs tracking-[0.24em] uppercase">
              {dict.about.eyebrow}
            </p>
            <h1 className="font-serif text-4xl leading-[1.08] text-balance sm:text-5xl md:text-6xl">
              {dict.about.headline}
            </h1>
            <div className="max-w-2xl space-y-4 text-base leading-relaxed">
              <p>{dict.about.intro1}</p>
              <p className="text-muted-foreground">
                {dict.about.intro2Prefix}{' '}
                <a
                  href={siteConfig.social.bilibili}
                  className="text-accent font-serif italic"
                  target="_blank"
                  rel="noreferrer"
                >
                  {dict.about.intro2Link}
                </a>
                {dict.about.intro2Suffix}
              </p>
            </div>
          </div>

          <aside className="border-border text-muted-foreground border-t pt-4 font-mono text-xs leading-relaxed md:border-t-0 md:border-l md:pt-0 md:pl-5">
            <p className="text-foreground mb-2 text-sm">Orion Chen</p>
            <p>{dict.about.role}</p>
            <p>{dict.about.location}</p>
            <p className="mt-4">
              <a
                href={siteConfig.social.bilibili}
                className="text-accent"
                target="_blank"
                rel="noreferrer"
              >
                {dict.about.intro2Link}
              </a>
            </p>
          </aside>
        </div>
      </section>

      <section>
        <SectionHeader>{dict.about.coordinatesTitle}</SectionHeader>
        <div className="grid gap-5 md:grid-cols-3">
          {dict.about.lenses.map((item) => (
            <div key={item.label} className="border-border border-t pt-4">
              <p className="text-muted-foreground mb-4 font-mono text-xs">{item.label}</p>
              <h2 className="font-serif text-xl leading-snug">{item.title}</h2>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>{dict.about.readingTitle}</SectionHeader>
        <ul className="grid gap-x-8 gap-y-3 text-sm md:grid-cols-2">
          {dict.about.readingItems.map((item) => (
            <li key={item.title} className="border-border border-t pt-3">
              <a href={item.href} className="text-accent" target="_blank" rel="noreferrer">
                {item.title}
              </a>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{item.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionHeader>{dict.about.contactTitle}</SectionHeader>
        <div className="text-muted-foreground flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
          <a href={`mailto:${siteConfig.email}`} className="text-accent">
            {dict.about.contactEmail}
            <span className="text-muted-foreground ml-2 font-sans">{siteConfig.email}</span>
          </a>
          <a
            href={siteConfig.social.github}
            className="text-accent"
            target="_blank"
            rel="noreferrer"
          >
            {dict.about.contactGithub}
            <span className="text-muted-foreground ml-2 font-sans">
              {siteConfig.social.github.replace('https://', '')}
            </span>
          </a>
          <a href={siteConfig.social.x} className="text-accent" target="_blank" rel="noreferrer">
            {dict.about.contactX}
            <span className="text-muted-foreground ml-2 font-sans">
              {siteConfig.social.x.replace('https://', '')}
            </span>
          </a>
        </div>
      </section>
    </div>
  )
}
