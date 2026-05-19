'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'
import { siteConfig } from '@/lib/site-config'

export function GiscusComments({ term = 'Guestbook' }: { term?: string }) {
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
      lang="zh-CN"
      loading="lazy"
    />
  )
}
