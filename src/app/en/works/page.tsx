import type { Metadata } from 'next'
import { WorksListPageContent } from '@/components/page-content/works-list-page-content'
import { getDictionary } from '@/i18n/get-dictionary'
import { createMetadata } from '@/lib/seo'

const dict = getDictionary('en')

export const metadata: Metadata = createMetadata({
  title: dict.works.title,
  description: dict.site.worksDescription,
  path: '/en/works',
  keywords: ['works', 'projects', 'AI', 'documentary', 'frontend'],
})

export default function EnWorksPage() {
  return <WorksListPageContent locale="en" />
}
