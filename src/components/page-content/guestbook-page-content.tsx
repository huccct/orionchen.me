import { GiscusComments } from '@/components/giscus-comments'
import { SectionHeader } from '@/components/section-header'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'

export function GuestbookPageContent({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale)

  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeader>{dict.guestbook.title}</SectionHeader>
      <p className="text-muted-foreground mb-8">{dict.guestbook.intro}</p>
      <GiscusComments locale={locale} term="guestbook" />
    </div>
  )
}
