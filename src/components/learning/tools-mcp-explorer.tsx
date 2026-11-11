'use client'
import { useRef, useState, type ReactNode } from 'react'
import { KnowledgeMapWorkspace } from './knowledge-map-workspace'
import { toolsMcpBranches, toolsMcpCurriculum } from './tools-mcp-data'
import {
  toolCallTrace,
  toolScenarios,
  type ToolScenario,
  type ToolDecision,
  type ToolRecovery,
} from './tool-call-trace'
import './react-explorer.css'

export function ToolsMcpExplorer({ reference }: { reference: ReactNode }) {
  return (
    <KnowledgeMapWorkspace
      title="工具调用与 MCP"
      subtitle="从调用提议到可核实的结果"
      branches={toolsMcpBranches}
      concepts={toolsMcpCurriculum.concepts}
      conceptNotes={toolsMcpCurriculum.notes}
      modes={['知识地图', '调用实验', '理解检查']}
      reference={reference}
      experimentFor={(concept) =>
        [
          'proposal',
          'schema',
          'result',
          'permissions',
          'confirmation',
          'errors',
          'timeout',
          'idempotency',
        ].includes(concept.id)
          ? '调用实验'
          : null
      }
      Experiment={ToolsActivities}
    />
  )
}
function ToolsActivities({ mode, onExplore }: { mode: string; onExplore: (id: string) => void }) {
  return mode === '理解检查' ? (
    <ToolsPractice onExplore={onExplore} />
  ) : (
    <ToolsExperiment onExplore={onExplore} />
  )
}
function ToolsExperiment({ onExplore }: { onExplore: (id: string) => void }) {
  const [scenario, setScenario] = useState<ToolScenario>('save')
  const [decision, setDecision] = useState<ToolDecision>('pending')
  const [recovery, setRecovery] = useState<ToolRecovery>('pending')
  const [prediction, setPrediction] = useState<boolean | null>(null)
  const [step, setStep] = useState(-1)
  const panel = useRef<HTMLElement>(null)
  const trace = toolCallTrace(scenario, decision, recovery)
  const current = trace[Math.max(0, step)]!
  const waiting =
    current.gate === 'approval'
      ? decision === 'pending'
      : current.gate === 'recovery' && recovery === 'pending'
  function reset() {
    setStep(-1)
    setPrediction(null)
    setDecision('pending')
    setRecovery('pending')
  }
  function focusResult() {
    requestAnimationFrame(() => {
      panel.current?.focus({ preventScroll: true })
      panel.current?.scrollIntoView({ block: 'start' })
    })
  }
  return (
    <div className="react-learning react-activities">
      <section className="react-workspace" aria-label="博客工具调用实验">
        <div className="react-heading">
          <h2>找到文章之后，笔记真的保存了吗？</h2>
          <p>
            用户任务：
            {scenario === 'search'
              ? '查找一篇上下文相关文章。'
              : '查找上下文相关文章，并将摘记保存到“我的学习笔记”。'}{' '}
            逐步观察模型、Host、MCP Client 与工具服务各自做了什么。
          </p>
        </div>
        <div className="react-experiment-layout">
          <section className="react-experiment-input space-y-6" aria-label="调用实验条件">
            <fieldset>
              <legend>1 · 选择场景</legend>
              <div className="react-options">
                {(Object.keys(toolScenarios) as ToolScenario[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={scenario === value}
                    onClick={() => {
                      setScenario(value)
                      reset()
                    }}
                  >
                    {toolScenarios[value]}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>2 · 预测：模型刚提出工具名与参数，就说明工具已执行吗？</legend>
              <div className="react-options">
                {[true, false].map((value) => (
                  <button
                    key={String(value)}
                    type="button"
                    disabled={step >= 0}
                    aria-pressed={prediction === value}
                    onClick={() => setPrediction(value)}
                  >
                    {value ? '已经执行' : '只是提议'}
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
                focusResult()
              }}
            >
              开始推演
            </button>
            <p className="react-note">
              纯 TS
              教学模拟：文章、权限、故障与笔记结果为预设，保存参数由本地代码实际检查。没有模型请求、MCP
              连接或文件写入；显示的笔记数量只是轨迹中的模拟状态。
            </p>
            <details>
              <summary>MCP 在哪里？</summary>
              <p>
                模型 ⇄ Host（管理任务、权限和确认）⇄ MCP Client ⇄ MCP Server ⇄ 文章 / 笔记存储。
              </p>
              <p>
                Client 是 Host 内的协议组件。MCP 统一工具发现和调用；底层存储仍可通过普通 API
                实现。单个应用直接调用 TypeScript 函数也可完成同样任务。
              </p>
              <p>
                按已查阅的 2026-07-28 版描述；此处省略版本发现、必需的 _meta、完整 JSON-RPC
                包装与传输，不是可复制的协议客户端。
              </p>
            </details>
          </section>
          <section
            ref={panel}
            tabIndex={-1}
            className="react-timeline-panel min-w-0"
            aria-label="工具调用过程"
          >
            {step < 0 ? (
              <div className="react-await">
                <h3>先预测，再跟着一次调用走</h3>
                <p>写入场景会停在确认处。批准或拒绝都只影响模拟；超时场景还需要选择恢复方式。</p>
              </div>
            ) : (
              <div className="react-trace" aria-live="polite" aria-atomic="true">
                <p className="react-note">
                  第 {step + 1} 步 · {current.actor}
                </p>
                <h3>{current.title}</h3>
                <p>{current.detail}</p>
                <div className="react-values mt-6">
                  <div>
                    <span>调用方状态</span>
                    <p className="text-lg font-medium">{current.state}</p>
                  </div>
                  <div>
                    <span>模拟存储中的笔记数</span>
                    <strong>{current.writes}</strong>
                  </div>
                </div>
                <p className="react-note">
                  笔记数是教学全知视角；超时期间 Host
                  不能直接得知这个数。回退只回看轨迹，不表示撤销写入。
                </p>
                {current.payload && (
                  <pre className="break-words whitespace-pre-wrap">
                    <code>{current.payload}</code>
                  </pre>
                )}
                {step === 1 && (
                  <p className="react-result">
                    {prediction === false ? '预测正确。' : '此时还没有执行。'}{' '}
                    工具调用提议需要经过执行侧检查，模型不能凭一句话完成写入。
                  </p>
                )}
                {current.gate === 'approval' && (
                  <div className="react-controls" aria-label="模拟保存确认">
                    <button
                      type="button"
                      disabled={decision !== 'pending'}
                      onClick={() => {
                        setDecision('approve')
                        setStep(step + 1)
                        focusResult()
                      }}
                    >
                      批准这次模拟保存
                    </button>
                    <button
                      type="button"
                      disabled={decision !== 'pending'}
                      onClick={() => {
                        setDecision('deny')
                        setStep(step + 1)
                        focusResult()
                      }}
                    >
                      拒绝这次模拟保存
                    </button>
                  </div>
                )}
                {current.gate === 'recovery' && (
                  <div className="react-controls" aria-label="模拟超时恢复">
                    <button
                      type="button"
                      disabled={recovery !== 'pending'}
                      onClick={() => {
                        setRecovery('query')
                        setStep(step + 1)
                        focusResult()
                      }}
                    >
                      按原操作键核实
                    </button>
                    <button
                      type="button"
                      disabled={recovery !== 'pending'}
                      onClick={() => {
                        setRecovery('retry')
                        setStep(step + 1)
                        focusResult()
                      }}
                    >
                      使用同一操作键重试
                    </button>
                  </div>
                )}
                {waiting && (
                  <p className="react-result">
                    {current.gate === 'approval'
                      ? '请选择批准或拒绝，再继续。确认绑定上方具体参数。'
                      : '请选择一种恢复方式；超时不能当作未写入。'}
                  </p>
                )}
                {!waiting && step === trace.length - 1 && (
                  <p className="react-result">
                    本轮结束：{current.state}。请解释最后一步依据什么证据得出这个结论。
                  </p>
                )}
              </div>
            )}
            <div className="react-controls">
              <button
                type="button"
                disabled={step <= 0}
                onClick={() => {
                  setStep(step - 1)
                  focusResult()
                }}
              >
                上一步
              </button>
              <button
                type="button"
                disabled={step < 0 || waiting || step >= trace.length - 1}
                onClick={() => {
                  setStep(step + 1)
                  focusResult()
                }}
              >
                下一步
              </button>
              <button type="button" onClick={reset}>
                重新预测
              </button>
            </div>
            <details>
              <summary>怎样对比与验证？</summary>
              <p>
                先在正常保存中批准一次，再重新预测并拒绝；观察何时出现第一条模拟笔记。接着比较参数错误与无写权限：两者都不能靠确认绕过。最后在响应丢失场景分别尝试核实和同键重试，笔记数量都应保持为
                1。
              </p>
              <p>
                本实验最多一次恢复，无真实等待和退避。现实中应设置有限重试、整体截止时间、日志脱敏和服务端原子去重；同键异参不能当成同一次操作。刷新或切换学习方式会清空模拟进度。
              </p>
            </details>
            <button type="button" className="react-text-link" onClick={() => onExplore('proposal')}>
              回到调用提议不等于执行
            </button>
          </section>
        </div>
      </section>
    </div>
  )
}
const questions =
  '解释：模型工具调用、普通 API 和 MCP 分别负责什么？Host、Client、Server 分别在哪里？\n诊断：保存请求超时，助手却回答“保存失败，再创建一条”。哪里缺了证据？怎样避免重复笔记？\n迁移：为自己的学习助手定义一个只读工具和一个写入工具，写出参数、权限、确认条件、成功证据与失败处理。'
function ToolsPractice({ onExplore }: { onExplore: (id: string) => void }) {
  const [answer, setAnswer] = useState('')
  return (
    <div className="react-learning react-activities">
      <section className="react-workspace">
        <div className="react-practice">
          <h2 className="font-serif text-3xl">设计一个你敢交给 AI 的工具</h2>
          {questions.split('\n').map((question) => (
            <p key={question} className="mt-6">
              {question}
            </p>
          ))}
          <label htmlFor="tools-answer">我的执行边界与验证方法</label>
          <textarea
            id="tools-answer"
            rows={8}
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
          />
          <p className="react-note">
            仅保留在当前理解检查视图；切换学习方式、离开或刷新即清空。不上传、不保存、不自动评分。
          </p>
          <details>
            <summary>查看推理标准</summary>
            <p>
              模型提出调用，应用和工具服务执行校验与鉴权，MCP 统一发现和通信，普通 API
              可在工具内部完成业务。确认绑定具体参数，不能覆盖无权限状态。超时是结果未知，应查询操作记录或在服务支持幂等时同键有限重试；传输请求
              ID 可以变化，业务键与参数保持一致。用笔记 ID
              和真实存储结果确认成功，并测试拒绝、无权限、参数错误、业务错误与响应丢失。
            </p>
          </details>
          {answer.trim() && (
            <details>
              <summary>导出我的 Markdown 笔记</summary>
              <label htmlFor="tools-export">选中后复制到自己的笔记</label>
              <textarea
                id="tools-export"
                rows={10}
                readOnly
                value={`# 工具调用与 MCP · 学习笔记\n\n${questions}\n\n## 我的思考\n\n${answer}`}
                onFocus={(event) => event.currentTarget.select()}
              />
            </details>
          )}
          <button
            type="button"
            className="react-text-link"
            onClick={() => onExplore('idempotency')}
          >
            回到业务操作键与重复调用
          </button>
        </div>
      </section>
    </div>
  )
}
