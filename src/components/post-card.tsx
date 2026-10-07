import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/content/schemas'

export function PostCard({
  post,
  pathPrefix = '',
}: {
  post: Post & { _meta?: { path: string } }
  pathPrefix?: string
}) {
  // ponytail: use authored local images only; articles without one stay text-only.
  const cover = post.cover ?? post.content?.match(/!\[[^\]]*\]\((\/images\/[^\s)]+)\)/)?.[1]
  return (
    <article className="writing-entry">
      <div className="writing-entry-copy">
        <div className="writing-entry-meta">
          <time dateTime={post.date}>{post.date.slice(0, 10).replaceAll('-', '.')}</time>
          {post.tags?.slice(0, 2).map((tag) => (
            <Link key={tag} href={`${pathPrefix}/tags/${encodeURIComponent(tag)}`}>
              {tag}
            </Link>
          ))}
        </div>
        <Link className="writing-entry-title" href={`${pathPrefix}/blog/${post.slug}`}>
          <h3>{post.title}</h3>
        </Link>
        {post.summary && <p>{post.summary}</p>}
      </div>
      {cover?.startsWith('/images/') && (
        <Link
          className="writing-entry-image"
          href={`${pathPrefix}/blog/${post.slug}`}
          aria-label={post.title}
        >
          <Image
            src={cover}
            alt=""
            width={320}
            height={220}
            sizes="(max-width: 600px) 100vw, 160px"
          />
        </Link>
      )}
    </article>
  )
}
