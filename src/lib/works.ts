import { allWorks } from 'content-collections'

const VISIBLE_WORK_SLUGS = ['documentary-ep01'] as const

export function getVisibleWorks() {
  const order = new Map(VISIBLE_WORK_SLUGS.map((slug, index) => [slug, index]))

  return allWorks
    .filter((work) => order.has(work.slug as (typeof VISIBLE_WORK_SLUGS)[number]))
    .toSorted((a, b) => {
      const aIndex = order.get(a.slug as (typeof VISIBLE_WORK_SLUGS)[number]) ?? Number.MAX_SAFE_INTEGER
      const bIndex = order.get(b.slug as (typeof VISIBLE_WORK_SLUGS)[number]) ?? Number.MAX_SAFE_INTEGER

      return aIndex - bIndex
    })
}

export function getVisibleWorkSlugs() {
  return new Set(VISIBLE_WORK_SLUGS)
}

export function getWorkBySlug(slug: string) {
  return allWorks.find((work) => work.slug === slug) ?? null
}
