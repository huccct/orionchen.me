import type { MetadataRoute } from 'next'
import { allPosts, allWorks } from 'content-collections'
import { siteConfig } from '@/lib/site-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url
  const staticRoutes = ['', '/works', '/blog', '/tags', '/guestbook', '/about'].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: 'monthly' as const,
  }))
  const posts = allPosts
    .filter((post) => !post.draft)
    .map((post) => ({ url: `${baseUrl}/blog/${post.slug}`, lastModified: post.date }))
  const works = allWorks.map((work) => ({
    url: `${baseUrl}/works/${work.slug}`,
    lastModified: work.publishedAt,
  }))

  return [...staticRoutes, ...posts, ...works]
}
