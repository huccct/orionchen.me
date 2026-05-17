import Link from 'next/link'
import type { Post } from '@/content/schemas'

export function PostCard({ post }: { post: Post & { _meta?: { path: string } } }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block border-b border-[var(--color-border)] py-4 hover:border-[var(--color-accent)]"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-base group-hover:text-[var(--color-accent)]">
          {post.title}
        </h3>
        <time className="whitespace-nowrap font-mono text-xs text-[var(--color-muted)]">
          {post.date}
        </time>
      </div>
      {post.summary && (
        <p className="mt-1 line-clamp-2 text-sm text-[var(--color-muted)]">{post.summary}</p>
      )}
    </Link>
  )
}
