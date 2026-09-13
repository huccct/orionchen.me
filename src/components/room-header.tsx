import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import type { Locale } from '@/i18n/config'
import { localePathPrefix } from '@/i18n/config'
import './room-header.css'

const rooms = {
  writing: [
    '写作小屋',
    'The writing house',
    '把想法放到纸上，再慢慢想清楚。',
    'Put a thought on paper. Give it room to grow.',
  ],
  works: [
    '放映工作室',
    'The studio',
    '代码、影像，以及还在制作中的故事。',
    'Code, film, and stories still in the making.',
  ],
  reading: [
    '阅读书屋',
    'The reading room',
    '在别人的句子里，停一会儿。',
    'Stay a little longer with someone else’s words.',
  ],
  about: [
    '关于镇长',
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
  guestbook: [
    '小镇邮局',
    'The town postbox',
    '来都来了，留句话再走吧。',
    'A few words before you go.',
  ],
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
  const interior = ['writing', 'works', 'reading'].includes(room)
  const image =
    room === 'about' || room === 'guestbook' ? 'town' : room === 'tags' ? 'writing' : room
  return (
    <header className={`room-header room-${room}`}>
      <nav aria-label={zh ? '小镇导航' : 'Town navigation'} className="room-navigation">
        <Link href={prefix || '/'}>
          <ArrowLeft size={16} />
          {zh ? '回到小镇' : 'Back to the town'}
        </Link>
        {room === 'writing' && (
          <Link href={`${prefix}/tags`}>
            {zh ? '按主题找文章' : 'Browse by topic'}
            <ArrowUpRight size={15} />
          </Link>
        )}
      </nav>
      <div className="room-welcome">
        <div>
          <h1>{title ?? copy[zh ? 0 : 1]}</h1>
          <p>{copy[zh ? 2 : 3]}</p>
          {interior && (
            <Link className="room-enter" href={`${prefix || '/'}#${room}-room`}>
              {zh ? '回到屋里坐坐' : 'Step back inside'}
              <ArrowUpRight size={16} />
            </Link>
          )}
        </div>
        <Image
          src={`/images/pixel-town/${image}.webp`}
          width={1672}
          height={941}
          alt=""
          sizes="(max-width: 767px) 100vw, 520px"
          loading="eager"
        />
      </div>
    </header>
  )
}
