'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowUpRight, Pause, Play, Rabbit, Terminal, X } from 'lucide-react'

type Post = { title: string; slug: string; date: string }

function DigitalRain({ paused }: { paused: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let previous = 0
    let width = 0
    let height = 0
    const glyphs = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ012345789:<>∆'
    let streams: { x: number; y: number; speed: number; length: number; chars: string[] }[] = []
    function resize() {
      width = canvas!.clientWidth
      height = canvas!.clientHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = width * ratio
      canvas!.height = height * ratio
      context!.setTransform(ratio, 0, 0, ratio, 0, 0)
      streams = Array.from({ length: Math.ceil(width / 22) }, (_, i) => ({
        x: i * 22,
        y: Math.random() * (height + 500),
        speed: 16 + Math.random() * 36,
        length: 10 + Math.floor(Math.random() * 24),
        chars: Array.from({ length: 36 }, () =>
          glyphs.charAt(Math.floor(Math.random() * glyphs.length))
        ),
      }))
      draw(0)
    }
    function draw(delta: number) {
      context!.clearRect(0, 0, width, height)
      context!.font = '14px monospace'
      for (const stream of streams) {
        stream.y += delta * stream.speed
        if (stream.y - stream.length * 20 > height) stream.y = -20
        for (let j = 0; j < stream.length; j++) {
          const opacity = (1 - j / stream.length) * 0.65
          context!.fillStyle = j === 0 ? 'rgba(200,255,210,.85)' : `rgba(66,190,100,${opacity})`
          context!.fillText(stream.chars[j] ?? '0', stream.x, stream.y - j * 20)
        }
      }
    }
    function tick(now: number) {
      if (now - previous >= 50) {
        draw(previous ? Math.min((now - previous) / 1000, 0.1) : 0)
        previous = now
      }
      frame = requestAnimationFrame(tick)
    }
    function sync() {
      cancelAnimationFrame(frame)
      previous = 0
      if (!paused && !reduced.matches && !document.hidden) frame = requestAnimationFrame(tick)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    reduced.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    sync()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      reduced.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [paused])

  return <canvas ref={ref} className="matrix-rain" aria-hidden="true" />
}

export function MatrixTerminal({ posts }: { posts: Post[] }) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [])
  const [paused, setPaused] = useState(false)
  const [rabbit, setRabbit] = useState(false)
  const rabbitRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (rabbit) closeRef.current?.focus()
  }, [rabbit])

  function closeRabbit() {
    setRabbit(false)
    rabbitRef.current?.focus()
  }

  return (
    <div className="matrix-world" data-paused={paused}>
      <DigitalRain paused={paused} />
      <div className="matrix-vignette" aria-hidden="true" />
      <header className="matrix-header">
        <Link href="/" className="matrix-wordmark" aria-label="Orion 矩阵首页">
          <Terminal size={19} /> ORION<span>_</span>
        </Link>
        <nav aria-label="矩阵导航">
          <a href="#transmissions">传输记录</a>
          <Link href="/works">程序</Link>
          <Link href="/about">身份档案</Link>
        </nav>
        <Link href="/classic" className="matrix-exit">
          退出矩阵 <ArrowUpRight size={13} />
        </Link>
      </header>

      <section className="matrix-hero" aria-labelledby="matrix-title">
        <div className="matrix-coordinate" aria-hidden="true">
          SYS / CONSTRUCT
          <br />
          PERSONAL TERMINAL
          <br />
          <span>ORIONCHEN.ME</span>
        </div>
        <div className="matrix-hero-copy">
          <h1 id="matrix-title" ref={headingRef} tabIndex={-1}>
            <span>Wake up,</span>
            <br />
            Orion<span className="matrix-period">.</span>
            <span className="matrix-cursor" aria-hidden="true">
              _
            </span>
          </h1>
          <p className="matrix-message">The world is more than what you see.</p>
          <p className="matrix-intro">
            在代码与现实之间，寻找另一种可能。
            <br />
            我是 Orion，写代码，也记录这个世界。
          </p>
          <a className="matrix-enter" href="#transmissions">
            <span>进入我的世界</span>
            <ArrowDown size={16} />
          </a>
          <button
            ref={rabbitRef}
            className="matrix-rabbit"
            onClick={() => setRabbit(true)}
            aria-expanded={rabbit}
            aria-controls="rabbit-hole"
          >
            <Rabbit size={22} strokeWidth={1.4} />
            <span>Follow the white rabbit.</span>
          </button>
        </div>
        <div className="matrix-side-note" aria-hidden="true">
          <span>你所看见的，</span>
          <span>并非全部。</span>
        </div>
        <div className="matrix-bottom-line">
          <span>
            <i /> CONSTRUCT RUNNING
          </span>
          <span>
            SCROLL TO DECODE <ArrowDown size={12} />
          </span>
          <span>THERE IS NO SPOON.</span>
        </div>
      </section>

      <section className="matrix-archive" id="transmissions" aria-labelledby="transmission-title">
        <div className="matrix-archive-head">
          <h2 id="transmission-title">
            传输记录<span> / transmissions</span>
          </h2>
          <Link href="/blog">
            全部文章 <ArrowUpRight size={14} />
          </Link>
        </div>
        <p className="matrix-command">
          <span>orion@construct:~$</span> ls writing/ --latest
          <span className="matrix-small-cursor" aria-hidden="true" />
        </p>
        <div className="matrix-posts">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug}>
              <time dateTime={post.date}>{post.date.slice(0, 10).replaceAll('-', '.')}</time>
              <h3>{post.title}</h3>
              <ArrowUpRight size={19} />
            </Link>
          ))}
        </div>
        <div className="matrix-destinations">
          <Link href="/works">
            <span>./programs</span>可运行的想法 <ArrowUpRight size={15} />
          </Link>
          <Link href="/learning">
            <span>./knowledge</span>知识地图 <ArrowUpRight size={15} />
          </Link>
          <Link href="/reading">
            <span>./library</span>阅读存档 <ArrowUpRight size={15} />
          </Link>
          <Link href="/guestbook">
            <span>./contact</span>留下信号 <ArrowUpRight size={15} />
          </Link>
        </div>
        <footer className="matrix-footer">
          <span>ORION CHEN © {new Date().getFullYear()}</span>
          <span>保持好奇。保持清醒。</span>
          <button onClick={() => setPaused(!paused)} aria-pressed={paused}>
            {paused ? <Play size={13} /> : <Pause size={13} />}
            {paused ? '播放字符雨' : '暂停字符雨'}
          </button>
        </footer>
      </section>
      {rabbit && (
        <aside
          id="rabbit-hole"
          className="matrix-rabbit-hole"
          aria-label="白兔的秘密入口"
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeRabbit()
          }}
        >
          <div>
            <Rabbit size={26} />
            <button ref={closeRef} onClick={closeRabbit} aria-label="关闭白兔入口">
              <X size={19} />
            </button>
          </div>
          <p>Knock, knock, Orion.</p>
          <p>
            你找到了矩阵里的另一条路。
            <br />
            这里收集了一些不太正经、但可以亲手玩的想法。
          </p>
          <a href="https://huccct.github.io/vibe/">
            进入 Vibe 实验室 <ArrowUpRight size={17} />
          </a>
        </aside>
      )}
    </div>
  )
}
