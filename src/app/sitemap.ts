import type { MetadataRoute } from 'next'
import { allPosts, allWorks } from 'content-collections'
import { getBlogPageCount } from '@/lib/posts'
import { siteConfig } from '@/lib/site-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url
  const staticRoutes = ['', '/works', '/blog', '/tags', '/guestbook', '/about'].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: 'monthly' as const,
  }))
  const blogPages = Array.from({ length: Math.max(0, getBlogPageCount() - 1) }, (_, index) => ({
    url: `${baseUrl}/blog/page/${index + 2}`,
    changeFrequency: 'monthly' as const,
  }))
  const posts = allPosts
    .filter((post) => !post.draft)
    .map((post) => ({ url: `${baseUrl}/blog/${post.slug}`, lastModified: post.date }))
  const works = allWorks.map((work) => ({
    url: `${baseUrl}/works/${work.slug}`,
    lastModified: work.publishedAt,
  }))

  return [...staticRoutes, ...blogPages, ...posts, ...works]
}
