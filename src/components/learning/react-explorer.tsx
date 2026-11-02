'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { reactConcepts, reactReflections, renderTrace, type UpdateMode } from './react-data'
import './react-explorer.css'

const modes = ['知识地图', '渲染实验', '理解检查', '深入资料'] as const

export function ReactExplorer({ reference }: { reference: ReactNode }) {
  const workspace = useRef<HTMLElement>(null)
  const inspector = useRef<HTMLElement>(null)
  const timeline = useRef<HTMLElement>(null)
  const focusConcept = useRef(false)
  const [mode, setMode] = useState<(typeof modes)[number]>('知识地图')
  const [selected, setSelected] = useState('components')
  const [updateMode, setUpdateMode] = useState<UpdateMode>('replace')
  const [prediction, setPrediction] = useState<number | null>(null)
  const [step, setStep] = useState(-1)
  const [reflection, setReflection] = useState(0)
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})
  const concept = reactConcepts.find((item) => item.id === selected)!
  const trace = renderTrace(updateMode)
  const current = trace[Math.max(step, 0)]!
  const task = reactReflections[reflection]!
  useEffect(() => {
    const target = focusConcept.current
      ? inspector.current
      : workspace.current?.querySelector<HTMLElement>('h2')
    focusConcept.current = false
    workspace.current?.scrollTo({ top: 0 })
    target?.focus({ preventScroll: true })
    if (target === inspector.current) target?.scrollIntoView({ block: 'start' })
  }, [mode])
  function selectConcept(id: string) {
    setSelected(id)
    inspector.current?.focus({ preventScroll: true })
    if (window.matchMedia('(max-width: 760px)').matches)
      inspector.current?.scrollIntoView({ block: 'start' })
  }
  function explore(id: string) {
    setSelected(id)
    focusConcept.current = true
    setMode('知识地图')
  }
  useEffect(() => {
    if (step !== 0) return
    timeline.current?.focus({ preventScroll: true })
    if (window.matchMedia('(max-width: 760px)').matches)
      timeline.current?.scrollIntoView({ block: 'start' })
  }, [step])
  function startExperiment() {
    setStep(0)
  }
  function reset(next: UpdateMode) {
    setUpdateMode(next)
    setPrediction(null)
    setStep(-1)
  }

  return (
    <div className="react-learning">
      <header className="react-toolbar">
        <div className="react-brand">
          <Link href="/learning" aria-label="回到知识地图">
            <ArrowLeft size={19} />
          </Link>
          <h1>React</h1>
        </div>
        <nav aria-label="React 学习视图">
          {modes.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={mode === item}
              onClick={() => setMode(item)}
            >
              {item === '深入资料' && <BookOpen size={15} aria-hidden="true" />}
              {item}
            </button>
          ))}
        </nav>
        <ThemeToggle />
      </header>
      <main ref={workspace} className="react-workspace">
        {mode === '知识地图' && (
          <>
            <div className="react-heading">
              <h2 tabIndex={-1}>页面为什么会变化？</h2>
              <p>从组件到状态，沿着六条主干建立联系。选择一个概念，展开它的用途与边界。</p>
            </div>
            <div className="react-map-layout">
              <section className="react-map" aria-label="React 六条知识主干">
                <div className="react-map-root">
                  <strong>React</strong>
                  <span>用数据描述界面</span>
                </div>
                <div className="react-branches">
                  {reactConcepts.map((item, index) => (
                    <button
                      type="button"
                      key={item.id}
                      aria-pressed={selected === item.id}
                      onClick={() => selectConcept(item.id)}
                    >
                      <span className="react-branch-title">{item.title}</span>
                      <span>{item.terms}</span>
                      <ArrowRight size={16} aria-hidden="true" />
                      <span className="react-branch-order" aria-hidden="true">
                        {index + 1}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="react-note">连线表示知识分组；阅读顺序从上到下，不代表运行顺序。</p>
              </section>
              <section
                ref={inspector}
                tabIndex={-1}
                className="react-inspector"
                aria-label="概念详情"
                aria-live="polite"
              >
                <h2 tabIndex={-1}>{concept.title}</h2>
                <h3>{concept.question}</h3>
                <p>{concept.description}</p>
                <h4>放进一个场景</h4>
                <p>{concept.example}</p>
                <h4>容易混淆的地方</h4>
                <p>{concept.mistake}</p>
                <h4>试着做到</h4>
                <p>{concept.task}</p>
                <div className="react-related">
                  <span>接着看</span>
                  {concept.related.map((id) => (
                    <button type="button" key={id} onClick={() => selectConcept(id)}>
                      {reactConcepts.find((item) => item.id === id)!.title}
                    </button>
                  ))}
                </div>
                <details key={concept.id}>
                  <summary>查看代码片段</summary>
                  <pre>
                    <code>{concept.code}</code>
                  </pre>
                  <p className="react-note">示意片段，省略导入与周边组件。</p>
                </details>
                <a className="react-doc" href={`https://react.dev/learn/${concept.doc}`}>
                  阅读 React 官方文档 <ArrowRight size={14} aria-hidden="true" />
                </a>
                <button className="react-primary" type="button" onClick={() => setMode('渲染实验')}>
                  动手看一次更新 <ArrowRight size={16} aria-hidden="true" />
                </button>
              </section>
            </div>
          </>
        )}
        {mode === '渲染实验' && (
          <>
            <div className="react-heading">
              <h2 tabIndex={-1}>点一次按钮，React 发生了什么？</h2>
              <p>初始 count = 0。同一个点击事件里连续更新三次，页面最后显示几？</p>
            </div>
            <div className="react-experiment-layout">
              <section className="react-experiment-input" aria-label="实验条件与预测">
                <fieldset>
                  <legend>选择更新方式</legend>
                  <div className="react-options">
                    {(['replace', 'updater'] as const).map((value) => (
                      <button
                        type="button"
                        key={value}
                        aria-pressed={updateMode === value}
                        onClick={() => reset(value)}
                      >
                        {value === 'replace' ? '直接传值' : '函数式更新'}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <pre>
                  <code>{`function handleClick() {\n${Array(3)
                    .fill(
                      updateMode === 'replace' ? '  setCount(count + 1)' : '  setCount(n => n + 1)'
                    )
                    .join('\n')}\n}`}</code>
                </pre>
                <fieldset>
                  <legend>先预测：最终显示几？</legend>
                  <div className="react-options">
                    {[0, 1, 3].map((value) => (
                      <button
                        type="button"
                        key={value}
                        disabled={step >= 0}
                        aria-pressed={prediction === value}
                        onClick={() => setPrediction(value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <button
                  type="button"
                  className="react-primary"
                  disabled={prediction === null || step >= 0}
                  onClick={startExperiment}
                >
                  触发模拟点击 <ArrowRight size={16} aria-hidden="true" />
                </button>
                <p className="react-note">
                  逐步教学模拟，不是真实调度器追踪。固定为一个同步事件；不计开发 Strict Mode
                  的额外调用。
                </p>
              </section>
              <section
                ref={timeline}
                tabIndex={-1}
                className="react-timeline-panel"
                aria-label="渲染时间线"
              >
                <ol className="react-timeline">
                  {trace.map((item, index) => (
                    <li key={item.title} data-active={step === index} data-done={step > index}>
                      <span>{index + 1}</span>
                      {item.title}
                    </li>
                  ))}
                </ol>
                {step < 0 ? (
                  <div className="react-await">
                    <h3>先做一个预测</h3>
                    <p>然后逐步观察：事件读取的值、队列计算的值、屏幕上的值，何时才会一致？</p>
                    <div className="react-dom">
                      <span>当前按钮文本</span>
                      <strong>0</strong>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="react-trace" aria-live="polite" aria-atomic="true">
                      <p className="react-note">第 {step + 1} / 4 步</p>
                      <h3>{current.title}</h3>
                      <p>{current.detail}</p>
                      <pre>
                        <code>{current.code}</code>
                      </pre>
                      <div className="react-values">
                        <div>
                          <span>当前计算结果</span>
                          <strong>{current.value}</strong>
                        </div>
                        <div>
                          <span>已提交 DOM 文本</span>
                          <strong>{current.dom}</strong>
                        </div>
                      </div>
                      {step === 3 && (
                        <p className="react-result">
                          {prediction === current.dom
                            ? '预测正确。'
                            : `你预测了 ${prediction}，实际结果是 ${current.dom}。`}
                          {updateMode === 'replace'
                            ? '三次替换为 1，不会累加。'
                            : '三个更新函数依次接收前一个结果，得到 3。'}
                        </p>
                      )}
                    </div>
                    <div className="react-controls">
                      <button type="button" disabled={step === 0} onClick={() => setStep(step - 1)}>
                        上一步
                      </button>
                      <button type="button" disabled={step === 3} onClick={() => setStep(step + 1)}>
                        下一步 <ArrowRight size={15} aria-hidden="true" />
                      </button>
                      <button type="button" onClick={() => reset(updateMode)}>
                        重新预测
                      </button>
                    </div>
                  </>
                )}
                <button type="button" className="react-text-link" onClick={() => explore('render')}>
                  回到「渲染与状态快照」
                </button>
              </section>
            </div>
          </>
        )}
        {mode === '理解检查' && (
          <div className="react-practice">
            <div className="react-heading">
              <h2 tabIndex={-1}>能解释，也能换个场景使用。</h2>
              <p>写下推理，再对照要点。这里不打分，也不把点击完成当作掌握。</p>
            </div>
            <div className="react-options">
              {reactReflections.map((item, index) => (
                <button
                  type="button"
                  key={item.title}
                  aria-pressed={reflection === index}
                  onClick={() => setReflection(index)}
                >
                  {item.title}
                </button>
              ))}
            </div>
            <h3>{task.prompt}</h3>
            <label htmlFor="react-reasoning">你的推理</label>
            <textarea
              id="react-reasoning"
              rows={6}
              value={responses[reflection] ?? ''}
              onChange={(event) => setResponses({ ...responses, [reflection]: event.target.value })}
              placeholder="我的判断是……因为……我会这样验证……"
            />
            <p className="react-note">
              仅保留在当前页面内存，刷新或离开后清空；不上传、不自动评分。
            </p>
            <details key={task.title}>
              <summary>看一点提示</summary>
              <p>{task.hint}</p>
            </details>
            <button
              type="button"
              className="react-primary"
              disabled={!responses[reflection]?.trim()}
              onClick={() => setRevealed({ ...revealed, [reflection]: true })}
            >
              对照推理要点
            </button>
            {revealed[reflection] && (
              <div className="react-result" role="status">
                <h3>检查你的解释是否覆盖这些关系</h3>
                <p>{task.criteria}</p>
              </div>
            )}
            <button type="button" className="react-text-link" onClick={() => explore(task.concept)}>
              回到相关概念 <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        )}
        {mode === '深入资料' && (
          <div className="react-reference">
            <h2 tabIndex={-1}>从这张地图继续</h2>
            <div className="prose">{reference}</div>
          </div>
        )}
      </main>
    </div>
  )
}
