import Link from 'next/link'
import { LanguageToggle } from './language-toggle'
import { ThemeToggle } from './theme-toggle'
import { SiteHeaderMobileNav } from './site-header-mobile-nav'
import { getLocaleAvailability } from '@/i18n/locale-availability'

const NAV = [
  {
    href: '/works',
    label: 'Works',
  },
  {
    href: '/blog',
    label: 'Writing',
  },
  {
    href: '/guestbook',
    label: 'Guestbook',
  },
  {
    href: '/about',
    label: 'About',
  },
]

/**
 * Server component header so we can compute the locale availability
 * manifest from content-collections without leaking that runtime to the
 * client. Interactive bits (mobile drawer, language toggle, theme
 * toggle) live in their own client components.
 */
export function SiteHeader() {
  const availability = getLocaleAvailability()

  return (
    <header className="border-border bg-background/85 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 md:px-8 md:py-4">
        <Link href="/" className="hover:text-accent shrink-0 font-mono text-sm">
          orionchen.me
        </Link>
        <div className="flex items-center gap-1 sm:gap-3">
          <div className="sm:hidden">
            <SiteHeaderMobileNav nav={NAV} />
          </div>
          <nav className="hidden items-center gap-3 text-sm sm:flex md:gap-6">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-accent">
                {item.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
          <LanguageToggle availability={availability} />
        </div>
      </div>
    </header>
  )
}
