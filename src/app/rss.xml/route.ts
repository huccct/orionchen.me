import { allPosts } from 'content-collections'
import { localePathPrefix } from '@/i18n/config'
import { siteConfig } from '@/lib/site-config'

export const dynamic = 'force-static'

function cdata(value: string) {
  return `<![CDATA[${value.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`
}

function xmlEscape(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function GET() {
  const posts = allPosts
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 50)

  const items = posts
    .map((post) => {
      // URL must include the locale prefix for non-default locales,
      // otherwise EN posts would link to /blog/<slug> which 404s.
      const url = `${siteConfig.url}${localePathPrefix[post.lang]}/blog/${post.slug}`

      return `
    <item>
      <title>${cdata(post.title)}</title>
      <link>${xmlEscape(url)}</link>
      <guid>${xmlEscape(url)}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${cdata(post.summary ?? '')}</description>
      <author>${xmlEscape(siteConfig.email)} (${xmlEscape(siteConfig.name)})</author>
    </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>${xmlEscape(siteConfig.name)}</title>
  <link>${xmlEscape(siteConfig.url)}</link>
  <description>${xmlEscape(siteConfig.description)}</description>
  <language>zh-CN</language>
  ${items}
</channel></rss>`

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } })
}
