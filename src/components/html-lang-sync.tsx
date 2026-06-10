'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { htmlLang } from '@/i18n/config'
import { getLocaleFromPath } from '@/i18n/get-locale'

/**
 * Sync `<html lang>` with the active locale on client-side navigation.
 *
 * Trade-off: the server-rendered HTML always has lang='zh-CN' (the default
 * shipped by RootLayout). This means the very first HTML served for an
 * /en/* route reaches the crawler with lang='zh-CN' before this effect
 * runs. Acceptable because:
 *  1. hreflang alternates + canonical (added in Phase 5.1) are the
 *     authoritative signals for language relationships in modern SEO.
 *  2. The dictionary content (page bodies, metadata.description) is
 *     already English on /en/*, which Google reads regardless of the
 *     <html lang> attribute.
 *  3. Avoiding headers() / dynamic rendering keeps every route SSG.
 *
 * If a future audit shows the lang mismatch hurting indexing, switch to
 * a proxy.ts + headers() approach (cost: every page becomes SSR).
 */
export function HtmlLangSync() {
  const pathname = usePathname() ?? '/'

  useEffect(() => {
    const locale = getLocaleFromPath(pathname)
    document.documentElement.lang = htmlLang[locale]
  }, [pathname])

  return null
}
