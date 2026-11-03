'use client'

import {
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type ComponentType,
} from 'react'
import Link from 'next/link'
import { Select } from '@base-ui/react/select'
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
  ChevronsDownUp,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import './nestjs-explorer.css'
import './nestjs-mindmap.css'

import { layoutKnowledgeMap, groupKey } from './map-layout'
import type { MapBranch, MapConcept, MapNote } from './map-types'
export type { MapBranch, MapConcept, MapNote } from './map-types'
const colors = ['#5f856e', '#8f7846', '#618994', '#a87561', '#8a77a0', '#6e85aa']
type WorkspaceProps = {
  title: string
  subtitle: string
  branches: MapBranch[]
  concepts: MapConcept[]
  conceptNotes: Record<string, MapNote>
  modes: string[]
  reference?: ReactNode
  experimentFor: (concept: MapConcept) => string | null
  Experiment: ComponentType<{ mode: string; onExplore: (id: string) => void }>
}
type Camera = { x: number; y: number; scale: number }

export function KnowledgeMapWorkspace({
  title,
  subtitle,
  branches,
  concepts,
  conceptNotes,
  modes,
  reference,
  experimentFor,
  Experiment,
}: WorkspaceProps) {
  const [search, setSearch] = useState('')
  const locatorSelected = useRef(false)
  const matches = concepts.filter((node) =>
    `${node.name} ${node.group ?? ''} ${node.role}`
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  )
  const [mode, setMode] = useState('知识地图')
  const [selected, setSelected] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState<string[]>(() => branches.map((branch) => branch.id))
  const allGroups = useMemo(
    () => [...new Set(concepts.map((node) => groupKey(node.branch, node.group ?? '核心概念')))],
    [concepts]
  )
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>(() => [
    ...new Set(concepts.map((node) => groupKey(node.branch, node.group ?? '核心概念'))),
  ])
  const layout = useMemo(
    () => layoutKnowledgeMap(branches, concepts, collapsed, collapsedGroups),
    [branches, concepts, collapsed, collapsedGroups]
  )
  const initialBounds = useRef(layout.bounds)
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
    const bounds = layout.bounds
    const scale = Math.max(
      0.05,
      Math.min(1, (el.clientWidth - 48) / bounds.width, (el.clientHeight - 48) / bounds.height)
    )
    setCamera({ x: el.clientWidth / 2, y: el.clientHeight / 2, scale })
  }, [layout.bounds])
  useEffect(() => {
    const el = viewport.current
    if (!el) return
    let previous: { width: number; height: number } | null = null
    const observer = new ResizeObserver(() => {
      const width = el.clientWidth,
        height = el.clientHeight
      if (!width || !height) return
      if (!previous) {
        const bounds = initialBounds.current
        const scale =
          width < 640
            ? 0.65
            : Math.max(
                0.05,
                Math.min(1, (width - 48) / bounds.width, (height - 48) / bounds.height)
              )
        setCamera({ x: width / 2, y: height / 2, scale })
      } else {
        const dx = (width - previous.width) / 2,
          dy = (height - previous.height) / 2
        setCamera((old) => ({ ...old, x: old.x + dx, y: old.y + dy }))
      }
      previous = { width, height }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  const zoom = useCallback((factor: number, px?: number, py?: number) => {
    const el = viewport.current
    if (!el) return
    const x = px ?? el.clientWidth / 2,
      y = py ?? el.clientHeight / 2
    setCamera((old) => {
      const scale = Math.max(0.05, Math.min(2, old.scale * factor))
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
    if (node)
      setCollapsedGroups((old) =>
        old.filter((item) => item !== groupKey(node.branch, node.group ?? '核心概念'))
      )
    setSelected(id)
    setShowReference(false)
    setMode('知识地图')
  }
  function changeMode(next: string) {
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
            {title} <span>知识地图</span>
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
      <div className="mindmap-discovery">
        <p>
          {branches.length} 个领域 · {concepts.length} 个概念{' '}
          <span>从领域展开到子主题，再选择概念</span>
        </p>
        <div className="mindmap-search">
          <input
            type="search"
            aria-label="搜索知识概念"
            placeholder="搜索概念或子主题"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select.Root
            items={concepts.map((node) => ({ value: node.id, label: node.name }))}
            modal={false}
            onOpenChange={(open) => {
              if (open) locatorSelected.current = false
            }}
            value={matches.some((node) => node.id === selected) ? selected : null}
            onValueChange={(id) => {
              if (id) {
                locatorSelected.current = true
                explore(id)
              }
            }}
          >
            <Select.Trigger className="mindmap-locator" aria-label="定位概念">
              <Select.Value placeholder={search ? `${matches.length} 个匹配概念` : '定位概念…'} />
              <Select.Icon>
                <ChevronDown size={14} />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner
                className="mindmap-locator-positioner"
                align="end"
                sideOffset={6}
                alignItemWithTrigger={false}
              >
                <Select.Popup
                  className="mindmap-locator-popup"
                  finalFocus={() => (locatorSelected.current ? detail.current : true)}
                >
                  <div className="mindmap-locator-heading">{matches.length} 个概念</div>
                  <Select.List className="mindmap-locator-list">
                    {branches.map((item) => {
                      const items = matches.filter((node) => node.branch === item.id)
                      if (!items.length) return null
                      return (
                        <Select.Group key={item.id}>
                          <Select.GroupLabel className="mindmap-locator-group">
                            {item.title}
                          </Select.GroupLabel>
                          {items.map((node) => (
                            <Select.Item
                              key={node.id}
                              value={node.id}
                              className="mindmap-locator-item"
                            >
                              <Select.ItemText>{node.name}</Select.ItemText>
                              <Select.ItemIndicator>
                                <Check size={14} />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Group>
                      )
                    })}
                    {!matches.length && (
                      <p className="mindmap-locator-empty">没有匹配概念，试试其他关键词。</p>
                    )}
                  </Select.List>
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>
      <div className="mindmap-body">
        <div
          className="mindmap-canvas"
          ref={viewport}
          tabIndex={0}
          aria-label={`${title} 可拖动知识地图，方向键平移，加减号缩放，0 适应画布`}
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
              width: 1,
              height: 1,
              transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
            }}
          >
            <svg
              width={layout.bounds.width}
              height={layout.bounds.height}
              viewBox={`${layout.bounds.x} ${layout.bounds.y} ${layout.bounds.width} ${layout.bounds.height}`}
              style={{ left: layout.bounds.x, top: layout.bounds.y }}
              className="mindmap-lines"
              aria-hidden="true"
            >
              {layout.edges.map((edge) => {
                const from =
                  edge.from === 'root'
                    ? layout.root
                    : layout.positions.find((p) => p.id === edge.from)!
                const to = layout.positions.find((p) => p.id === edge.to)!
                const x1 = to.right ? from.x + from.width : from.x
                const x2 = to.right ? to.x : to.x + to.width
                const y1 = from.y + from.height / 2,
                  y2 = to.y + to.height / 2,
                  mid = (x1 + x2) / 2
                return (
                  <path
                    key={edge.to}
                    d={`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`}
                    stroke={colors[edge.colorIndex % colors.length]}
                    strokeWidth={edge.from === 'root' ? 3 : 1.5}
                    fill="none"
                  />
                )
              })}
            </svg>
            <button
              type="button"
              className="mindmap-center"
              style={{ left: -90, top: -36 }}
              aria-label={`${title}，返回领域总览`}
              onClick={() => {
                setCollapsed(branches.map((branch) => branch.id))
                setCollapsedGroups(allGroups)
                const el = viewport.current
                if (el) {
                  const overview = layoutKnowledgeMap(
                    branches,
                    concepts,
                    branches.map((branch) => branch.id),
                    allGroups
                  )
                  const scale = Math.max(
                    0.05,
                    Math.min(
                      1,
                      (el.clientWidth - 48) / overview.bounds.width,
                      (el.clientHeight - 48) / overview.bounds.height
                    )
                  )
                  setCamera({ x: el.clientWidth / 2, y: el.clientHeight / 2, scale })
                }
              }}
            >
              <strong>{title}</strong>
              <span>{subtitle}</span>
            </button>
            {layout.positions.map((node) => {
              const closed =
                node.kind === 'branch'
                  ? collapsed.includes(node.branch)
                  : collapsedGroups.includes(node.id)
              const item = branches.find((branch) => branch.id === node.branch)!
              return (
                <button
                  key={node.id}
                  id={`map-node-${node.id}`}
                  type="button"
                  className={
                    node.kind === 'concept'
                      ? 'mindmap-node'
                      : node.kind === 'group'
                        ? 'mindmap-group'
                        : 'mindmap-branch'
                  }
                  style={
                    {
                      left: node.x,
                      top: node.y,
                      width: node.width,
                      height: node.height,
                      '--branch-color': colors[node.colorIndex % colors.length],
                    } as CSSProperties
                  }
                  aria-pressed={node.kind === 'concept' ? selected === node.id : undefined}
                  aria-expanded={node.kind !== 'concept' ? !closed : undefined}
                  aria-label={
                    node.kind === 'concept'
                      ? node.label
                      : `${closed ? '展开' : '收起'}${node.label}${node.kind === 'branch' ? '分支' : '子主题'}`
                  }
                  onClick={() => {
                    if (node.kind === 'concept') explore(node.id)
                    else if (node.kind === 'branch') toggle(node.branch)
                    else
                      setCollapsedGroups((old) =>
                        old.includes(node.id)
                          ? old.filter((id) => id !== node.id)
                          : [...old, node.id]
                      )
                  }}
                >
                  {node.kind === 'concept' ? (
                    node.label
                  ) : (
                    <>
                      <span>
                        <strong>{node.label}</strong>
                        <small>
                          {node.kind === 'branch' ? item.question : `${node.count} 个概念`}
                        </small>
                      </span>
                      {closed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                    </>
                  )}
                </button>
              )
            })}
          </div>
        </div>
        {mode !== '知识地图' && (
          <div className="mindmap-experiment" key={mode}>
            <Experiment mode={mode} onExplore={explore} />
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
                  <div className="nest-breadcrumb">
                    {title} / {branch.title} / {concept.group ?? '核心概念'}
                  </div>
                  <h3>{concept.name}</h3>
                  <p className="nest-role">{concept.role}</p>
                  <p className="nest-note">
                    {concept.level ?? '基础'} · 概念说明已提供 ·{' '}
                    {experimentFor(concept)
                      ? '可进入相关教学实验'
                      : '暂无专项交互实验，先完成下方练习目标'}
                  </p>
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
                  {notes.code && (
                    <details key={concept.id} className="nest-code">
                      <summary>按需看代码片段</summary>
                      <p className="nest-note">
                        示意片段，省略导入与项目上下文；不是完整可运行项目。
                      </p>
                      <pre>
                        <code>{notes.code}</code>
                      </pre>
                    </details>
                  )}
                  <a href={concept.docs} target="_blank" rel="noreferrer">
                    查阅官方文档 <ArrowRight size={14} aria-hidden="true" />
                  </a>
                  <div className="mindmap-inspector-actions">
                    {experimentFor(concept) && (
                      <button type="button" onClick={() => changeMode(experimentFor(concept)!)}>
                        进入相关实验
                        <ArrowRight size={14} />
                      </button>
                    )}
                    <button type="button" onClick={() => changeMode('理解检查')}>
                      基础理解检查
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
            领域 → 子主题 → 概念 · 连线表示分组 · 拖拽 / 缩放
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
            <button type="button" aria-label="展开所有领域" onClick={() => setCollapsed([])}>
              <RotateCcw size={16} />
            </button>
            <button
              type="button"
              aria-label="收起全部分支"
              onClick={() => {
                setCollapsed(branches.map((branch) => branch.id))
                setCollapsedGroups(allGroups)
              }}
            >
              <ChevronsDownUp size={16} />
            </button>
          </div>
          <span className="mindmap-count">
            {branches.length} 个主干 · {concepts.length} 个概念
          </span>
        </footer>
      )}
    </div>
  )
}
