import type { MetadataRoute } from 'next'
import { allPosts } from 'content-collections'
import { siteConfig } from '@/lib/site-config'
import { getVisibleWorks } from '@/lib/works'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url
  const lastPostDate = allPosts
    .filter((post) => !post.draft)
    .map((post) => post.date)
    .sort((a, b) => b.localeCompare(a))[0]
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      changeFrequency: 'weekly' as const,
      priority: 1,
      lastModified: lastPostDate,
    },
    {
      url: `${baseUrl}/works`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      lastModified: lastPostDate,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]
  const posts = allPosts
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.date,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      images: [`${baseUrl}/blog/${post.slug}/opengraph-image`],
    }))
  const works = getVisibleWorks()
    .filter((work) => work.hasDetail)
    .map((work) => ({
      url: `${baseUrl}/works/${work.slug}`,
      lastModified: work.updatedAt ?? work.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      images: [`${baseUrl}${work.cover}`],
    }))

  return [...staticRoutes, ...posts, ...works].filter((entry) => Boolean(entry.lastModified ?? true))
}
