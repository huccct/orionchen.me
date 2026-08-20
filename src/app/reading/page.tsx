import type { Metadata } from 'next'
import { ReadingPageContent } from '@/components/page-content/reading-page-content'
import { getDictionary } from '@/i18n/get-dictionary'
import { createMetadata } from '@/lib/seo'

const dict = getDictionary('zh')

export const metadata: Metadata = createMetadata({
  title: dict.reading.title,
  description: dict.site.readingDescription,
  path: '/reading',
})

export default function ReadingPage() {
  return <ReadingPageContent locale="zh" />
}
