'use client'

import { useState, type ReactNode } from 'react'
import { KnowledgeMapWorkspace } from './knowledge-map-workspace'
import { agentBranches, agentCurriculum } from './agent-data'
import { agentScenarios, agentTrace, type AgentScenario } from './agent-trace'
import './react-explorer.css'

export function AgentExplorer({ reference }: { reference: ReactNode }) {
  return (
    <KnowledgeMapWorkspace
      title="AI 应用与 Agent 工程"
      subtitle="让一次任务可靠地完成"
      branches={agentBranches}
      concepts={agentCurriculum.concepts}
      conceptNotes={agentCurriculum.notes}
      modes={['知识地图', '任务实验']}
      reference={reference}
      experimentFor={(concept) =>
        ['tool-call', 'tool-result', 'task-state', 'retry', 'idempotency', 'cancellation'].includes(
          concept.id
        )
          ? '任务实验'
          : null
      }
      Experiment={AgentExperiment}
    />
  )
}

function AgentExperiment({ onExplore }: { mode: string; onExplore: (id: string) => void }) {
  const [scenario, setScenario] = useState<AgentScenario>('success')
  const [idempotent, setIdempotent] = useState(true)
  const [prediction, setPrediction] = useState<number | null>(null)
  const [step, setStep] = useState(-1)
  const trace = agentTrace(scenario, idempotent)
  const current = trace[Math.max(0, step)]!
  function reset() {
    setStep(-1)
    setPrediction(null)
  }
  return (
    <div className="react-learning react-activities">
      <section className="react-workspace" aria-label="Agent 任务实验">
        <div className="react-heading">
          <h2>一次工具调用，究竟执行了几次？</h2>
          <p>用户已授权创建一份报告。先预测副作用，再逐步观察执行器和工具服务各自知道什么。</p>
        </div>
        <div className="react-experiment-layout">
          <section className="react-experiment-input" aria-label="实验条件">
            <fieldset>
              <legend>选择场景</legend>
              <div className="react-options">
                {(Object.keys(agentScenarios) as AgentScenario[]).map((value) => (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={scenario === value}
                    onClick={() => {
                      setScenario(value)
                      reset()
                    }}
                  >
                    {agentScenarios[value]}
                  </button>
                ))}
              </div>
            </fieldset>
            {scenario === 'timeout' && (
              <fieldset>
                <legend>重试时是否使用幂等保护？</legend>
                <div className="react-options">
                  {[true, false].map((value) => (
                    <button
                      type="button"
                      key={String(value)}
                      aria-pressed={idempotent === value}
                      onClick={() => {
                        setIdempotent(value)
                        reset()
                      }}
                    >
                      {value ? '复用同一幂等键' : '无幂等保护（反例）'}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
            <fieldset>
              <legend>预测：最后创建了几份报告？</legend>
              <div className="react-options">
                {[0, 1, 2].map((value) => (
                  <button
                    type="button"
                    key={value}
                    disabled={step >= 0}
                    aria-pressed={prediction === value}
                    onClick={() => setPrediction(value)}
                  >
                    {value} 份
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
              浏览器内的固定教学模型，不调用模型或真实工具，不创建报告。取消场景固定发生在提交之后；实际系统需核实外部状态。
            </p>
          </section>
          <section className="react-timeline-panel" aria-label="任务时间线">
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
                <p>执行器的任务状态和外部已经发生的副作用，可能不一致。</p>
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
                    <span>执行器状态</span>
                    <p className="text-lg font-medium">{current.state}</p>
                  </div>
                  <div>
                    <span>工具实际创建的报告</span>
                    <strong>{current.writes} 份</strong>
                  </div>
                </div>
                {step === trace.length - 1 && (
                  <p className="react-result">
                    {prediction === current.writes
                      ? '预测正确。'
                      : `你预测了 ${prediction} 份，实际创建 ${current.writes} 份。`}{' '}
                    再想一想：只看最终状态，能判断副作用是否正确吗？
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
                  scenario === 'cancel'
                    ? 'cancellation'
                    : scenario === 'timeout'
                      ? 'idempotency'
                      : 'tool-call'
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
