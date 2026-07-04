import type { Metadata } from 'next'
import { AboutPageContent } from '@/components/page-content/about-page-content'
import { getDictionary } from '@/i18n/get-dictionary'
import { createMetadata } from '@/lib/seo'

const dict = getDictionary('en')

export const metadata: Metadata = createMetadata({
  title: dict.about.title,
  description: dict.about.metaDescription,
  path: '/en/about',
})

export default function EnAboutPage() {
  return <AboutPageContent locale="en" />
}
