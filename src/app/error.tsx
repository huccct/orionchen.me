'use client'

import { usePathname } from 'next/navigation'
import { getDictionary } from '@/i18n/get-dictionary'
import { getLocaleFromPath } from '@/i18n/get-locale'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  const pathname = usePathname() ?? '/'
  const dict = getDictionary(getLocaleFromPath(pathname))

  return (
    <div className="space-y-4 py-24 text-center">
      <p className="text-muted-foreground font-mono text-sm">{`// ${dict.errors.fiveHundred}`}</p>
      <button onClick={reset} className="text-accent">
        {dict.errors.retry}
      </button>
    </div>
  )
}
