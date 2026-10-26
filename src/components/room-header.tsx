import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Locale } from '@/i18n/config'
import { localePathPrefix } from '@/i18n/config'
import './room-header.css'

const rooms = {
  writing: [
    '写作',
    'Writing',
    '把想法放到纸上，再慢慢想清楚。',
    'Put a thought on paper. Give it room to grow.',
  ],
  works: [
    '作品',
    'Works',
    '代码、影像，以及还在制作中的故事。',
    'Code, film, and stories still in the making.',
  ],
  reading: [
    '阅读',
    'Reading',
    '在别人的句子里，停一会儿。',
    'Stay a little longer with someone else’s words.',
  ],
  about: [
    '关于',
    'Meet the author',
    '写代码、拍影像，也记录生活。',
    'Code, film, and notes from everyday life.',
  ],
  tags: [
    '主题索引',
    'The topic index',
    '沿着一个话题，找到下一篇故事。',
    'Follow a topic to your next story.',
  ],
  guestbook: ['留言', 'Guestbook', '来都来了，留句话再走吧。', 'A few words before you go.'],
} as const

export function RoomHeader({
  room,
  locale,
  title,
}: {
  room: keyof typeof rooms
  locale: Locale
  title?: string
}) {
  const zh = locale === 'zh'
  const prefix = localePathPrefix[locale]
  const copy = rooms[room]
  return (
    <header className="room-header" data-page={room}>
      <div className="room-welcome">
        <h1>{title ?? copy[zh ? 0 : 1]}</h1>
        <p>{copy[zh ? 2 : 3]}</p>
      </div>
      {room === 'writing' && (
        <Link className="archive-topics" href={`${prefix}/tags`}>
          {zh ? '按主题浏览' : 'Browse by topic'}
          <ArrowUpRight size={13} />
        </Link>
      )}
    </header>
  )
}
