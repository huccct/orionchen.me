import type { Metadata } from 'next'
import { GuestbookPageContent } from '@/components/page-content/guestbook-page-content'
import { getDictionary } from '@/i18n/get-dictionary'
import { createMetadata } from '@/lib/seo'

const dict = getDictionary('en')

export const metadata: Metadata = createMetadata({
  title: dict.guestbook.title,
  description: dict.site.guestbookDescription,
  path: '/en/guestbook',
  noIndex: true,
})

export default function EnGuestbookPage() {
  return <GuestbookPageContent locale="en" />
}
