import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/json-ld'
import { SectionHeader } from '@/components/section-header'
import { getPublishedTags } from '@/lib/posts'
import { createBreadcrumbJsonLd, createCollectionPageJsonLd, createMetadata } from '@/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Tags',
  description: '按主题浏览 Orion Chen 的已发布文章。',
  path: '/tags',
  noIndex: true,
})

export default function TagsPage() {
  const sorted = [...getPublishedTags().entries()].sort((a, b) => b[1] - a[1])

  return (
    <>
      <JsonLd
        data={[
          createCollectionPageJsonLd({
            name: 'Tags',
            description: '按主题浏览 Orion Chen 的已发布文章。',
            path: '/tags',
          }),
          createBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Tags', path: '/tags' },
          ]),
        ]}
      />
      <div>
        <SectionHeader>Tags</SectionHeader>
        <div className="flex flex-wrap gap-2 font-mono text-sm">
          {sorted.map(([tag, count]) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="border-border hover:text-accent rounded-sm border px-2 py-1"
            >
              {tag} <span className="text-muted-foreground">{count}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
