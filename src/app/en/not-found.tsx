import type { Metadata } from 'next'
import Link from 'next/link'
import { getDictionary } from '@/i18n/get-dictionary'

const dict = getDictionary('en')

export const metadata: Metadata = {
  title: dict.errors.notFoundTitle,
  description: dict.errors.notFoundDescription,
}

export default function EnNotFound() {
  return (
    <div className="space-y-4 py-24 text-center font-mono">
      <p className="text-muted-foreground text-sm">{`// ${dict.errors.notFoundTitle}`}</p>
      <h1 className="font-serif text-3xl">{dict.errors.notFoundHeading}</h1>
      <Link href="/en" className="text-accent">
        {dict.errors.notFoundBackHome}
      </Link>
    </div>
  )
}
