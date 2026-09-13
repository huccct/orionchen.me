import { siteConfig } from '@/lib/site-config'
import { RoomHeader } from '@/components/room-header'
import { GiscusComments } from '@/components/giscus-comments'
import { SectionHeader } from '@/components/section-header'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'

export function GuestbookPageContent({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale)

  return (
    <div className="mx-auto max-w-2xl">
      <RoomHeader room="guestbook" locale={locale} />
      <SectionHeader>{dict.guestbook.title}</SectionHeader>
      <p className="text-muted-foreground mb-8">{dict.guestbook.intro}</p>
      <p className="text-muted-foreground mb-6 text-sm">
        {locale === 'zh' ? '留言区没加载出来？' : 'Comments not loading?'}{' '}
        <a
          className="text-accent inline-flex min-h-11 items-center underline underline-offset-4"
          href={`https://github.com/${siteConfig.giscus.repo}/discussions`}
          target="_blank"
          rel="noreferrer"
        >
          {locale === 'zh' ? '去 GitHub 留言（新窗口）' : 'Visit GitHub Discussions (new window)'}
        </a>
      </p>
      <GiscusComments locale={locale} term="guestbook" />
    </div>
  )
}
