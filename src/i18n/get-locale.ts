import { defaultLocale, isLocale, localePathPrefix, type Locale } from './config'
import type { LocaleAvailability } from './locale-availability-types'

/**
 * Derive locale from a URL pathname. zh is the default — anything that does
 * not start with a non-default locale prefix resolves to zh.
 */
export function getLocaleFromPath(pathname: string): Locale {
  const segment = pathname.split('/')[1] ?? ''

  if (isLocale(segment) && segment !== defaultLocale) return segment

  return defaultLocale
}

/**
 * Strip the locale prefix from a pathname. `/en/blog/foo` -> `/blog/foo`,
 * `/blog/foo` -> `/blog/foo`. The result always starts with `/`.
 */
export function stripLocale(pathname: string): string {
  const locale = getLocaleFromPath(pathname)
  const prefix = localePathPrefix[locale]

  if (prefix && pathname.startsWith(prefix)) {
    const rest = pathname.slice(prefix.length)

    return rest.startsWith('/') ? rest : `/${rest}`
  }

  return pathname.startsWith('/') ? pathname : `/${pathname}`
}

/**
 * Build a path for a given locale. Used by the language toggle so the
 * visitor stays on the same logical page when switching languages.
 *
 * If `availability` is provided and the current path points at per-content
 * (e.g. `/blog/<slug>`, `/works/<slug>`) for which the target locale has
 * no content, we fall back to the list page in that locale to avoid a 404.
 */
export function buildLocalePath(
  locale: Locale,
  pathname: string,
  availability?: LocaleAvailability
): string {
  const stripped = stripLocale(pathname)
  const prefix = localePathPrefix[locale]
  const target = stripped === '/' ? prefix || '/' : `${prefix}${stripped}`

  if (!availability) return target

  const fallback = checkAvailability(stripped, locale, availability)

  if (fallback) return stripped === '/' ? prefix || '/' : `${prefix}${fallback}`

  return target
}

/**
 * Returns a fallback path (without locale prefix) when the target locale
 * has no matching content for a per-content URL. Returns null when the
 * direct mapping is fine.
 */
function checkAvailability(
  strippedPath: string,
  target: Locale,
  availability: LocaleAvailability
): string | null {
  // SSR on a 404 response sets pathname to `/_not-found`; sending the
  // visitor to `/en/_not-found` is silly. Send them to the locale root.
  if (strippedPath === '/_not-found') return '/'

  const postMatch = /^\/blog\/([^/]+)$/.exec(strippedPath)

  if (postMatch) {
    const slug = decodeURIComponent(postMatch[1]!)

    if (!availability.posts[target].includes(slug)) return '/blog'

    return null
  }

  const workMatch = /^\/works\/([^/]+)$/.exec(strippedPath)

  if (workMatch) {
    const slug = decodeURIComponent(workMatch[1]!)

    if (!availability.works[target].includes(slug)) return '/works'

    return null
  }

  // Tag pages: when target locale has no posts under that tag the index
  // is the safe fallback. Cheaper to always send visitors to /tags than
  // to plumb tag→locale availability.
  const tagMatch = /^\/tags\/([^/]+)$/.exec(strippedPath)

  if (tagMatch) {
    const hasAnyPost = availability.posts[target].length > 0

    if (!hasAnyPost) return '/blog'

    return null
  }

  return null
}
