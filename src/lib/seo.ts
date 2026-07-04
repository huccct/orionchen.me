import type { Metadata } from 'next'
import type { Post as CollectionPost, Work as CollectionWork } from 'content-collections'
import { htmlLang, type Locale, locales, localePathPrefix } from '@/i18n/config'
import { getLocaleFromPath, stripLocale } from '@/i18n/get-locale'
import { siteConfig } from '@/lib/site-config'

type MetadataOptions = {
  title?: string
  description?: string
  path?: string
  keywords?: string[]
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  tags?: string[]
  noIndex?: boolean
  /**
   * Locales for which the *same logical page* exists (i.e. has a 200
   * response with translated content). Defaults to all locales — correct
   * for shared chrome routes like the home page or list pages, where
   * /foo and /en/foo are both valid. For per-content routes
   * (/blog/[slug], /works/[slug]) pass [post.lang] only — listing a
   * cross-language alternate to a 404 violates Google's hreflang rules.
   */
  availableLocales?: readonly Locale[]
}

type Thing = Record<string, unknown>

const DEFAULT_OG_IMAGE = '/opengraph-image'
const PERSON_ID = `${siteConfig.url}/#person`
const WEBSITE_ID = `${siteConfig.url}/#website`

const OG_LOCALE: Record<string, string> = {
  zh: 'zh_CN',
  en: 'en_US',
}

export function absoluteUrl(path = '/') {
  return new URL(path, siteConfig.url).toString()
}

/**
 * Build the hreflang -> URL map for a given canonical path. Only locales
 * listed in `available` are included — listing a hreflang URL that 404s
 * gets the entry dropped by Google.
 *
 * x-default points at zh when zh is available, otherwise at the first
 * available locale.
 */
function buildLanguageAlternates(
  path: string,
  available: readonly Locale[]
): Record<string, string> {
  const stripped = stripLocale(path)
  const entries: Record<string, string> = {}

  for (const locale of locales) {
    if (!available.includes(locale)) continue

    const prefix = localePathPrefix[locale]
    const localePath = stripped === '/' ? prefix === '' ? '/' : prefix : `${prefix}${stripped}`

    entries[htmlLang[locale]] = absoluteUrl(localePath)
  }

  const fallback = entries[htmlLang.zh] ?? Object.values(entries)[0]

  if (fallback) entries['x-default'] = fallback

  return entries
}

export function createMetadata({
  title,
  description = siteConfig.description,
  path = '/',
  keywords,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  tags,
  noIndex = false,
  availableLocales = locales,
}: MetadataOptions = {}): Metadata {
  const canonical = absoluteUrl(path)
  const ogImage = absoluteUrl(image)
  const locale = getLocaleFromPath(path)
  const languages = buildLanguageAlternates(path, availableLocales)

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    keywords,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    alternates: {
      canonical,
      languages,
      types: {
        'application/rss+xml': absoluteUrl('/rss.xml'),
      },
    },
    openGraph: {
      type,
      url: canonical,
      title: title ?? siteConfig.name,
      description,
      siteName: siteConfig.name,
      locale: OG_LOCALE[locale] ?? 'zh_CN',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title ?? siteConfig.name,
        },
      ],
      ...(type === 'article'
        ? {
            publishedTime,
            modifiedTime,
            authors,
            tags,
          }
        : null),
    },
    twitter: {
      card: 'summary_large_image',
      title: title ?? siteConfig.name,
      description,
      creator: siteConfig.social.xHandle,
      images: [ogImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: true,
          googleBot: {
            index: false,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
  }
}

export function createPersonJsonLd(): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    image: absoluteUrl(siteConfig.defaultOgImage),
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.x,
      siteConfig.social.linkedin,
    ],
    email: siteConfig.email,
    jobTitle: siteConfig.jobTitle,
    description: siteConfig.description,
  }
}

export function createWebSiteJsonLd(locale: Locale = 'zh'): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: htmlLang[locale],
    publisher: {
      '@id': PERSON_ID,
    },
  }
}

export function createBreadcrumbJsonLd(items: Array<{ name: string; path: string }>): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function createCollectionPageJsonLd({
  name,
  description,
  path,
  locale = 'zh',
}: {
  name: string
  description: string
  path: string
  locale?: Locale
}): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: absoluteUrl(path),
    inLanguage: htmlLang[locale],
    isPartOf: {
      '@id': WEBSITE_ID,
    },
    about: {
      '@id': PERSON_ID,
    },
  }
}

export function createBlogPostingJsonLd(post: CollectionPost): Thing {
  const localePath = `${localePathPrefix[post.lang]}/blog/${post.slug}`
  const image = absoluteUrl(`${localePath}/opengraph-image`)

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary ?? siteConfig.description,
    image: [image],
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@id': PERSON_ID,
    },
    publisher: {
      '@id': PERSON_ID,
    },
    mainEntityOfPage: absoluteUrl(localePath),
    url: absoluteUrl(localePath),
    keywords: post.tags ?? [],
    inLanguage: htmlLang[post.lang],
  }
}

export function createWorkJsonLd(work: CollectionWork): Thing {
  const localePath = `${localePathPrefix[work.lang]}/works/${work.slug}`
  const base = {
    '@context': 'https://schema.org',
    name: work.title,
    description: work.summary,
    url: absoluteUrl(localePath),
    image: absoluteUrl(work.cover),
    datePublished: work.publishedAt,
    dateModified: work.updatedAt ?? work.publishedAt,
    keywords: work.tags ?? [],
    creator: {
      '@id': PERSON_ID,
    },
    author: {
      '@id': PERSON_ID,
    },
    inLanguage: htmlLang[work.lang],
  }

  if (work.type === 'documentary') {
    return {
      ...base,
      '@type': 'VideoObject',
      thumbnailUrl: absoluteUrl(work.cover),
    }
  }

  if (work.type === 'code') {
    return {
      ...base,
      '@type': 'SoftwareSourceCode',
      codeRepository: work.links?.repo,
      programmingLanguage: work.meta?.language,
      runtimePlatform: work.meta?.runtime,
    }
  }

  return {
    ...base,
    '@type': 'CreativeWork',
  }
}
