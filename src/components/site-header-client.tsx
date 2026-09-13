'use client'

import Link from 'next/link'
import Image from 'next/image'
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
      href: `${prefix}/reading`,
      label: locale === 'zh' ? '阅读' : 'Reading',
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
    <header className="site-header border-border bg-background relative z-10 border-b">
      <div className="header-inner mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 md:px-8 md:py-4">
        <Link
          href={homeHref}
          className="site-signature shrink-0"
          style={{ display: 'block', width: 'clamp(165px, 22vw, 220px)' }}
          aria-label="Orion Chen"
        >
          <Image
            src="/images/posts/orionchen.svg"
            alt="Orion Chen"
            width={540}
            height={86}
            style={{ width: '100%', height: 'auto' }}
            loading="eager"
            unoptimized
          />
        </Link>
        <div className="flex items-center gap-1 sm:gap-3">
          <div className="sm:hidden">
            <SiteHeaderMobileNav nav={nav} openLabel={dict.nav.openMenu} />
          </div>
          <nav className="hidden items-center gap-3 text-sm sm:flex md:gap-6">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? 'page'
                    : undefined
                }
                className="hover:text-accent"
              >
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
