import type { Metadata } from 'next'
import Link from 'next/link'
import { getDictionary } from '@/i18n/get-dictionary'

const dict = getDictionary('zh')

export const metadata: Metadata = {
  title: dict.errors.notFoundTitle,
  description: dict.errors.notFoundDescription,
}

/**
 * Default (zh) 404 page. The /en route tree has its own en not-found
 * — see src/app/en/not-found.tsx.
 */
export default function NotFound() {
  return (
    <div className="space-y-4 py-24 text-center font-mono">
      <p className="text-muted-foreground text-sm">{`// ${dict.errors.notFoundTitle}`}</p>
      <h1 className="font-serif text-3xl">{dict.errors.notFoundHeading}</h1>
      <Link href="/" className="text-accent">
        {dict.errors.notFoundBackHome}
      </Link>
    </div>
  )
}
