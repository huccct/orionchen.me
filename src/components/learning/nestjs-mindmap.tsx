'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Minus,
  Plus,
  Scan,
  X,
  BookOpen,
  MousePointer2,
  RotateCcw,
} from 'lucide-react'
import { branches, concepts, conceptNotes } from './nestjs-data'
import { RequestWalkthrough, ModuleWorkshop, Practice } from './nestjs-explorer'
import { ThemeToggle } from '@/components/theme-toggle'
import './nestjs-mindmap.css'

const W = 1420,
  H = 920
const colors = ['#5f856e', '#8f7846', '#618994', '#a87561', '#8a77a0', '#6e85aa']
const modes = ['知识地图', '请求实验', '模块实验', '理解检查'] as const
type Mode = (typeof modes)[number]
type Camera = { x: number; y: number; scale: number }

export function NestjsExplorer({ reference }: { reference?: ReactNode }) {
  const [mode, setMode] = useState<Mode>('知识地图')
  const [selected, setSelected] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState<string[]>([])
  const [showReference, setShowReference] = useState(false)
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, scale: 1 })
  const [dragging, setDragging] = useState(false)
  const viewport = useRef<HTMLDivElement>(null)
  const drag = useRef<{ id: number; x: number; y: number; camera: Camera } | null>(null)
  const detail = useRef<HTMLElement>(null)
  const lastNode = useRef<string | null>(null)
  const concept = concepts.find((item) => item.id === selected)
  const branch = branches.find((item) => item.id === concept?.branch)
  const notes = concept ? conceptNotes[concept.id] : undefined

  const fit = useCallback(() => {
    const el = viewport.current
    if (!el) return
    const scale = Math.max(0.22, Math.min(1, (el.clientWidth - 48) / W, (el.clientHeight - 48) / H))
    setCamera({ x: (el.clientWidth - W * scale) / 2, y: (el.clientHeight - H * scale) / 2, scale })
  }, [])
  useEffect(() => {
    const el = viewport.current
    if (!el) return
    let previous: { width: number; height: number } | null = null
    const observer = new ResizeObserver(() => {
      const width = el.clientWidth,
        height = el.clientHeight
      if (!width || !height) return
      if (!previous) {
        if (width < 640) {
          const scale = 0.65
          setCamera({ scale, x: (width - W * scale) / 2, y: (height - H * scale) / 2 })
        } else fit()
      } else {
        const dx = (width - previous.width) / 2,
          dy = (height - previous.height) / 2
        setCamera((old) => ({ ...old, x: old.x + dx, y: old.y + dy }))
      }
      previous = { width, height }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [fit])
  const zoom = useCallback((factor: number, px?: number, py?: number) => {
    const el = viewport.current
    if (!el) return
    const x = px ?? el.clientWidth / 2,
      y = py ?? el.clientHeight / 2
    setCamera((old) => {
      const scale = Math.max(0.22, Math.min(2, old.scale * factor))
      const ratio = scale / old.scale
      return { scale, x: x - (x - old.x) * ratio, y: y - (y - old.y) * ratio }
    })
  }, [])
  useEffect(() => {
    const el = viewport.current
    if (!el) return
    function wheel(event: WheelEvent) {
      event.preventDefault()
      const rect = el!.getBoundingClientRect()
      if (event.ctrlKey || event.metaKey)
        zoom(Math.exp(-event.deltaY * 0.008), event.clientX - rect.left, event.clientY - rect.top)
      else setCamera((old) => ({ ...old, x: old.x - event.deltaX, y: old.y - event.deltaY }))
    }
    el.addEventListener('wheel', wheel, { passive: false })
    return () => el.removeEventListener('wheel', wheel)
  }, [zoom])
  useEffect(() => {
    if (selected || showReference) detail.current?.focus()
  }, [selected, showReference])

  function closeDetail() {
    setSelected(null)
    setShowReference(false)
    requestAnimationFrame(() => {
      const node = document.getElementById(`map-node-${lastNode.current}`)
      if (node) node.focus()
      else viewport.current?.focus()
    })
  }
  function explore(id: string) {
    const node = concepts.find((item) => item.id === id)
    lastNode.current = id
    setCollapsed((old) => old.filter((item) => item !== node?.branch))
    setSelected(id)
    setShowReference(false)
    setMode('知识地图')
  }
  function changeMode(next: Mode) {
    setMode(next)
    setSelected(null)
    setShowReference(false)
  }
  function toggle(id: string) {
    setCollapsed((old) => (old.includes(id) ? old.filter((item) => item !== id) : [...old, id]))
  }

  return (
    <div className="nest-learning mindmap-app">
      <header className="mindmap-toolbar">
        <div className="mindmap-brand">
          <Link href="/learning" aria-label="返回知识地图">
            <ArrowLeft size={18} />
          </Link>
          <h1>
            NestJS <span>知识地图</span>
          </h1>
        </div>
        <nav aria-label="学习方式">
          {modes.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={mode === item}
              onClick={() => changeMode(item)}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="mindmap-tools">
          <select
            aria-label="定位概念"
            value={selected ?? ''}
            onChange={(event) => {
              if (event.target.value) explore(event.target.value)
            }}
          >
            <option value="">定位概念…</option>
            {branches.map((item) => (
              <optgroup key={item.id} label={item.title}>
                {concepts
                  .filter((node) => node.branch === item.id)
                  .map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
          <button
            type="button"
            aria-label="学习说明与参考"
            aria-pressed={showReference}
            onClick={() => {
              setShowReference(!showReference)
              setSelected(null)
            }}
          >
            <BookOpen size={18} />
          </button>
          <ThemeToggle label="切换主题" />
        </div>
      </header>
      <div className="mindmap-body">
        <div
          className="mindmap-canvas"
          ref={viewport}
          tabIndex={0}
          aria-label="NestJS 可拖动知识地图，方向键平移，加减号缩放，0 适应画布"
          hidden={mode !== '知识地图'}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return
            const offsets: Record<string, [number, number]> = {
              ArrowLeft: [60, 0],
              ArrowRight: [-60, 0],
              ArrowUp: [0, 60],
              ArrowDown: [0, -60],
            }
            if (offsets[event.key]) {
              event.preventDefault()
              const [x, y] = offsets[event.key]!
              setCamera((old) => ({ ...old, x: old.x + x, y: old.y + y }))
            }
            if (event.key === '+' || event.key === '=') {
              event.preventDefault()
              zoom(1.2)
            }
            if (event.key === '-') {
              event.preventDefault()
              zoom(1 / 1.2)
            }
            if (event.key === '0') fit()
            if (event.key === 'Escape') closeDetail()
          }}
          onPointerDown={(event) => {
            if (event.button !== 0 || (event.target as HTMLElement).closest('button,a')) return
            event.currentTarget.focus()
            event.currentTarget.setPointerCapture(event.pointerId)
            drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, camera }
            setDragging(true)
          }}
          onPointerMove={(event) => {
            const start = drag.current
            if (!start || start.id !== event.pointerId) return
            setCamera({
              ...start.camera,
              x: start.camera.x + event.clientX - start.x,
              y: start.camera.y + event.clientY - start.y,
            })
          }}
          onPointerUp={() => {
            drag.current = null
            setDragging(false)
          }}
          onPointerCancel={() => {
            drag.current = null
            setDragging(false)
          }}
          data-dragging={dragging}
        >
          <div
            className="mindmap-world"
            style={{
              width: W,
              height: H,
              transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
            }}
          >
            <svg width={W} height={H} className="mindmap-lines" aria-hidden="true">
              {branches.map((item, i) => {
                const right = i >= 3,
                  row = i % 3,
                  y = 190 + row * 270,
                  bx = right ? 920 : 330
                const leaves = concepts.filter((node) => node.branch === item.id)
                return (
                  <g key={item.id} stroke={colors[i]} fill="none">
                    <path
                      strokeWidth="3"
                      d={`M ${right ? 800 : 620} 456 C ${right ? 870 : 550} 456, ${right ? 850 : 570} ${y}, ${right ? bx : bx + 170} ${y}`}
                    />
                    {!collapsed.includes(item.id) &&
                      leaves.map((node, j) => {
                        const ly = y + (j - (leaves.length - 1) / 2) * 58
                        return (
                          <path
                            key={node.id}
                            strokeWidth="1.5"
                            d={`M ${right ? bx + 170 : bx} ${y} C ${right ? 1130 : 290} ${y}, ${right ? 1120 : 290} ${ly}, ${right ? 1160 : 260} ${ly}`}
                          />
                        )
                      })}
                  </g>
                )
              })}
            </svg>
            <button
              type="button"
              className="mindmap-center"
              style={{ left: 620, top: 420 }}
              onClick={() => {
                setCollapsed([])
                fit()
              }}
              aria-label="NestJS，展开全部并适应画布"
            >
              <strong>NestJS</strong>
              <span>构建一个后端系统</span>
            </button>
            {branches.map((item, i) => {
              const right = i >= 3,
                y = 190 + (i % 3) * 270,
                bx = right ? 920 : 330,
                closed = collapsed.includes(item.id),
                leaves = concepts.filter((node) => node.branch === item.id)
              return (
                <div key={item.id} style={{ '--branch-color': colors[i] } as CSSProperties}>
                  <button
                    className="mindmap-branch"
                    type="button"
                    style={{ left: bx, top: y - 35 }}
                    aria-expanded={!closed}
                    aria-label={`${closed ? '展开' : '收起'}${item.title}分支`}
                    onClick={() => toggle(item.id)}
                  >
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.question}</small>
                    </span>
                    {closed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {!closed &&
                    leaves.map((node, j) => (
                      <button
                        id={`map-node-${node.id}`}
                        key={node.id}
                        className="mindmap-node"
                        style={{
                          left: right ? 1160 : 60,
                          top: y + (j - (leaves.length - 1) / 2) * 58 - 22,
                        }}
                        type="button"
                        aria-pressed={selected === node.id}
                        onClick={() => explore(node.id)}
                      >
                        {node.name}
                      </button>
                    ))}
                </div>
              )
            })}
          </div>
        </div>
        {mode !== '知识地图' && (
          <div className="mindmap-experiment" key={mode}>
            {mode === '请求实验' ? (
              <RequestWalkthrough />
            ) : mode === '模块实验' ? (
              <ModuleWorkshop />
            ) : (
              <Practice onExplore={explore} />
            )}
          </div>
        )}
        {((concept && branch && notes) || showReference) && (
          <aside
            className="mindmap-inspector"
            ref={detail}
            tabIndex={-1}
            aria-label={showReference ? '学习说明' : `${concept?.name} 详解`}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.stopPropagation()
                closeDetail()
              }
            }}
          >
            <button
              type="button"
              className="mindmap-close"
              aria-label="关闭详情，返回地图"
              onClick={closeDetail}
            >
              <X size={18} />
            </button>
            {showReference ? (
              <div className="prose mindmap-reference">{reference}</div>
            ) : (
              concept &&
              branch &&
              notes && (
                <div className="nest-detail">
                  <div className="nest-breadcrumb">NestJS / {branch.title}</div>
                  <h3>{concept.name}</h3>
                  <p className="nest-role">{concept.role}</p>
                  <h4>解决什么问题，为什么需要</h4>
                  <p>{concept.why}</p>
                  <h4>什么时候用</h4>
                  <p>{notes.when}</p>
                  <h4>常见误区</h4>
                  <p>{notes.pitfall}</p>
                  <h4>怎样接到上下游</h4>
                  <p>{concept.link}</p>
                  <div className="nest-related" aria-label="关联概念">
                    {notes.related.map((id) => {
                      const node = concepts.find((item) => item.id === id)!
                      return (
                        <button key={id} type="button" onClick={() => explore(id)}>
                          {node.name}
                          <ArrowRight size={12} aria-hidden="true" />
                        </button>
                      )
                    })}
                  </div>
                  <div className="nest-check">
                    <h4>理解了，就能做到</h4>
                    <p>{concept.check}</p>
                  </div>
                  <details key={concept.id} className="nest-code">
                    <summary>按需看代码片段</summary>
                    <p className="nest-note">
                      示意片段，省略导入与项目上下文；不是完整可运行项目。
                    </p>
                    <pre>
                      <code>{notes.code}</code>
                    </pre>
                  </details>
                  <a href={concept.docs} target="_blank" rel="noreferrer">
                    查阅官方文档 <ArrowRight size={14} aria-hidden="true" />
                  </a>
                  <div className="mindmap-inspector-actions">
                    <button
                      type="button"
                      onClick={() =>
                        changeMode(concept.branch === 'structure' ? '模块实验' : '请求实验')
                      }
                    >
                      进入实验
                      <ArrowRight size={14} />
                    </button>
                    <button type="button" onClick={() => changeMode('理解检查')}>
                      检查理解
                      <Check size={14} />
                    </button>
                  </div>
                </div>
              )
            )}
          </aside>
        )}
      </div>
      {mode === '知识地图' && (
        <footer className="mindmap-status">
          <span className="mindmap-hint">
            <MousePointer2 size={13} />
            拖动画布 · 点击节点 · Ctrl / ⌘ + 滚轮缩放
          </span>
          <div className="mindmap-zoom">
            <button type="button" aria-label="缩小地图" onClick={() => zoom(1 / 1.2)}>
              <Minus size={16} />
            </button>
            <button
              className="mindmap-scale"
              type="button"
              aria-label={`缩放比例 ${Math.round(camera.scale * 100)}%，点击恢复实际大小`}
              onClick={() => zoom(1 / camera.scale)}
            >
              {Math.round(camera.scale * 100)}%
            </button>
            <button type="button" aria-label="放大地图" onClick={() => zoom(1.2)}>
              <Plus size={16} />
            </button>
            <button type="button" aria-label="适应画布" onClick={fit}>
              <Scan size={17} />
            </button>
            <button type="button" aria-label="展开全部分支" onClick={() => setCollapsed([])}>
              <RotateCcw size={16} />
            </button>
          </div>
          <span className="mindmap-count">6 个主干 · 19 个概念</span>
        </footer>
      )}
    </div>
  )
}
