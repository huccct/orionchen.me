import { allPosts } from 'content-collections'
import { type Locale, locales } from '@/i18n/config'

export const POSTS_PER_PAGE = 10

export type PublishedPost = (typeof allPosts)[number]

/**
 * Default locale used when callers don't pass one. Mirrors the i18n
 * config default — kept as a string literal to avoid an import cycle
 * with i18n/config in older code paths.
 */
const DEFAULT_LOCALE: Locale = 'zh'

export function getPublishedPosts(locale: Locale = DEFAULT_LOCALE) {
  return allPosts
    .filter((post) => !post.draft && post.lang === locale)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getPublishedPost(slug: string, locale: Locale = DEFAULT_LOCALE) {
  return getPublishedPosts(locale).find((post) => post.slug === slug) ?? null
}

export function getPublishedPostsByTag(tag: string, locale: Locale = DEFAULT_LOCALE) {
  return getPublishedPosts(locale).filter((post) => (post.tags ?? []).includes(tag))
}

export function getPublishedTags(locale: Locale = DEFAULT_LOCALE) {
  const counts = new Map<string, number>()

  for (const post of getPublishedPosts(locale)) {
    for (const tag of post.tags ?? []) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }

  return counts
}

export function getBlogPageCount(posts?: PublishedPost[]) {
  const list = posts ?? getPublishedPosts()

  return Math.max(1, Math.ceil(list.length / POSTS_PER_PAGE))
}

export function getBlogPagePosts(page: number, posts?: PublishedPost[]) {
  const list = posts ?? getPublishedPosts()
  const start = (page - 1) * POSTS_PER_PAGE

  return list.slice(start, start + POSTS_PER_PAGE)
}

export function getBlogPageHref(page: number, prefix = '') {
  return page <= 1 ? `${prefix}/blog` : `${prefix}/blog/page/${page}`
}

export function getPostWithNeighbors(slug: string, locale: Locale = DEFAULT_LOCALE) {
  const posts = getPublishedPosts(locale)
  const index = posts.findIndex((post) => post.slug === slug)

  if (index === -1) {
    return {
      post: null,
      newerPost: null,
      olderPost: null,
    }
  }

  return {
    post: posts[index] ?? null,
    newerPost: posts[index - 1] ?? null,
    olderPost: posts[index + 1] ?? null,
  }
}

/**
 * Locales for which a published post with this slug exists. Used by the
 * per-post route to emit hreflang alternates only for URLs that 200 —
 * Google drops the entry otherwise. See `createMetadata.availableLocales`.
 */
export function getPostAvailableLocales(slug: string): Locale[] {
  return locales.filter((locale) =>
    allPosts.some((post) => !post.draft && post.lang === locale && post.slug === slug)
  )
}
