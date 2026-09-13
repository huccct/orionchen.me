'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import PixelTown from './pixel-town'
import { useRouter } from 'next/navigation'
import type { Locale } from '@/i18n/config'
import { localePathPrefix } from '@/i18n/config'
import type { NeighborhoodEntry, NeighborhoodStop } from '@/lib/neighborhood'
import './neighborhood.css'

const RoomInterior = dynamic(() => import('./room-interior'), { ssr: false })

export function Neighborhood({
  locale,
  stops,
  posts,
  books,
}: {
  locale: Locale
  stops: [NeighborhoodStop, NeighborhoodStop, NeighborhoodStop]
  posts: NeighborhoodEntry[]
  books: { title: string; note: string; href: string }[]
}) {
  const router = useRouter()
  const [room, setRoom] = useState<number | null>(null)
  const zh = locale === 'zh'
  const prefix = localePathPrefix[locale]
  useEffect(() => {
    function restoreRoom() {
      const index = ['#writing-room', '#works-room', '#reading-room'].indexOf(window.location.hash)
      setRoom(index < 0 ? null : index)
    }
    const timer = window.setTimeout(restoreRoom, 0)
    window.addEventListener('hashchange', restoreRoom)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('hashchange', restoreRoom)
    }
  }, [])
  function enterRoom(index: number) {
    const hash = ['#writing-room', '#works-room', '#reading-room'][index]
    if (!hash) return
    window.history.replaceState(
      window.history.state,
      '',
      window.location.pathname + window.location.search + hash
    )
    setRoom(index)
  }
  function leaveRoom() {
    setRoom(null)
    if (window.location.hash.endsWith('-room'))
      window.history.replaceState(
        window.history.state,
        '',
        window.location.pathname + window.location.search
      )
  }
  function discover() {
    if (posts.length) router.push(posts[Math.floor(Math.random() * posts.length)]!.href)
    else router.push(`${prefix}/blog`)
  }

  return (
    <section
      className="neighborhood"
      aria-label={zh ? '逛逛我的创作街区' : 'Explore my creative neighborhood'}
    >
      <h1 className="sr-only">{zh ? 'Orion Chen 的创作小镇' : 'Orion Chen’s creative town'}</h1>
      <PixelTown
        interiorOpen={room !== null}
        labels={[
          ...stops.map((stop) => stop.label),
          zh ? '留言' : 'Guestbook',
          zh ? '狗狗' : 'Dog',
        ]}
        zh={zh}
        hrefs={[...stops.map((stop) => stop.href), `${prefix}/guestbook`]}
        onSelect={enterRoom}
        onDog={discover}
        onGuestbook={() => router.push(`${localePathPrefix[locale]}/guestbook`)}
      />

      {room !== null && (
        <RoomInterior
          key={room}
          room={room}
          zh={zh}
          prefix={prefix}
          posts={posts}
          books={books}
          stop={stops[room]!}
          onClose={leaveRoom}
        />
      )}
    </section>
  )
}
