'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LanguageToggle } from './language-toggle'
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
    { href: `${prefix}/blog`, label: dict.nav.writing },
    { href: `${prefix}/works`, label: dict.nav.works },
    { href: `${prefix}/reading`, label: locale === 'zh' ? '阅读' : 'Reading' },
  ]

  return (
    <header className="site-header border-border bg-background relative z-10 border-b">
      <div className="header-inner">
        <Link href={homeHref} className="site-signature shrink-0" aria-label="Orion Chen">
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
          <nav className="site-links" aria-label={locale === 'zh' ? '主导航' : 'Main navigation'}>
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
