'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Pause, Play, ArrowLeft, ArrowRight, MapPin } from 'lucide-react'
import type { NeighborhoodEntry } from '@/lib/neighborhood'
import { neighborhoodWalk } from '@/lib/neighborhood'

type Props = {
  latestPost?: NeighborhoodEntry
  interiorOpen: boolean
  labels: string[]
  hrefs: string[]
  zh: boolean
  onSelect: (index: number) => void
  onDog: () => void
  onGuestbook: () => void
}
const doors = [
  { x: 79.7, y: 53, w: 8, h: 20 },
  { x: 49, y: 27, w: 15, h: 20 },
  { x: 28.4, y: 47, w: 7, h: 20 },
  { x: 62, y: 71, w: 6, h: 20 },
]
// Routes follow visible paving and avoid the tree, bench, planters and postbox.
const walks = [
  [
    [37, 78],
    [48, 82],
    [58, 86],
  ],
  [
    [24, 64],
    [33, 62],
    [39, 69],
  ],
  [
    [67, 65],
    [73, 66],
    [78, 64],
  ],
]

export default function PixelTown(props: Props) {
  const viewport = useRef<HTMLDivElement>(null)
  const world = useRef<HTMLDivElement>(null)
  const sprites = useRef<(HTMLElement | null)[]>([])
  const callbacks = useRef(props)
  const [paused, setPaused] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [entering, setEntering] = useState<number | null>(null)
  const transition = useRef<Animation | null>(null)
  const motion = useRef({ paused: false, elapsed: 0 })
  const down = useRef<{ x: number; scroll: number; dragged: boolean } | null>(null)
  useEffect(() => {
    callbacks.current = props
  }, [props])
  useEffect(() => {
    motion.current.paused = paused || props.interiorOpen || hidden
  }, [paused, props.interiorOpen, hidden])
  useEffect(() => {
    const visible = () => setHidden(document.hidden)
    visible()
    document.addEventListener('visibilitychange', visible)
    return () => {
      document.removeEventListener('visibilitychange', visible)
      transition.current?.cancel()
    }
  }, [])
  useEffect(() => {
    const view = viewport.current!
    view.scrollLeft = (view.scrollWidth - view.clientWidth) / 2
  }, [])
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0,
      last = 0
    const paint = (time: number) => {
      frame = 0
      const active = !motion.current.paused && !reduced.matches && !document.hidden
      if (active && last) motion.current.elapsed += Math.min((time - last) / 1000, 0.05)
      last = active ? time : 0
      sprites.current.forEach((element, i) => {
        if (!element) return
        const t = motion.current.elapsed + i * 8
        const step = neighborhoodWalk(t, i === 0 ? 20 : 28)
        const route = walks[i]!
        const segment = Math.min(1, Math.floor(step.u * 2))
        const f = step.u * 2 - segment
        const a = route[segment]!,
          b = route[segment + 1]!
        element.style.left = `${a[0]! + (b[0]! - a[0]!) * f}%`
        element.style.top = `${a[1]! + (b[1]! - a[1]!) * f}%`
        element.style.setProperty('--facing', step.returning ? '-1' : '1')
        element.style.setProperty(
          '--frame',
          String(active && step.moving ? Math.floor(t * 7) % 4 : 0)
        )
      })
      if (active) frame = requestAnimationFrame(paint)
    }
    const resume = () => {
      cancelAnimationFrame(frame)
      last = 0
      frame = requestAnimationFrame(paint)
    }
    reduced.addEventListener('change', resume)
    resume()
    return () => {
      cancelAnimationFrame(frame)
      reduced.removeEventListener('change', resume)
    }
  }, [paused, props.interiorOpen, hidden])

  function enter(index: number) {
    if (entering !== null) return
    if (index === 3) {
      callbacks.current.onGuestbook()
      return
    }
    const view = viewport.current!,
      scene = world.current!,
      door = doors[index]!
    view.scrollLeft = (scene.clientWidth * door.x) / 100 - view.clientWidth / 2
    setEntering(index)
    const finish = () => {
      callbacks.current.onSelect(index)
      setEntering(null)
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish()
      return
    }
    scene.style.transformOrigin = `${door.x}% ${door.y}%`
    transition.current = scene.animate(
      [
        { transform: 'scale(1)', filter: 'brightness(1)' },
        { transform: 'scale(1.9)', filter: 'brightness(.45)' },
      ],
      { duration: 850, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }
    )
    transition.current.onfinish = () => {
      finish()
      transition.current?.cancel()
    }
  }
  return (
    <div
      className="pixel-town"
      data-paused={paused || props.interiorOpen || hidden}
      data-entering={entering !== null}
    >
      <div
        className="pixel-viewport"
        ref={viewport}
        tabIndex={0}
        aria-label={
          props.zh
            ? '小镇全景，拖动或按左右方向键探索'
            : 'Town panorama. Drag or use arrow keys to explore'
        }
        onKeyDown={(event) => {
          if (
            event.target !== event.currentTarget ||
            !['ArrowLeft', 'ArrowRight'].includes(event.key)
          )
            return
          event.preventDefault()
          event.currentTarget.scrollLeft += event.key === 'ArrowLeft' ? -180 : 180
        }}
        onPointerDown={(event) => {
          if (event.button !== 0) return
          down.current = {
            x: event.clientX,
            scroll: event.currentTarget.scrollLeft,
            dragged: false,
          }
        }}
        onPointerMove={(event) => {
          if (!down.current || !event.buttons) return
          const dx = event.clientX - down.current.x
          if (Math.abs(dx) > 6) {
            down.current.dragged = true
            event.currentTarget.setPointerCapture(event.pointerId)
            event.currentTarget.scrollLeft = down.current.scroll - dx
          }
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId)
        }}
        onPointerCancel={() => {
          down.current = null
        }}
        onClickCapture={(event) => {
          if (event.detail > 0 && down.current?.dragged) {
            event.preventDefault()
            event.stopPropagation()
            down.current = null
          }
        }}
      >
        <div ref={world} className="pixel-world">
          <Image
            className="pixel-backdrop"
            src="/images/pixel-town/town.webp"
            width={1672}
            height={941}
            alt=""
            loading="eager"
            unoptimized
            draggable={false}
          />
          {doors.map((door, index) => (
            <Link
              key={index}
              className={`pixel-door pixel-door-${index}`}
              href={props.hrefs[index]!}
              style={{
                left: `${door.x}%`,
                top: `${door.y}%`,
                width: `${door.w}%`,
                height: `${door.h}%`,
              }}
              aria-label={
                props.zh
                  ? `${props.labels[index]} · ${index === 3 ? '留句话' : '走进去'}`
                  : `${props.labels[index]} · ${index === 3 ? 'Leave a note' : 'Step inside'}`
              }
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                event.preventDefault()
                enter(index)
              }}
            >
              <span className="pixel-spark" aria-hidden="true">
                ✦
              </span>
              <span className="pixel-tooltip">{props.labels[index]} ↗</span>
            </Link>
          ))}
          {props.latestPost && (
            <Link className="pixel-latest-notice" href={props.latestPost.href}>
              <span>{props.zh ? '写作屋 · 新故事' : 'Writing room · New story'}</span>
              <strong>{props.latestPost.title}</strong>
              <span>{props.zh ? '翻开看看 ↗' : 'Read the story ↗'}</span>
            </Link>
          )}
          <button
            ref={(el) => {
              sprites.current[0] = el
            }}
            className="pixel-actor pixel-dog"
            onClick={props.onDog}
            aria-label={props.zh ? '看看狗狗推荐的文章' : 'See the dog’s reading recommendation'}
          >
            <span className="pixel-sprite" />
            <span className="dog-heart" aria-hidden="true">
              ♥
            </span>
          </button>
          {['reader', 'gardener'].map((name, i) => (
            <div
              key={name}
              ref={(el) => {
                sprites.current[i + 1] = el
              }}
              className={`pixel-actor pixel-${name}`}
              aria-hidden="true"
            >
              <span className="pixel-sprite" />
            </div>
          ))}
          <span className="water-glint water-glint-one" aria-hidden="true" />
          <span className="water-glint water-glint-two" aria-hidden="true" />
        </div>
      </div>
      <div className="pixel-hud">
        <p>{props.zh ? '随便逛逛，故事就在门后。' : 'Wander a little. Find a story.'}</p>
        <nav aria-label={props.zh ? '小镇入口' : 'Town destinations'}>
          {props.labels.slice(0, 4).map((label, index) => (
            <Link
              key={label}
              href={props.hrefs[index]!}
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                event.preventDefault()
                enter(index)
              }}
            >
              <MapPin size={13} />
              {label}
            </Link>
          ))}
          <button
            aria-pressed={paused}
            aria-label={
              props.zh
                ? paused
                  ? '继续小镇活动'
                  : '暂停小镇活动'
                : paused
                  ? 'Resume town life'
                  : 'Pause town life'
            }
            onClick={() => setPaused(!paused)}
          >
            {paused ? <Play size={15} /> : <Pause size={15} />}
          </button>
        </nav>
      </div>
      <div className="pixel-pan-controls">
        <button
          onClick={() => {
            viewport.current!.scrollLeft -= 220
          }}
          aria-label={props.zh ? '向左逛逛' : 'Explore left'}
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={() => {
            viewport.current!.scrollLeft += 220
          }}
          aria-label={props.zh ? '向右逛逛' : 'Explore right'}
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
