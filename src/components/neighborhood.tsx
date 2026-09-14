'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
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
  const [recommendation, setRecommendation] = useState<NeighborhoodEntry | null>(null)
  const dogDialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (!recommendation) return
    const modal = dogDialog.current!
    const previousFocus = document.activeElement as HTMLElement | null
    modal.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      modal.close()
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [recommendation])
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
    setRecommendation(
      posts[Math.floor(Math.random() * posts.length)] ?? {
        title: zh ? '去写作屋逛逛？' : 'Visit the writing room?',
        summary: zh
          ? '新故事还在路上，先去看看吧。'
          : 'New stories are on their way. Have a look around.',
        href: `${prefix}/blog`,
      }
    )
  }

  return (
    <section
      className="neighborhood"
      aria-label={zh ? '逛逛我的创作街区' : 'Explore my creative neighborhood'}
    >
      <h1 className="sr-only">{zh ? 'Orion Chen 的创作小镇' : 'Orion Chen’s creative town'}</h1>
      <PixelTown
        interiorOpen={room !== null || recommendation !== null}
        latestPost={posts[0]}
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

      <dialog
        ref={dogDialog}
        className="pixel-recommendation"
        aria-labelledby="dog-recommendation-title"
        onCancel={(event) => {
          event.preventDefault()
          setRecommendation(null)
        }}
      >
        <p className="pixel-recommendation-kicker">
          {zh ? '汪！今天读这篇？' : 'Woof! A story for today?'}
        </p>
        <h2 id="dog-recommendation-title">{recommendation?.title}</h2>
        <p className="pixel-recommendation-summary">{recommendation?.summary}</p>
        <div className="pixel-recommendation-actions">
          {recommendation && (
            <Link href={recommendation.href}>{zh ? '去读读 ↗' : 'Read it ↗'}</Link>
          )}
          <button onClick={() => setRecommendation(null)}>
            {zh ? '继续逛逛' : 'Keep wandering'}
          </button>
        </div>
      </dialog>

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
