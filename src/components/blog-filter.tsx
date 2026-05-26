'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PostCard } from '@/components/post-card'
import { SectionHeader } from '@/components/section-header'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getBlogPageHref, POSTS_PER_PAGE, type PublishedPost } from '@/lib/posts'

const KINDS = ['all', 'tutorial', 'notes'] as const
type Kind = (typeof KINDS)[number]

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

  return (
    <div>
      <SectionHeader>Writing</SectionHeader>

      <Tabs
        value={kind}
        onValueChange={(value) => setKind(value as Kind)}
        className="mb-4"
      >
        <TabsList>
          {KINDS.map((item) => (
            <TabsTrigger key={item} value={item}>
              {item} <span className="text-muted-foreground ml-1">{counts[item]}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {kind === 'all' && (
        <div className="text-muted-foreground mb-4 font-mono text-xs">
          {`${totalPosts} posts · page ${page} of ${pageCount}`}
        </div>
      )}

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
