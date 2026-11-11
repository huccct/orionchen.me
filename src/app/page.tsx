import type { Metadata } from 'next'
import { MatrixComputer } from './matrix/computer'
import { getPublishedPosts } from '@/lib/posts'
import './matrix/matrix.css'
import { getDictionary } from '@/i18n/get-dictionary'
import { createMetadata } from '@/lib/seo'

const dict = getDictionary('zh')

export const metadata: Metadata = createMetadata({
  description: dict.site.homeDescription,
  keywords: ['Orion Chen', 'blog', 'writing', 'frontend', 'AI'],
})

export default function Home() {
  const posts = getPublishedPosts('zh')
    .slice(0, 3)
    .map(({ title, slug, date }) => ({ title, slug, date }))
  return <MatrixComputer posts={posts} />
}
