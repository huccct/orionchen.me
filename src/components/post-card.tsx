import Link from 'next/link'
import type { Post } from '@/content/schemas'

export function PostCard({ post }: { post: Post & { _meta?: { path: string } } }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group border-border hover:border-accent block border-b py-4"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="group-hover:text-accent font-serif text-base">{post.title}</h3>
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
