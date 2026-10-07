'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { localePathPrefix } from '@/i18n/config'
import { usePathname } from 'next/navigation'
import { getDictionary } from '@/i18n/get-dictionary'
import { getLocaleFromPath } from '@/i18n/get-locale'
import { siteConfig } from '@/lib/site-config'

export function SiteFooter() {
  const pathname = usePathname() ?? '/'
  const locale = getLocaleFromPath(pathname)
  const dict = getDictionary(locale)

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="flex flex-wrap items-center gap-5">
          <Link
            className="inline-flex min-h-11 items-center gap-2"
            href={localePathPrefix[locale] || '/'}
          >
            <ArrowLeft size={14} />
            {locale === 'zh' ? '回到首页' : 'Home'}
          </Link>
          <span>{`${new Date().getFullYear()} · ${siteConfig.name}`}</span>
        </div>
        <span className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href={`${localePathPrefix[locale]}/about`}>{dict.nav.about}</Link>
          <Link href={`${localePathPrefix[locale]}/guestbook`}>{dict.nav.guestbook}</Link>
          <a href={siteConfig.social.github}>{dict.footer.github}</a>
          <a href={siteConfig.social.x}>{dict.footer.x}</a>
          <a href={`mailto:${siteConfig.email}`}>{dict.footer.email}</a>
        </span>
      </div>
    </footer>
  )
}
