import type { Metadata } from 'next'
import { WorksListPageContent } from '@/components/page-content/works-list-page-content'
import { getDictionary } from '@/i18n/get-dictionary'
import { createMetadata } from '@/lib/seo'

const dict = getDictionary('zh')

export const metadata: Metadata = createMetadata({
  title: dict.works.title,
  description: dict.site.worksDescription,
  path: '/works',
  keywords: ['works', 'projects', 'AI', 'documentary', 'frontend'],
})

export default function WorksPage() {
  return <WorksListPageContent locale="zh" />
}
