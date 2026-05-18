import { allPosts } from 'content-collections'
import { notFound } from 'next/navigation'
import { PostCard } from '@/components/post-card'
import { SectionHeader } from '@/components/section-header'

export function generateStaticParams() {
  const tags = new Set<string>()

  for (const post of allPosts) {
    for (const tag of post.tags ?? []) tags.add(tag)
  }

  return [...tags].map((tag) => ({ tag }))
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: rawTag } = await params
  const tag = decodeURIComponent(rawTag)
  const posts = allPosts
    .filter((post) => (post.tags ?? []).includes(tag))
    .sort((a, b) => b.date.localeCompare(a.date))

  if (posts.length === 0) notFound()

  return (
    <div>
      <SectionHeader>{`tag: ${tag}`}</SectionHeader>
      <div>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
