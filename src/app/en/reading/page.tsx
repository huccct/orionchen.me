import type { Metadata } from 'next'
import { ReadingPageContent } from '@/components/page-content/reading-page-content'
import { getDictionary } from '@/i18n/get-dictionary'
import { createMetadata } from '@/lib/seo'

const dict = getDictionary('en')

export const metadata: Metadata = createMetadata({
  title: dict.reading.title,
  description: dict.site.readingDescription,
  path: '/en/reading',
})

export default function EnReadingPage() {
  return <ReadingPageContent locale="en" />
}
