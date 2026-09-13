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
    <footer className="town-footer border-border mt-16 border-t">
      <div className="text-muted-foreground mx-auto flex max-w-5xl flex-col justify-between gap-4 px-4 py-8 font-mono text-xs sm:px-6 md:flex-row md:px-8">
        <div className="flex flex-wrap items-center gap-5">
          <Link
            className="inline-flex min-h-11 items-center gap-2"
            href={localePathPrefix[locale] || '/'}
          >
            <ArrowLeft size={14} />
            {locale === 'zh' ? '回小镇逛逛' : 'Back to the town'}
          </Link>
          <span>{`${new Date().getFullYear()} · ${siteConfig.name}`}</span>
        </div>
        <span className="flex flex-wrap gap-x-4 gap-y-2">
          <a href={siteConfig.social.github}>{dict.footer.github}</a>
          <a href={siteConfig.social.x}>{dict.footer.x}</a>
          <a href={`mailto:${siteConfig.email}`}>{dict.footer.email}</a>
        </span>
      </div>
    </footer>
  )
}
