import { SectionHeader } from '@/components/section-header'
import { WorksFilter } from '@/components/works-filter'
import { getVisibleWorks } from '@/lib/works'

export const metadata = {
  title: 'Works',
}

export default function WorksPage() {
  const works = getVisibleWorks()

  return (
    <div>
      <SectionHeader>Works</SectionHeader>
      <WorksFilter works={works} />
    </div>
  )
}
