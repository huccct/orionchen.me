import type { MetadataRoute } from 'next'
import { allPosts, allWorks } from 'content-collections'
import { htmlLang, locales, localePathPrefix } from '@/i18n/config'
import { siteConfig } from '@/lib/site-config'

type SitemapEntry = MetadataRoute.Sitemap[number]

const baseUrl = siteConfig.url

function url(path: string) {
  return `${baseUrl}${path}`
}

/**
 * Build a sitemap entry that lists all locale variants under
 * `alternates.languages` so search engines understand the language pairing.
 * `pathFor(locale)` returns the URL path for that locale.
 */
function withAlternates(
  base: SitemapEntry,
  pathFor: (locale: 'zh' | 'en') => string | null
): SitemapEntry {
  const languages: Record<string, string> = {}

  for (const locale of locales) {
    const localePath = pathFor(locale)

    if (localePath) languages[htmlLang[locale]] = url(localePath)
  }

  if (languages[htmlLang.zh]) languages['x-default'] = languages[htmlLang.zh]!

  return {
    ...base,
    alternates: { languages },
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastPostDate = allPosts
    .filter((post) => !post.draft)
    .map((post) => post.date)
    .sort((a, b) => b.localeCompare(a))[0]

  type StaticEntry = {
    path: string
    priority: number
    changeFrequency: 'weekly' | 'monthly'
    lastModified?: string
  }

  const staticPages = (
    [
      { path: '', priority: 1, changeFrequency: 'weekly', lastModified: lastPostDate },
      { path: '/works', priority: 0.8, changeFrequency: 'monthly' },
      {
        path: '/blog',
        priority: 0.9,
        changeFrequency: 'weekly',
        lastModified: lastPostDate,
      },
      { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
    ] satisfies StaticEntry[]
  ).flatMap((entry): SitemapEntry[] =>
    locales.map((locale) =>
      withAlternates(
        {
          url: url(`${localePathPrefix[locale]}${entry.path === '' ? '' : entry.path}`),
          changeFrequency: entry.changeFrequency,
          priority: entry.priority,
          lastModified: entry.lastModified,
        },
        (alt) => `${localePathPrefix[alt]}${entry.path === '' ? '' : entry.path}`
      )
    )
  )

  const posts: SitemapEntry[] = allPosts
    .filter((post) => !post.draft)
    .map((post) => {
      const localePath = `${localePathPrefix[post.lang]}/blog/${post.slug}`

      return withAlternates(
        {
          url: url(localePath),
          lastModified: post.date,
          changeFrequency: 'monthly' as const,
          priority: 0.8,
          images: [url(`/blog/${post.slug}/opengraph-image`)],
        },
        // Each post belongs to exactly one locale; the alternate map only
        // lists that locale (no fake cross-language pairing).
        (alt) => (alt === post.lang ? localePath : null)
      )
    })

  const works: SitemapEntry[] = allWorks
    .filter((work) => work.hasDetail)
    .map((work) => {
      const localePath = `${localePathPrefix[work.lang]}/works/${work.slug}`

      return withAlternates(
        {
          url: url(localePath),
          lastModified: work.updatedAt ?? work.publishedAt,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
          images: [url(work.cover)],
        },
        (alt) => (alt === work.lang ? localePath : null)
      )
    })

  return [...staticPages, ...posts, ...works]
}
