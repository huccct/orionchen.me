'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { reactReflections, renderTrace, type UpdateMode } from './react-data'
import './react-explorer.css'
import { KnowledgeMapWorkspace } from './knowledge-map-workspace'
import { reactMapBranches, reactMapConcepts, reactMapNotes } from './react-map-data'

export function ReactExplorer({ reference }: { reference: ReactNode }) {
  return (
    <KnowledgeMapWorkspace
      title="React"
      subtitle="用数据描述界面"
      branches={reactMapBranches}
      concepts={reactMapConcepts}
      conceptNotes={reactMapNotes}
      modes={['知识地图', '渲染实验', '理解检查']}
      reference={reference}
      experimentFor={() => '渲染实验'}
      Experiment={ReactMapActivities}
    />
  )
}

function ReactMapActivities({
  mode,
  onExplore,
}: {
  mode: string
  onExplore: (id: string) => void
}) {
  return (
    <ReactActivities
      mode={mode}
      explore={(id) => onExplore(reactMapConcepts.find((node) => node.branch === id)?.id ?? id)}
    />
  )
}

function ReactActivities({ mode, explore }: { mode: string; explore: (id: string) => void }) {
  const workspace = useRef<HTMLElement>(null)
  const timeline = useRef<HTMLElement>(null)
  const [updateMode, setUpdateMode] = useState<UpdateMode>('replace')
  const [prediction, setPrediction] = useState<number | null>(null)
  const [step, setStep] = useState(-1)
  const [reflection, setReflection] = useState(0)
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})
  const trace = renderTrace(updateMode)
  const current = trace[Math.max(step, 0)]!
  const task = reactReflections[reflection]!
  useEffect(() => {
    workspace.current?.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true })
  }, [mode])
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
    <div className="react-learning react-activities">
      <section ref={workspace} className="react-workspace">
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
              仅保留在当前练习视图，切换视图、刷新或离开后清空；不上传、不自动评分。
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
      </section>
    </div>
  )
}
