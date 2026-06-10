import type { Metadata } from 'next'
import Link from 'next/link'
import { SectionHeader } from '@/components/section-header'
import { getDictionary } from '@/i18n/get-dictionary'
import { siteConfig } from '@/lib/site-config'
import { createMetadata } from '@/lib/seo'

const dict = getDictionary('en')

export const metadata: Metadata = createMetadata({
  title: dict.about.title,
  path: '/en/about',
})

/**
 * Placeholder English /about. The Chinese /about contains author-specific
 * cadence ("还没到第五幕", "麻将馆的阿姨") that machine translation would
 * flatten — see docs/superpowers/specs/2026-06-10-i18n-unfreeze.md §4.
 *
 * Replace this with a deliberate English self-introduction when the
 * author is ready.
 */
export default function EnAboutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-12">
      <section>
        <SectionHeader>{dict.about.title}</SectionHeader>
        <div className="space-y-5 text-base leading-relaxed">
          <p>
            I&apos;m Orion Chen — engineer, writer, and aspiring documentarian. This
            English page is a placeholder; the {' '}
            <Link href="/about" className="text-accent">
              Chinese version
            </Link>{' '}
            has the longer story.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader>{dict.about.contactTitle}</SectionHeader>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li>
            {dict.about.contactEmail} —{' '}
            <a href={`mailto:${siteConfig.email}`} className="text-accent">
              {siteConfig.email}
            </a>
          </li>
          <li>
            {dict.about.contactGithub} —{' '}
            <a
              href={siteConfig.social.github}
              className="text-accent"
              target="_blank"
              rel="noreferrer"
            >
              {siteConfig.social.github.replace('https://', '')}
            </a>
          </li>
          <li>
            {dict.about.contactX} —{' '}
            <a href={siteConfig.social.x} className="text-accent" target="_blank" rel="noreferrer">
              {siteConfig.social.x.replace('https://', '')}
            </a>
          </li>
        </ul>
      </section>
    </div>
  )
}
