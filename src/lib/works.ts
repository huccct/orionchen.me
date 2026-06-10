import { allWorks } from 'content-collections'
import type { Locale } from '@/i18n/config'

const VISIBLE_WORK_SLUGS = ['documentary-ep01'] as const
const DEFAULT_LOCALE: Locale = 'zh'

export function getVisibleWorks(locale: Locale = DEFAULT_LOCALE) {
  const order = new Map(VISIBLE_WORK_SLUGS.map((slug, index) => [slug, index]))

  return allWorks
    .filter(
      (work) =>
        order.has(work.slug as (typeof VISIBLE_WORK_SLUGS)[number]) && work.lang === locale
    )
    .toSorted((a, b) => {
      const aIndex = order.get(a.slug as (typeof VISIBLE_WORK_SLUGS)[number]) ?? Number.MAX_SAFE_INTEGER
      const bIndex = order.get(b.slug as (typeof VISIBLE_WORK_SLUGS)[number]) ?? Number.MAX_SAFE_INTEGER

      return aIndex - bIndex
    })
}

export function getVisibleWorkSlugs() {
  return new Set(VISIBLE_WORK_SLUGS)
}

export function getWorkBySlug(slug: string, locale: Locale = DEFAULT_LOCALE) {
  return allWorks.find((work) => work.slug === slug && work.lang === locale) ?? null
}
