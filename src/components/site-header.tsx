import { SiteHeaderClient } from './site-header-client'
import { getLocaleAvailability } from '@/i18n/locale-availability'

/**
 * Server component header so we can compute the locale availability
 * manifest from content-collections without leaking that runtime to the
 * client. Interactive bits (mobile drawer, language toggle, theme
 * toggle) live in their own client components.
 */
export function SiteHeader() {
  const availability = getLocaleAvailability()

  return <SiteHeaderClient availability={availability} />
}
