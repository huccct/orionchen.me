import { allWorks } from 'content-collections'
import { SectionHeader } from '@/components/section-header'
import { WorksFilter } from '@/components/works-filter'

export const metadata = {
  title: 'Works',
}

export default function WorksPage() {
  const works = allWorks.toSorted((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  return (
    <div>
      <SectionHeader>Works</SectionHeader>
      <WorksFilter works={works} />
    </div>
  )
}
