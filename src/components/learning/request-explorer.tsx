'use client'

import { useState, type ReactNode } from 'react'
import { KnowledgeMapWorkspace } from './knowledge-map-workspace'
import { requestBranches, requestCurriculum } from './request-data'
import { requestScenarios, requestTrace, type RequestScenario } from './request-trace'
import './react-explorer.css'

export function RequestExplorer({ reference }: { reference: ReactNode }) {
  return (
    <KnowledgeMapWorkspace
      title="一次请求的旅程"
      subtitle="从浏览器到服务端，再回来"
      branches={requestBranches}
      concepts={requestCurriculum.concepts}
      conceptNotes={requestCurriculum.notes}
      modes={['知识地图', '流式实验']}
      reference={reference}
      experimentFor={(concept) =>
        ['generation', 'buffering', 'sse', 'reader', 'render', 'abort', 'diagnosis'].includes(
          concept.id
        )
          ? '流式实验'
          : null
      }
      Experiment={RequestExperiment}
    />
  )
}

function RequestExperiment({ onExplore }: { mode: string; onExplore: (id: string) => void }) {
  const [scenario, setScenario] = useState<RequestScenario>('streaming')
  const [propagateCancel, setPropagateCancel] = useState(true)
  const [prediction, setPrediction] = useState<string | null>(null)
  const [step, setStep] = useState(-1)
  const trace = requestTrace(scenario, propagateCancel)
  const current = trace[Math.max(step, 0)]!
  function reset() {
    setStep(-1)
    setPrediction(null)
  }
  return (
    <div className="react-learning react-activities">
      <section className="react-workspace" aria-label="流式传输实验">
        <div className="react-heading">
          <h2>服务端在生成，为什么页面没有动？</h2>
          <p>
            同样的三段回答，改变传输条件，比较生成、缓冲、接收和显示。断开固定发生在第一段显示后。
          </p>
        </div>
        <div className="react-experiment-layout">
          <section className="react-experiment-input" aria-label="实验条件与预测">
            <fieldset>
              <legend>选择传输场景</legend>
              <div className="react-options">
                {(Object.keys(requestScenarios) as RequestScenario[]).map((value) => (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={scenario === value}
                    onClick={() => {
                      setScenario(value)
                      reset()
                    }}
                  >
                    {requestScenarios[value]}
                  </button>
                ))}
              </div>
            </fieldset>
            {scenario === 'disconnected' && (
              <label className="flex min-h-11 items-center gap-2">
                <input
                  type="checkbox"
                  checked={propagateCancel}
                  onChange={(event) => {
                    setPropagateCancel(event.target.checked)
                    reset()
                  }}
                />
                服务端将取消传给上游
              </label>
            )}
            <fieldset>
              <legend>先预测：最终页面显示什么？</legend>
              <div className="react-options">
                {['', '你好，', '你好，这是流式回答。'].map((value) => (
                  <button
                    type="button"
                    key={value}
                    disabled={step >= 0}
                    aria-pressed={prediction === value}
                    onClick={() => setPrediction(value)}
                  >
                    {value || '没有内容'}
                  </button>
                ))}
              </div>
            </fieldset>
            <button
              type="button"
              className="react-primary"
              disabled={prediction === null || step >= 0}
              onClick={() => setStep(0)}
            >
              开始推演
            </button>
            <p className="react-note">
              固定教学模型，无真实网络或模型调用。每段恰好是完整事件；真实读取块需要解码、拼接和解析，React
              也不保证一段对应一次绘制。
            </p>
          </section>
          <section className="react-timeline-panel" aria-label="请求时间线">
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
                <h3>先预测，再逐步观察</h3>
                <p>最终显示相同的内容，等待过程也可能完全不同。</p>
              </div>
            ) : (
              <div className="react-trace" aria-live="polite" aria-atomic="true">
                <p className="react-note">
                  第 {step + 1} / {trace.length} 步
                </p>
                <h3>{current.title}</h3>
                <p>{current.detail}</p>
                <dl className="my-6 grid gap-4 sm:grid-cols-2">
                  {(
                    [
                      ['服务端已生成', current.generated],
                      ['代理尚未发送', current.buffered],
                      ['浏览器已接收', current.received],
                      ['用户当前看到', current.visible],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label} className="min-w-0 border-t border-current/20 pt-3">
                      <dt className="text-sm opacity-70">{label}</dt>
                      <dd className="mt-2 text-lg break-words">{value || '（空）'}</dd>
                    </div>
                  ))}
                </dl>
                {step === trace.length - 1 && (
                  <p className="react-result">
                    {prediction === current.visible
                      ? '预测正确。'
                      : `实际显示：${current.visible || '没有内容'}。`}{' '}
                    {scenario === 'disconnected'
                      ? '切换取消传播，再比较服务端实际生成了多少。'
                      : '比较前几步：最终内容相同，不代表首段抵达时间相同。'}
                  </p>
                )}
              </div>
            )}
            <div className="react-controls">
              <button type="button" disabled={step <= 0} onClick={() => setStep(step - 1)}>
                上一步
              </button>
              <button
                type="button"
                disabled={step < 0 || step === trace.length - 1}
                onClick={() => setStep(step + 1)}
              >
                下一步
              </button>
              <button type="button" onClick={reset}>
                重新预测
              </button>
            </div>
            <button
              type="button"
              className="react-text-link"
              onClick={() =>
                onExplore(
                  scenario === 'disconnected'
                    ? 'abort'
                    : scenario === 'buffered'
                      ? 'buffering'
                      : 'sse'
                )
              }
            >
              回到相关概念
            </button>
          </section>
        </div>
      </section>
    </div>
  )
}
