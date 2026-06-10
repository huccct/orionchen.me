import { defaultLocale, isLocale, localePathPrefix, type Locale } from './config'

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
 */
export function buildLocalePath(locale: Locale, pathname: string): string {
  const stripped = stripLocale(pathname)
  const prefix = localePathPrefix[locale]

  if (!prefix) return stripped

  return stripped === '/' ? prefix : `${prefix}${stripped}`
}
