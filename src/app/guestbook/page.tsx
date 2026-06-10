import type { Metadata } from 'next'
import { GiscusComments } from '@/components/giscus-comments'
import { SectionHeader } from '@/components/section-header'
import { createMetadata } from '@/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Guestbook',
  description: '留言、想法、批评和合作意向。',
  path: '/guestbook',
  noIndex: true,
})

export default function GuestbookPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeader>Guestbook</SectionHeader>
      <p className="text-muted-foreground mb-8">留言、想法、批评、合作意向，都欢迎。</p>
      <GiscusComments term="guestbook" />
    </div>
  )
}
