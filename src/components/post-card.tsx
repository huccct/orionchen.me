import Link from 'next/link'
import type { Post } from '@/content/schemas'
import { cn } from '@/lib/utils'

export function PostCard({ post }: { post: Post & { _meta?: { path: string } } }) {
  const tags = post.tags ?? []

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
      {tags.length > 0 && (
        <div className="text-muted-foreground mt-2 flex flex-wrap gap-x-2 font-mono text-xs">
          {tags.map((tag, index) => (
            <span key={tag} className="flex items-baseline gap-2">
              {index > 0 && <span aria-hidden>·</span>}
              <span
                className={cn(tag === 'tutorial' && 'text-accent')}
              >
                #
                {tag}
              </span>
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
