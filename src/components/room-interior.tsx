'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowUpRight, X, RotateCcw } from 'lucide-react'
import type { NeighborhoodEntry, NeighborhoodStop } from '@/lib/neighborhood'
import './room-interior.css'

type Props = {
  room: number
  zh: boolean
  prefix: string
  posts: NeighborhoodEntry[]
  books: { title: string; note: string; href: string }[]
  stop: NeighborhoodStop
  onClose: () => void
}
const rooms = ['writing', 'works', 'reading'] as const
const roomNames = [
  ['写作小屋', '放映工作室', '阅读书屋'],
  ['The writing room', 'The screening room', 'The reading room'],
]

export default function RoomInterior({ room, zh, prefix, posts, books, stop, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const host = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; scroll: number; moved: boolean } | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading')
  const [panel, setPanel] = useState<string | null>(null)
  const panelHeading = useRef<HTMLHeadingElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)
  function openPanel(action: string) {
    lastFocus.current = document.activeElement as HTMLElement
    setPanel(action)
  }
  function closePanel() {
    setPanel(null)
    lastFocus.current?.focus()
  }
  useEffect(() => {
    if (panel) panelHeading.current?.focus()
  }, [panel])
  useEffect(() => {
    const modal = dialog.current!
    const previousFocus = document.activeElement as HTMLElement | null
    modal.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      modal.close()
      previousFocus?.focus()
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const view = host.current!
    view.scrollLeft = (view.scrollWidth - view.clientWidth) / 2
  }, [])

  const title = roomNames[zh ? 0 : 1]![room]!
  return (
    <dialog
      ref={dialog}
      className="interior-dialog pixel-interior"
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault()
        if (panel) closePanel()
        else onClose()
      }}
    >
      <div
        ref={host}
        className="pixel-room-viewport"
        tabIndex={0}
        aria-label={
          zh
            ? '屋内视角，拖动或按左右方向键环顾'
            : 'Inside the room. Drag or use arrow keys to look around'
        }
        onKeyDown={(event) => {
          if (
            event.target !== event.currentTarget ||
            !['ArrowLeft', 'ArrowRight'].includes(event.key)
          )
            return
          event.preventDefault()
          event.currentTarget.scrollLeft += event.key === 'ArrowLeft' ? -150 : 150
        }}
        onPointerDown={(event) => {
          if (event.button !== 0) return
          drag.current = { x: event.clientX, scroll: event.currentTarget.scrollLeft, moved: false }
        }}
        onPointerMove={(event) => {
          if (!drag.current || !event.buttons) return
          const dx = event.clientX - drag.current.x
          if (Math.abs(dx) > 6) {
            drag.current.moved = true
            event.currentTarget.setPointerCapture(event.pointerId)
            event.currentTarget.scrollLeft = drag.current.scroll - dx
          }
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId)
        }}
        onPointerCancel={() => {
          drag.current = null
        }}
        onClickCapture={(event) => {
          if (event.detail > 0 && drag.current?.moved) {
            event.preventDefault()
            event.stopPropagation()
            drag.current = null
          }
        }}
      >
        <div className="pixel-room-world">
          <Image
            src={`/images/pixel-town/${rooms[room]}.webp`}
            width={1672}
            height={941}
            alt=""
            className="pixel-backdrop"
            loading="eager"
            unoptimized
            draggable={false}
            onLoad={() => setStatus('ready')}
            onError={() => setStatus('fallback')}
          />
          <button
            className="pixel-furniture pixel-desk"
            style={
              room === 1 ? { left: '41%', top: '30%', width: '31%', height: '35%' } : undefined
            }
            onClick={() => openPanel(room === 1 ? 'screen' : 'desk')}
            aria-label={
              zh
                ? room === 1
                  ? '放映幕 · 作品'
                  : room === 2
                    ? '茶几 · 随手翻翻'
                    : '书桌 · 最近的文字'
                : room === 1
                  ? 'Screen · works'
                  : 'Desk · explore'
            }
          >
            <span className="pixel-spark" aria-hidden="true">
              ✦
            </span>
            <span className="pixel-tooltip">{zh ? '打开看看' : 'Take a look'}</span>
          </button>
          <button
            className="pixel-furniture pixel-shelf"
            onClick={() => openPanel('shelf')}
            aria-label={zh ? '书架 · 浏览目录' : 'Shelves · browse'}
          >
            <span className="pixel-spark" aria-hidden="true">
              ✦
            </span>
            <span className="pixel-tooltip">{zh ? '翻翻书架' : 'Browse shelves'}</span>
          </button>
        </div>
      </div>
      <header className="interior-topbar">
        <button onClick={onClose} autoFocus>
          <ArrowLeft size={17} />
          {zh ? '走出小屋' : 'Step outside'}
        </button>
        <h2>{title}</h2>
        <button
          onClick={() => {
            const view = host.current!
            view.scrollLeft = (view.scrollWidth - view.clientWidth) / 2
          }}
          aria-label={zh ? '看向正前方' : 'Face forward'}
        >
          <RotateCcw size={17} />
        </button>
      </header>
      {status !== 'ready' && (
        <div className="interior-loading" role="status">
          {status === 'loading'
            ? zh
              ? '正在打开屋门…'
              : 'Opening the door…'
            : zh
              ? '房间画面暂不可用，下方仍可打开内容。'
              : 'The room view is unavailable. Explore the content below.'}
        </div>
      )}
      <div className="interior-bottom">
        <p>
          {zh
            ? '左右环顾 · 点书桌和书架，翻翻里面的故事'
            : 'Look around · explore the desk and shelves'}
        </p>
        <div className="interior-actions">
          <button onClick={() => openPanel(room === 1 ? 'screen' : 'desk')}>
            {room === 1
              ? zh
                ? '放映幕 · 作品'
                : 'Screen · works'
              : room === 2
                ? zh
                  ? '茶几 · 随手翻翻'
                  : 'Table · reading'
                : zh
                  ? '书桌 · 最近的文字'
                  : 'Desk · latest writing'}
          </button>
          <button onClick={() => openPanel('shelf')}>
            {room === 2
              ? zh
                ? '书架 · 我的书单'
                : 'Shelves · my books'
              : zh
                ? '书架 · 浏览目录'
                : 'Shelves · browse'}
          </button>
        </div>
      </div>
      {panel && (
        <section
          className="interior-panel"
          aria-label={zh ? '物件里的内容' : 'Explore this object'}
        >
          <button
            className="interior-panel-close"
            onClick={closePanel}
            aria-label={zh ? '收起来，继续看房间' : 'Close and keep exploring'}
          >
            <X size={18} />
          </button>
          <h3 ref={panelHeading} tabIndex={-1}>
            {room === 2
              ? zh
                ? '书架上的书'
                : 'On the bookshelf'
              : room === 1
                ? zh
                  ? '放映之前'
                  : 'Before the screening'
                : panel === 'desk'
                  ? zh
                    ? '桌上新写的'
                    : 'Fresh from the desk'
                  : zh
                    ? '写作目录'
                    : 'Writing index'}
          </h3>
          {room === 0 &&
            panel === 'desk' &&
            posts.slice(0, 5).map((post) => (
              <Link key={post.href} href={post.href} className="interior-content-link">
                {post.title}
                <ArrowUpRight size={16} />
              </Link>
            ))}
          {room === 0 && panel === 'shelf' && (
            <>
              <Link className="interior-content-link" href={`${prefix}/blog`}>
                {zh ? '所有文章' : 'All writing'}
                <ArrowUpRight size={16} />
              </Link>
              <Link className="interior-content-link" href={`${prefix}/tags`}>
                {zh ? '按主题翻阅' : 'Browse topics'}
                <ArrowUpRight size={16} />
              </Link>
            </>
          )}
          {room === 1 && (
            <>
              <p>{stop.title}</p>
              <p>{stop.summary}</p>
              <Link className="interior-content-link" href={`${prefix}/works`}>
                {zh ? '打开作品目录' : 'Open works archive'}
                <ArrowUpRight size={16} />
              </Link>
            </>
          )}
          {room === 2 &&
            books.map((book) => (
              <details key={book.href}>
                <summary>{book.title}</summary>
                <p>{book.note}</p>
                <a href={book.href} target="_blank" rel="noreferrer">
                  {zh ? '查看这本书（新窗口）' : 'View book (new window)'}
                  <ArrowUpRight size={14} />
                </a>
              </details>
            ))}
          {room === 0 && posts.length === 0 && (
            <p>{zh ? '这里还没有发布的文章。' : 'No writing has been published here yet.'}</p>
          )}
        </section>
      )}
    </dialog>
  )
}
