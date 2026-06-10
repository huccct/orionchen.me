import type { Metadata } from 'next'
import { BlogListPageContent } from '@/components/page-content/blog-list-page-content'
import { getDictionary } from '@/i18n/get-dictionary'
import { createMetadata } from '@/lib/seo'

const dict = getDictionary('en')

export const metadata: Metadata = createMetadata({
  title: dict.blog.title,
  description: dict.site.writingDescription,
  path: '/en/blog',
  keywords: ['blog', 'writing', 'AI', 'frontend', 'essay'],
})

export default function EnBlogPage() {
  return <BlogListPageContent locale="en" />
}
