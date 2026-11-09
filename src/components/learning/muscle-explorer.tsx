'use client'

import { useRef, useState, type ReactNode, type CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowDown, BookOpen, Check } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { muscles, muscleSources, type BodyView, type Muscle } from './muscle-data'
import './muscle-explorer.css'

export function MuscleExplorer({ reference }: { reference: ReactNode }) {
  const [selected, setSelected] = useState(muscles[0]!.id)
  const [region, setRegion] = useState('全部部位')
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState<number | null>(null)
  const [showReference, setShowReference] = useState(false)
  const detail = useRef<HTMLElement>(null)
  const referenceSection = useRef<HTMLElement>(null)
  const referenceButton = useRef<HTMLButtonElement>(null)
  const current = muscles.find((muscle) => muscle.id === selected)!
  const visible = muscles.filter((muscle) => muscle.view === current.view)
  const matches = muscles.filter(
    (muscle) =>
      (region === '全部部位' || muscle.region === region) &&
      `${muscle.name} ${muscle.latin} ${muscle.actions}`
        .toLowerCase()
        .includes(query.trim().toLowerCase())
  )

  function select(muscle: Muscle, focusDetail = false) {
    setSelected(muscle.id)
    setAnswer(null)
    if (focusDetail)
      requestAnimationFrame(() => {
        detail.current?.focus({ preventScroll: true })
        if (window.matchMedia('(max-width: 900px)').matches)
          detail.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
      })
  }
  function changeView(view: BodyView) {
    if (view !== current.view) select(muscles.find((muscle) => muscle.view === view)!)
  }

  return (
    <div className="muscle-learning">
      <header className="muscle-toolbar">
        <Link href="/learning" aria-label="返回知识地图">
          <ArrowLeft size={18} />
        </Link>
        <h1>肌肉功能图谱</h1>
        <div className="muscle-toolbar-actions">
          <button
            type="button"
            aria-expanded={showReference}
            aria-controls="muscle-reference"
            ref={referenceButton}
            onClick={() => {
              setShowReference(!showReference)
              if (!showReference)
                requestAnimationFrame(() => {
                  referenceSection.current?.focus({ preventScroll: true })
                  referenceSection.current?.scrollIntoView({ block: 'start' })
                })
              else document.getElementById('muscle-atlas')?.scrollIntoView({ block: 'start' })
            }}
          >
            <BookOpen size={17} aria-hidden="true" />
            学习说明
          </button>
          <ThemeToggle label="切换主题" />
        </div>
      </header>
      <main className="muscle-scroll">
        <div className="muscle-layout">
          <section className="muscle-atlas" id="muscle-atlas" aria-label="可点击的人体解剖示意图">
            <div className="muscle-view-controls" aria-label="人体视角">
              {(['front', 'back'] as const).map((view) => (
                <button
                  type="button"
                  key={view}
                  aria-pressed={view === current.view}
                  onClick={() => changeView(view)}
                >
                  {view === 'front' ? '前视图' : '后视图'}
                </button>
              ))}
            </div>
            <figure>
              <div className="muscle-plate" data-view={current.view}>
                <Image
                  src="/images/learning/muscles/anatomy-plate.png"
                  alt={
                    current.view === 'front'
                      ? '人体肌肉前视教材改编图，一侧移除部分表层肌肉以展示深层组织'
                      : '人体肌肉后视教材改编图，肩背、臀部及小腿包含切开和深层展示'
                  }
                  width={1536}
                  height={1024}
                  sizes="(max-width: 900px) 180vw, 900px"
                  priority
                  draggable={false}
                />
                {visible.map((muscle) => (
                  <button
                    type="button"
                    key={muscle.id}
                    className="muscle-marker"
                    style={{ '--x': `${muscle.x}%`, '--y': `${muscle.y}%` } as CSSProperties}
                    aria-label={`${muscle.number} ${muscle.name}，查看功能`}
                    aria-pressed={selected === muscle.id}
                    title={muscle.name}
                    onClick={() => select(muscle, true)}
                  >
                    <span>{muscle.number}</span>
                  </button>
                ))}
              </div>
              <figcaption>点击编号查看作用 · 含深层切开示意，编号仅定位区域</figcaption>
            </figure>
            <button
              type="button"
              className="muscle-detail-jump"
              onClick={() => select(current, true)}
            >
              查看{current.name}的作用 <ArrowDown size={16} aria-hidden="true" />
            </button>
          </section>
          <section
            className="muscle-detail"
            ref={detail}
            tabIndex={-1}
            aria-labelledby="muscle-name"
          >
            <div className="muscle-detail-heading">
              <span className="muscle-detail-number" aria-hidden="true">
                {String(current.number).padStart(2, '0')}
              </span>
              <div>
                <h2 id="muscle-name">{current.name}</h2>
                <p lang="en">{current.latin}</p>
              </div>
            </div>
            <a className="muscle-map-return" href="#muscle-atlas">
              返回人体图
            </a>
            <p className="muscle-location">{current.location}</p>
            <h3>主要作用</h3>
            <p className="muscle-actions">{current.actions}</p>
            <h3>放进动作里理解</h3>
            <p>{current.example}</p>
            <h3>容易混淆</h3>
            <p>{current.pitfall}</p>
            <details className="muscle-check" key={current.id}>
              <summary>检验一下理解</summary>
              <p>{current.question}</p>
              <div className="muscle-answers">
                {current.choices.map((choice, index) => (
                  <button
                    type="button"
                    key={`${current.id}-${choice}`}
                    aria-pressed={answer === index}
                    onClick={() => setAnswer(index)}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              {answer !== null && (
                <p className="muscle-feedback" role="status">
                  {answer === current.answer
                    ? '判断正确。'
                    : `再想一想：${current.choices[current.answer]}。`}{' '}
                  {current.actions}
                </p>
              )}
            </details>
            <a
              className="muscle-source-link"
              href={muscleSources[current.source]}
              target="_blank"
              rel="noreferrer"
            >
              查阅 OpenStax 对应章节 ↗
            </a>
          </section>
          <details className="muscle-index">
            <summary>
              浏览全部肌肉 <span>19</span>
            </summary>
            <div className="muscle-index-content">
              <label htmlFor="muscle-search">查找肌肉或动作</label>
              <input
                id="muscle-search"
                type="search"
                placeholder="例如：伸膝、胸大肌"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <label htmlFor="muscle-region">按部位浏览</label>
              <select
                id="muscle-region"
                value={region}
                onChange={(event) => setRegion(event.target.value)}
              >
                {['全部部位', ...new Set(muscles.map((muscle) => muscle.region))].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
              <p className="muscle-index-count" role="status">
                {matches.length} / {muscles.length} 个肌肉或肌群
              </p>
              <div className="muscle-index-list">
                {matches.map((muscle) => (
                  <button
                    type="button"
                    key={muscle.id}
                    aria-pressed={selected === muscle.id}
                    onClick={() => select(muscle, true)}
                  >
                    <span>{String(muscle.number).padStart(2, '0')}</span>
                    {muscle.name}
                    <small>{muscle.view === 'front' ? '前' : '后'}</small>
                    {selected === muscle.id && <Check size={14} aria-hidden="true" />}
                  </button>
                ))}
              </div>
              {!matches.length && (
                <p className="muscle-empty">没有匹配项。试试肌肉名称，或切回“全部部位”。</p>
              )}
            </div>
          </details>
        </div>
        <section
          id="muscle-reference"
          ref={referenceSection}
          tabIndex={-1}
          aria-label="学习说明与来源"
          hidden={!showReference}
          className="muscle-reference"
        >
          <button
            type="button"
            className="muscle-reference-close"
            onClick={() => {
              setShowReference(false)
              referenceButton.current?.focus({ preventScroll: true })
              requestAnimationFrame(() =>
                document.getElementById('muscle-atlas')?.scrollIntoView({ block: 'start' })
              )
            }}
          >
            收起说明，返回图谱
          </button>
          <section className="muscle-basics" aria-label="理解功能的三个角度">
            <div>
              <h2>作用不等于动作名称</h2>
              <p>
                先说清哪一个关节、向哪个方向运动，再联系训练动作。一个动作通常需要多块肌肉协作。
              </p>
            </div>
            <div>
              <h2>不动，也可能在工作</h2>
              <p>
                肌肉可以缩短、被拉长或保持长度来产生张力。主动力、协同、拮抗和稳定角色取决于具体任务。
              </p>
            </div>
            <div>
              <h2>图像帮助定位</h2>
              <p>
                图中展示的是静态位置与局部切开视野，不能直接表示所有深层关系、收缩程度或疼痛来源。
              </p>
            </div>
          </section>
          <footer className="muscle-attribution">
            <p>为健身教练肌肉功能学习整理 · 尚未对照指定“新国职”教材版本。</p>
            <p>
              底图：OpenStax，
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noreferrer"
              >
                CC BY 4.0
              </a>
              。依据
              <a
                href="https://commons.wikimedia.org/wiki/File:Muscles;_anterior_view;_unlabeled.png"
                target="_blank"
                rel="noreferrer"
              >
                前视
              </a>
              与
              <a
                href="https://commons.wikimedia.org/wiki/File:Muscles;_posterior_view;_unlabeled.png"
                target="_blank"
                rel="noreferrer"
              >
                后视
              </a>
              插图，经 AI 清理旧引线、重排并添加交互标记；功能文字依据对应教材章节整理。
            </p>
          </footer>
          <div className="prose">{reference}</div>
        </section>
      </main>
    </div>
  )
}
