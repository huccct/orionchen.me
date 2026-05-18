import Link from 'next/link'
import { allPosts } from 'content-collections'
import { SectionHeader } from '@/components/section-header'

export const metadata = { title: 'Tags' }

export default function TagsPage() {
  const counts = new Map<string, number>()

  for (const post of allPosts) {
    for (const tag of post.tags ?? []) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1])

  return (
    <div>
      <SectionHeader>Tags</SectionHeader>
      <div className="flex flex-wrap gap-2 font-mono text-sm">
        {sorted.map(([tag, count]) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="rounded-sm border border-[var(--color-border)] px-2 py-1 hover:text-[var(--color-accent)]"
          >
            {tag} <span className="text-[var(--color-muted)]">{count}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
