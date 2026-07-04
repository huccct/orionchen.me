'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'
import type { Locale } from '@/i18n/config'
import { siteConfig } from '@/lib/site-config'

export function GiscusComments({
  locale,
  term = 'Guestbook',
}: {
  locale: Locale
  term?: string
}) {
  const { resolvedTheme } = useTheme()

  return (
    <Giscus
      repo={siteConfig.giscus.repo}
      repoId={siteConfig.giscus.repoId}
      category={siteConfig.giscus.category}
      categoryId={siteConfig.giscus.categoryId}
      mapping="specific"
      term={term}
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      lang={locale === 'zh' ? 'zh-CN' : 'en'}
      loading="lazy"
    />
  )
}
