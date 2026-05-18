import { allPosts } from 'content-collections'
import { PostCard } from '@/components/post-card'
import { SectionHeader } from '@/components/section-header'

export const metadata = { title: 'Writing' }

export default function BlogPage() {
  const posts = allPosts.filter((post) => !post.draft).sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div>
      <SectionHeader>Writing</SectionHeader>
      <div className="mb-4 font-mono text-xs text-[var(--color-muted)]">{posts.length} posts</div>
      <div>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
