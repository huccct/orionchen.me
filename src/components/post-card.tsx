import Link from 'next/link'
import type { Post } from '@/content/schemas'

export function PostCard({ post }: { post: Post & { _meta?: { path: string } } }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group border-border hover:border-accent block border-b py-4"
    >
      <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h3 className="group-hover:text-accent min-w-0 font-serif text-base break-words">
          {post.title}
        </h3>
        <time className="text-muted-foreground font-mono text-xs whitespace-nowrap">
          {post.date}
        </time>
      </div>
      {post.summary && (
        <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{post.summary}</p>
      )}
    </Link>
  )
}
