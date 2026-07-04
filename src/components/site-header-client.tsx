'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LanguageToggle } from './language-toggle'
import { SiteHeaderMobileNav } from './site-header-mobile-nav'
import { ThemeToggle } from './theme-toggle'
import { localePathPrefix } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import { getLocaleFromPath } from '@/i18n/get-locale'
import type { LocaleAvailability } from '@/i18n/locale-availability-types'

export function SiteHeaderClient({ availability }: { availability: LocaleAvailability }) {
  const pathname = usePathname() ?? '/'
  const locale = getLocaleFromPath(pathname)
  const dict = getDictionary(locale)
  const prefix = localePathPrefix[locale]
  const homeHref = prefix || '/'
  const nav = [
    {
      href: `${prefix}/works`,
      label: dict.nav.works,
    },
    {
      href: `${prefix}/blog`,
      label: dict.nav.writing,
    },
    {
      href: `${prefix}/guestbook`,
      label: dict.nav.guestbook,
    },
    {
      href: `${prefix}/about`,
      label: dict.nav.about,
    },
  ]

  return (
    <header className="border-border bg-background/85 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 md:px-8 md:py-4">
        <Link href={homeHref} className="hover:text-accent shrink-0 font-mono text-sm">
          orionchen.me
        </Link>
        <div className="flex items-center gap-1 sm:gap-3">
          <div className="sm:hidden">
            <SiteHeaderMobileNav nav={nav} openLabel={dict.nav.openMenu} />
          </div>
          <nav className="hidden items-center gap-3 text-sm sm:flex md:gap-6">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-accent">
                {item.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle label={dict.common.toggleTheme} />
          <LanguageToggle availability={availability} />
        </div>
      </div>
    </header>
  )
}
