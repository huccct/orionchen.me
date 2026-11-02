import type { Locale } from './config'

/**
 * Plain type (no runtime imports) for crossing the server→client boundary.
 * Computed in `locale-availability.ts` (server-only) and serialized to a
 * client component for the LanguageToggle.
 */
export type LocaleAvailability = {
  learning?: Record<Locale, string[]>
  posts: Record<Locale, string[]>
  works: Record<Locale, string[]>
}
