import type { Metadata } from 'next'
import { JsonLd } from '@/components/json-ld'
import { SectionHeader } from '@/components/section-header'
import { WorksFilter } from '@/components/works-filter'
import { createBreadcrumbJsonLd, createCollectionPageJsonLd, createMetadata } from '@/lib/seo'
import { getVisibleWorks } from '@/lib/works'

export const metadata: Metadata = createMetadata({
  title: 'Works',
  description: 'Orion Chen 的项目、产品实验与纪录片作品。',
  path: '/works',
  keywords: ['works', 'projects', 'AI', 'documentary', 'frontend'],
})

export default function WorksPage() {
  const works = getVisibleWorks()

  return (
    <>
      <JsonLd
        data={[
          createCollectionPageJsonLd({
            name: 'Works',
            description: 'Orion Chen 的项目、产品实验与纪录片作品。',
            path: '/works',
          }),
          createBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Works', path: '/works' },
          ]),
        ]}
      />
      <div>
        <SectionHeader>Works</SectionHeader>
        <WorksFilter works={works} />
      </div>
    </>
  )
}
