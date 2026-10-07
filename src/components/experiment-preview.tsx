'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { Locale } from '@/i18n/config'
import { experiments, pickExperimentPair } from '@/lib/experiments'

export function ExperimentPreview({ locale }: { locale: Locale }) {
  const [pair, setPair] = useState([0, 1])
  const selected = useRef(false)
  useEffect(() => {
    if (selected.current) return
    selected.current = true
    let previous: string | null = null
    try {
      previous = sessionStorage.getItem('vibe-preview-pair')
    } catch {
      /* Storage may be disabled. */
    }
    const next = pickExperimentPair(previous)
    try {
      sessionStorage.setItem('vibe-preview-pair', next.join(','))
    } catch {
      /* Random selection still works without storage. */
    }
    // Browser-only selection preserves the same server and hydration markup.
    setPair(next)
  }, [])

  return (
    <div className="experiment-preview">
      {pair.map((index) => {
        const item = experiments[index]!
        const [title, note] = item[locale]
        return (
          <a key={item.slug} href={`https://huccct.github.io/vibe/toys/${item.slug}/`}>
            <figure>
              <div className="experiment-image">
                <Image
                  src={`/images/experiments/${item.image}.jpg`}
                  alt={title}
                  width={1280}
                  height={720}
                  sizes="(max-width: 480px) 100vw, 330px"
                />
              </div>
              <figcaption>
                <span>
                  {title}
                  <small>{note}</small>
                </span>
                <ArrowUpRight size={16} />
              </figcaption>
            </figure>
          </a>
        )
      })}
    </div>
  )
}
