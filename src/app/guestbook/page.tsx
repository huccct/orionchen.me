import { GiscusComments } from '@/components/giscus-comments'
import { SectionHeader } from '@/components/section-header'

export const metadata = { title: 'Guestbook' }

export default function GuestbookPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeader>Guestbook</SectionHeader>
      <p className="mb-8 text-[var(--color-muted)]">留言、想法、批评、合作意向 - 都欢迎。</p>
      <GiscusComments term="guestbook" />
    </div>
  )
}
