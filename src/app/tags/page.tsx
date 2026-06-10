import type { Metadata } from 'next'
import { TagsListPageContent } from '@/components/page-content/tags-list-page-content'
import { getDictionary } from '@/i18n/get-dictionary'
import { createMetadata } from '@/lib/seo'

const dict = getDictionary('zh')

export const metadata: Metadata = createMetadata({
  title: dict.blog.tagsTitle,
  description: dict.site.tagsDescription,
  path: '/tags',
  noIndex: true,
})

export default function TagsPage() {
  return <TagsListPageContent locale="zh" />
}
