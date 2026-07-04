import type { Metadata } from 'next'
import { AboutPageContent } from '@/components/page-content/about-page-content'
import { getDictionary } from '@/i18n/get-dictionary'
import { createMetadata } from '@/lib/seo'

const dict = getDictionary('zh')

export const metadata: Metadata = createMetadata({
  title: dict.about.title,
  description: dict.about.metaDescription,
  path: '/about',
})

export default function AboutPage() {
  return <AboutPageContent locale="zh" />
}
