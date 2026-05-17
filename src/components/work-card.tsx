import Image from 'next/image'
import Link from 'next/link'
import type { Work } from '@/content/schemas'
import { StatusPill } from './status-pill'

function firstExternalLink(work: Work): string | null {
  const links = work.links ?? {}
  return links.demo ?? links.repo ?? links.youtube ?? links.bilibili ?? links.article ?? null
}

export function WorkCard({ work, hasBody }: { work: Work; hasBody: boolean }) {
  const externalHref = firstExternalLink(work)
  const href = hasBody ? `/works/${work.slug}` : (externalHref ?? `/works/${work.slug}`)
  const external = !hasBody && externalHref?.startsWith('http')

  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="group block overflow-hidden rounded-md border border-[var(--color-border)] transition-colors hover:border-[var(--color-accent)] hover:shadow-sm"
    >
      <div className="relative aspect-[16/10] bg-[var(--color-border)]">
        <Image
          src={work.cover}
          alt={work.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-serif text-base">{work.title}</h3>
          <div className="flex shrink-0 gap-1">
            <StatusPill kind={work.type} />
            {work.status !== 'live' && <StatusPill kind={work.status} />}
          </div>
        </div>
        <p className="line-clamp-2 text-xs text-[var(--color-muted)]">{work.summary}</p>
      </div>
    </Link>
  )
}
