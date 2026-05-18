'use client'

import Script from 'next/script'
import { siteConfig } from '@/lib/site-config'

export function Plausible() {
  if (process.env.NODE_ENV !== 'production') return null

  return (
    <Script defer data-domain={siteConfig.plausibleDomain} src="https://plausible.io/js/script.js" />
  )
}
