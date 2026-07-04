import type { Metadata } from 'next'
import { HomePageContent } from '@/components/page-content/home-page-content'
import { getDictionary } from '@/i18n/get-dictionary'
import { createMetadata } from '@/lib/seo'

const dict = getDictionary('zh')

export const metadata: Metadata = createMetadata({
  description: dict.site.homeDescription,
  keywords: ['Orion Chen', 'blog', 'writing', 'frontend', 'AI'],
})

export default function Home() {
  return <HomePageContent locale="zh" />
}
