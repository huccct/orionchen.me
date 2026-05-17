'use client'

import { useState } from 'react'
import type { Work } from '@/content/schemas'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { WorkCard } from './work-card'

const KINDS = ['all', 'code', 'film', 'writing'] as const

export function WorksFilter({ works }: { works: (Work & { hasBody: boolean })[] }) {
  const [kind, setKind] = useState<(typeof KINDS)[number]>('all')
  const filtered = kind === 'all' ? works : works.filter((work) => work.type === kind)

  return (
    <>
      <Tabs
        value={kind}
        onValueChange={(value) => setKind(value as (typeof KINDS)[number])}
        className="mb-6"
      >
        <TabsList>
          {KINDS.map((item) => (
            <TabsTrigger key={item} value={item}>
              {item}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((work) => (
          <WorkCard key={work.slug} work={work} hasBody={work.hasBody} />
        ))}
      </div>
    </>
  )
}
