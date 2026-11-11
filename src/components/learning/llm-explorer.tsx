'use client'

import { useRef, useState, type ReactNode } from 'react'
import { KnowledgeMapWorkspace } from './knowledge-map-workspace'
import { llmBranches, llmCurriculum } from './llm-data'
import { llmScenarios, llmTrace, type LlmScenario } from './llm-trace'
import './react-explorer.css'

export function LlmExplorer({ reference }: { reference: ReactNode }) {
  return (
    <KnowledgeMapWorkspace
      title="大模型基础与接入"
      subtitle="从一次请求到可用结果"
      branches={llmBranches}
      concepts={llmCurriculum.concepts}
      conceptNotes={llmCurriculum.notes}
      modes={['知识地图', '请求实验', '理解检查']}
      reference={reference}
      experimentFor={(concept) =>
        ['stream', 'output-budget', 'validation', 'refusal', 'errors', 'retry'].includes(concept.id)
          ? '请求实验'
          : null
      }
      Experiment={LlmActivities}
    />
  )
}

function LlmActivities(props: { mode: string; onExplore: (id: string) => void }) {
  return props.mode === '理解检查' ? (
    <LlmPractice onExplore={props.onExplore} />
  ) : (
    <LlmExperiment {...props} />
  )
}
function LlmExperiment({ onExplore }: { mode: string; onExplore: (id: string) => void }) {
  const [scenario, setScenario] = useState<LlmScenario>('success')
  const panel = useRef<HTMLElement>(null)
  const [prediction, setPrediction] = useState<boolean | null>(null)
  const [step, setStep] = useState(-1)
  const trace = llmTrace(scenario)
  const current = trace[Math.max(0, step)]!
  function reset() {
    setStep(-1)
    setPrediction(null)
  }
  return (
    <div className="react-learning react-activities">
      <section className="react-workspace" aria-label="模型请求实验">
        <div className="react-heading">
          <h2>收到文字，是否就能交给业务使用？</h2>
          <p>任务：返回含 summary 字段的摘要对象。先预测最终能否使用，再逐步观察响应和应用状态。</p>
        </div>
        <div className="react-experiment-layout">
          <section className="react-experiment-input" aria-label="实验条件">
            <fieldset>
              <legend>选择场景</legend>
              <div className="react-options">
                {(Object.keys(llmScenarios) as LlmScenario[]).map((value) => (
                  <button
                    type="button"
                    key={String(value)}
                    aria-pressed={scenario === value}
                    onClick={() => {
                      setScenario(value)
                      reset()
                    }}
                  >
                    {llmScenarios[value]}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>预测：本次尝试最终能得到可用业务结果吗？</legend>
              <div className="react-options">
                {[true, false].map((value) => (
                  <button
                    type="button"
                    key={String(value)}
                    disabled={step >= 0}
                    aria-pressed={prediction === value}
                    onClick={() => setPrediction(value)}
                  >
                    {value ? '可以使用' : '不能使用'}
                  </button>
                ))}
              </div>
            </fieldset>
            <button
              type="button"
              className="react-primary"
              disabled={prediction === null || step >= 0}
              onClick={() => {
                setStep(0)
                requestAnimationFrame(() => {
                  panel.current?.focus({ preventScroll: true })
                  if (window.matchMedia('(max-width: 760px)').matches)
                    panel.current?.scrollIntoView({ block: 'start' })
                })
              }}
            >
              开始推演
            </button>
            <p className="react-note">
              固定教学轨迹，不发起 API 请求、不消耗额度，不测量真实 token
              或延迟。校验结果为预设，切换场景清空预测。
            </p>
          </section>
          <section
            ref={panel}
            tabIndex={-1}
            className="react-timeline-panel min-w-0"
            aria-label="请求时间线"
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
                <h3>先预测，再开始</h3>
                <p>能显示的内容与能交给程序使用的结果，是两件事。</p>
              </div>
            ) : (
              <div className="react-trace" aria-live="polite" aria-atomic="true">
                <p className="react-note">
                  第 {step + 1} / {trace.length} 步
                </p>
                <h3>{current.title}</h3>
                <p>{current.detail}</p>
                <div className="react-values">
                  <div>
                    <span>应用状态</span>
                    <p className="text-lg font-medium">{current.state}</p>
                  </div>
                  <div>
                    <span>能否用于业务</span>
                    <strong>{current.usable ? '可以' : '不可以'}</strong>
                  </div>
                </div>
                <h3>当前收到的内容</h3>
                <pre className="break-words whitespace-pre-wrap">
                  <code>{current.text || '（尚无内容）'}</code>
                </pre>
                {step === trace.length - 1 && (
                  <p className="react-result">
                    {prediction === current.usable ? '预测正确。' : '预测与结果不同。'} 本次尝试
                    {current.usable ? '可以' : '不能'}提供可用业务结果。请解释是哪一步决定了这一点。
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
            <button type="button" className="react-text-link" onClick={() => onExplore('stream')}>
              回到相关概念
            </button>
          </section>
        </div>
      </section>
    </div>
  )
}

function LlmPractice({ onExplore }: { onExplore: (id: string) => void }) {
  const [answer, setAnswer] = useState('')
  return (
    <div className="react-learning react-activities">
      <section className="react-workspace">
        <div className="react-practice">
          <h2 className="font-serif text-3xl">解释、诊断与迁移</h2>
          <h3>解释</h3>
          <p>为什么收到文字、响应完成、业务可用需要分开？结构化输出能保证什么，不能保证什么？</p>
          <h3>诊断</h3>
          <p>
            页面显示半段 JSON 后断流，重试却得到重复内容。状态处理、展示和重试逻辑应该如何修改？
          </p>
          <h3>迁移</h3>
          <p>把摘要改成从发票中提取金额，需要增加哪些校验？遇到临时限流与额度耗尽如何分别处理？</p>
          <label htmlFor="llm-reflection">写下判断依据与验证方法</label>
          <textarea
            id="llm-reflection"
            rows={7}
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
          />
          <p className="react-note">
            仅保留在当前理解检查视图；切换学习方式、离开或刷新即清空，不上传、不保存、不自动评分。
          </p>
          <details>
            <summary>查看推理标准</summary>
            <p>
              增量只能预览；完成后检查拒绝、结构和业务约束。断流不能推断服务端失败，新尝试不能拼接旧输出。金额需核对币种、范围及原始证据；临时限流有限退避，额度不足处理账户或预算。
            </p>
          </details>
          <button type="button" className="react-text-link" onClick={() => onExplore('validation')}>
            回到完成后的业务校验
          </button>
        </div>
      </section>
    </div>
  )
}
