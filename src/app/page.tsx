import { allPosts } from 'content-collections'
import Link from 'next/link'
import { PostCard } from '@/components/post-card'
import { SectionHeader } from '@/components/section-header'
import { WorkCard } from '@/components/work-card'
import { getVisibleWorks } from '@/lib/works'

export default function Home() {
  const featured = getVisibleWorks().filter((work) => work.featured).slice(0, 6)
  const latest = allPosts
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  return (
    <div className="space-y-12 md:space-y-16">
      <section className="py-10 sm:py-14 md:py-16">
        <h1 className="font-serif text-4xl leading-tight text-balance sm:text-5xl md:text-6xl">
          Code, documentary,
          <br />
          and writing
          <br />
          by{' '}
          <span className="text-foreground relative isolate inline-block whitespace-nowrap after:absolute after:inset-x-[-0.08em] after:bottom-[0.08em] after:-z-10 after:h-[0.34em] after:bg-[var(--site-accent)] after:opacity-50 after:content-['']">
            Orion Chen
          </span>
          .
        </h1>
        <div className="mt-8 font-mono uppercase sm:mt-10">
          <div className="text-muted-foreground flex items-center gap-2.5 text-[11px] tracking-[0.28em] sm:tracking-[0.35em]">
            <span
              aria-hidden="true"
              className="inline-block size-1.5 animate-pulse rounded-full bg-red-500"
            />
            <span>REC</span>
          </div>
          <p className="mt-3 text-xs tracking-[0.22em] sm:text-sm sm:tracking-[0.3em] md:text-base">
            You are being watched.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader action={<Link href="/works">all</Link>}>Works</SectionHeader>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((work) => (
            <WorkCard key={work.slug} work={work} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader action={<Link href="/blog">all</Link>}>Writing</SectionHeader>
        <div>
          {latest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  )
}
