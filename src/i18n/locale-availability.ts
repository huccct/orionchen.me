import 'server-only'

import { allPosts, allWorks } from 'content-collections'
import { type Locale, locales } from './config'
import type { LocaleAvailability } from './locale-availability-types'

/**
 * Build the locale availability manifest from content-collections at
 * request time. The shape is plain JSON so it crosses the RSC boundary
 * without leaking the `content-collections` runtime to the client.
 *
 * The LanguageToggle uses this to avoid sending visitors to a 404 (e.g.
 * clicking EN on a zh-only post) — when the target locale has no content
 * we fall back to the list page in that locale.
 */
export function getLocaleAvailability(): LocaleAvailability {
  const posts = Object.fromEntries(
    locales.map((locale) => [
      locale,
      allPosts
        .filter((post) => !post.draft && post.lang === locale)
        .map((post) => post.slug),
    ])
  ) as Record<Locale, string[]>

  const works = Object.fromEntries(
    locales.map((locale) => [
      locale,
      allWorks
        .filter((work) => work.lang === locale)
        .map((work) => work.slug),
    ])
  ) as Record<Locale, string[]>

  return { posts, works }
}
