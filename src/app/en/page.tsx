import type { Metadata } from 'next'
import { HomePageContent } from '@/components/page-content/home-page-content'
import { getDictionary } from '@/i18n/get-dictionary'
import { createMetadata } from '@/lib/seo'

const dict = getDictionary('en')

export const metadata: Metadata = createMetadata({
  description: dict.site.homeDescription,
  path: '/en',
  keywords: ['Orion Chen', 'blog', 'writing', 'frontend', 'AI'],
})

export default function EnHome() {
  return <HomePageContent locale="en" />
}
