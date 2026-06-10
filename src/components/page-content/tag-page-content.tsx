import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/json-ld'
import { PostCard } from '@/components/post-card'
import { SectionHeader } from '@/components/section-header'
import type { Locale } from '@/i18n/config'
import { localePathPrefix } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import { getPublishedPostsByTag } from '@/lib/posts'
import { createBreadcrumbJsonLd, createCollectionPageJsonLd } from '@/lib/seo'

export function TagPageContent({ locale, tag }: { locale: Locale; tag: string }) {
  const dict = getDictionary(locale)
  const prefix = localePathPrefix[locale]
  const posts = getPublishedPostsByTag(tag, locale)

  if (posts.length === 0) notFound()

  return (
    <>
      <JsonLd
        data={[
          createCollectionPageJsonLd({
            name: `${dict.breadcrumb.tags}: ${tag}`,
            description: `${tag}`,
            path: `${prefix}/tags/${encodeURIComponent(tag)}`,
          }),
          createBreadcrumbJsonLd([
            { name: dict.breadcrumb.home, path: prefix === '' ? '/' : prefix },
            { name: dict.breadcrumb.tags, path: `${prefix}/tags` },
            { name: tag, path: `${prefix}/tags/${encodeURIComponent(tag)}` },
          ]),
        ]}
      />
      <div>
        <SectionHeader>{`tag: ${tag}`}</SectionHeader>
        <div>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} pathPrefix={prefix} />
          ))}
        </div>
      </div>
    </>
  )
}
