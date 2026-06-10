import type { Metadata } from 'next'
import { GuestbookPageContent } from '@/components/page-content/guestbook-page-content'
import { getDictionary } from '@/i18n/get-dictionary'
import { createMetadata } from '@/lib/seo'

const dict = getDictionary('zh')

export const metadata: Metadata = createMetadata({
  title: dict.guestbook.title,
  description: dict.site.guestbookDescription,
  path: '/guestbook',
  noIndex: true,
})

export default function GuestbookPage() {
  return <GuestbookPageContent locale="zh" />
}
