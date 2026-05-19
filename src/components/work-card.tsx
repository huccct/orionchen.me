import Image from 'next/image'
import Link from 'next/link'
import type { Work } from '@/content/schemas'
import { StatusPill } from './status-pill'

function firstExternalLink(work: Work): string | null {
  const links = work.links ?? {}
  return links.demo ?? links.repo ?? links.youtube ?? links.bilibili ?? links.article ?? null
}

const cardClass =
  'group block overflow-hidden rounded-md border border-border bg-card transition-colors'
const linkableClass = 'hover:border-accent hover:shadow-sm'
const inertClass = 'opacity-90 cursor-default'

function CardInner({ work, badge }: { work: Work; badge?: string }) {
  return (
    <>
      <div className="bg-muted relative aspect-[16/10]">
        <Image
          src={work.cover}
          alt={work.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {badge && (
          <span className="border-border bg-background/90 text-muted-foreground absolute top-2 right-2 rounded-sm border px-2 py-0.5 font-mono text-xs backdrop-blur">
            {badge}
          </span>
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-serif text-base">{work.title}</h3>
          <div className="flex shrink-0 gap-1">
            <StatusPill kind={work.type} />
            {work.status !== 'live' && <StatusPill kind={work.status} />}
          </div>
        </div>
        <p className="text-muted-foreground line-clamp-2 text-xs">{work.summary}</p>
      </div>
    </>
  )
}

export function WorkCard({ work }: { work: Work }) {
  const externalHref = firstExternalLink(work)
  const internalHref = work.hasDetail ? `/works/${work.slug}` : null
  const href = internalHref ?? externalHref
  const external = !internalHref && externalHref?.startsWith('http')

  if (!href) {
    // Featured wip works (e.g. an upcoming documentary) may have neither a detail
    // page nor an external link yet — render a non-clickable card with a
    // "coming soon" badge so the homepage doesn't 404 on click.
    return (
      <div className={`${cardClass} ${inertClass}`} aria-disabled="true">
        <CardInner work={work} badge="coming soon" />
      </div>
    )
  }

  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={`${cardClass} ${linkableClass}`}
    >
      <CardInner work={work} />
    </Link>
  )
}
