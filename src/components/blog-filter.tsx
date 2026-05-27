'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PostCard } from '@/components/post-card'
import { SectionHeader } from '@/components/section-header'
import { getBlogPageHref, POSTS_PER_PAGE, type PublishedPost } from '@/lib/posts'
import { cn } from '@/lib/utils'

const FILTERS = [
  { value: 'all', label: 'All writing' },
  { value: 'tutorial', label: 'Tutorials' },
  { value: 'notes', label: 'Notes' },
] as const
type Kind = (typeof FILTERS)[number]['value']

export function BlogFilter({
  allPosts,
  page,
  pageCount,
  pagedPosts,
}: {
  allPosts: PublishedPost[]
  page: number
  pageCount: number
  pagedPosts: PublishedPost[]
}) {
  const [kind, setKind] = useState<Kind>('all')

  const tutorials = allPosts.filter((post) => post.tags?.includes('tutorial'))
  const notes = allPosts.filter((post) => !post.tags?.includes('tutorial'))

  const visible: PublishedPost[] =
    kind === 'all' ? pagedPosts : kind === 'tutorial' ? tutorials : notes

  const showPager = kind === 'all' && pageCount > 1
  const totalPosts = allPosts.length
  const firstPostNumber = totalPosts === 0 ? 0 : (page - 1) * POSTS_PER_PAGE + 1
  const lastPostNumber = Math.min(page * POSTS_PER_PAGE, totalPosts)

  const counts: Record<Kind, number> = {
    all: totalPosts,
    tutorial: tutorials.length,
    notes: notes.length,
  }
  const listMeta =
    kind === 'all'
      ? `${firstPostNumber}-${lastPostNumber} / ${totalPosts}`
      : `${visible.length} ${kind}`

  return (
    <div>
      <SectionHeader action={<span>{listMeta}</span>}>Writing</SectionHeader>

      <nav
        aria-label="Filter writing"
        className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs"
      >
        {FILTERS.map((filter) => {
          const active = kind === filter.value

          return (
            <button
              key={filter.value}
              type="button"
              aria-pressed={active}
              onClick={() => setKind(filter.value)}
              className={cn(
                'inline-flex min-h-7 items-center gap-1.5 border-b px-0.5 text-left transition-colors',
                active
                  ? 'border-accent text-foreground'
                  : 'text-muted-foreground hover:border-border hover:text-foreground border-transparent'
              )}
            >
              <span>{filter.label}</span>
              <span
                className={cn(
                  'tabular-nums',
                  active ? 'text-accent' : 'text-muted-foreground/80'
                )}
              >
                {counts[filter.value]}
              </span>
            </button>
          )
        })}
      </nav>

      <div>
        {visible.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {showPager && (
        <nav className="border-border mt-8 flex items-center justify-between border-t pt-4 font-mono text-xs">
          {page > 1 ? (
            <Link href={getBlogPageHref(page - 1)} className="hover:text-accent">
              newer
            </Link>
          ) : (
            <span className="text-muted-foreground">newer</span>
          )}
          <span className="text-muted-foreground">
            {`${firstPostNumber}-${lastPostNumber} / ${totalPosts}`}
          </span>
          {page < pageCount ? (
            <Link href={getBlogPageHref(page + 1)} className="hover:text-accent">
              older
            </Link>
          ) : (
            <span className="text-muted-foreground">older</span>
          )}
        </nav>
      )}
    </div>
  )
}
