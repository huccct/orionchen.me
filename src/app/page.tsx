import { allPosts, allWorks } from 'content-collections'
import Link from 'next/link'
import { PostCard } from '@/components/post-card'
import { SectionHeader } from '@/components/section-header'
import { WorkCard } from '@/components/work-card'

export default function Home() {
  const featured = allWorks
    .filter((work) => work.featured)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 6)
  const latest = allPosts
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  return (
    <div className="space-y-16">
      <section className="py-16">
        <h1 className="font-serif text-5xl leading-tight md:text-6xl">
          Code, film, and writing
          <br />
          by <span className="text-[var(--color-accent)]">Orion Chen</span>.
        </h1>
        <p className="mt-6 max-w-xl text-[var(--color-muted)]">
          一间用代码、影像和文字开着门的小工作室。在 AI
          时代继续做一些偏执、好玩、也许没人用的东西。
        </p>
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
