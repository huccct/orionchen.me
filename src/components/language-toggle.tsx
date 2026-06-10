'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { defaultLocale, locales, localeLabel, type Locale } from '@/i18n/config'
import { buildLocalePath, getLocaleFromPath } from '@/i18n/get-locale'
import type { LocaleAvailability } from '@/i18n/locale-availability-types'

/**
 * Language toggle. Cycles between zh and en while preserving the current
 * page (e.g. /blog/foo <-> /en/blog/foo).
 *
 * Sized to match ThemeToggle (h-4 visual). Uses locale label rather than
 * an icon — a flag would imply a region (US/CN) which the design avoids.
 *
 * `availability` is computed server-side and passed in so per-content
 * URLs without a target-locale counterpart fall back to the list page
 * instead of 404'ing. See [[get-locale]].
 */
export function LanguageToggle({ availability }: { availability: LocaleAvailability }) {
  const pathname = usePathname() ?? '/'
  const current = getLocaleFromPath(pathname)
  const next: Locale = current === defaultLocale ? other(defaultLocale) : defaultLocale
  const href = buildLocalePath(next, pathname, availability)

  return (
    <Link
      href={href}
      hrefLang={next}
      className="hover:text-accent inline-flex h-8 w-8 items-center justify-center font-mono text-xs"
      aria-label={`Switch to ${localeLabel[next]}`}
    >
      {localeLabel[next]}
    </Link>
  )
}

function other(locale: Locale): Locale {
  const found = locales.find((item) => item !== locale)

  if (!found) throw new Error('locales list must contain at least two entries')

  return found
}
