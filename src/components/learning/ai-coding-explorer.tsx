'use client'

import { useRef, useState, type ReactNode } from 'react'
import { KnowledgeMapWorkspace } from './knowledge-map-workspace'
import { aiCodingBranches, aiCodingCurriculum } from './ai-coding-data'
import {
  inspectReview,
  reviewCandidates,
  reviewDecisions,
  type ReviewCandidate,
  type ReviewDecision,
} from './ai-coding-review'
import './react-explorer.css'

export function AiCodingExplorer({ reference }: { reference: ReactNode }) {
  return (
    <KnowledgeMapWorkspace
      title="AI 辅助软件开发"
      subtitle="一起改代码，也建立自己的判断"
      branches={aiCodingBranches}
      concepts={aiCodingCurriculum.concepts}
      conceptNotes={aiCodingCurriculum.notes}
      modes={['知识地图', '审查练习', '理解检查']}
      reference={reference}
      experimentFor={(concept) =>
        ['goal', 'context', 'debug', 'diff', 'checks', 'feedback'].includes(concept.id)
          ? '审查练习'
          : null
      }
      Experiment={AiCodingActivity}
    />
  )
}
function AiCodingActivity({ mode, onExplore }: { mode: string; onExplore: (id: string) => void }) {
  return mode === '理解检查' ? (
    <AiCodingPractice onExplore={onExplore} />
  ) : (
    <ReviewExercise onExplore={onExplore} />
  )
}
function ReviewExercise({ onExplore }: { onExplore: (id: string) => void }) {
  const [candidate, setCandidate] = useState<ReviewCandidate>('A')
  const [decision, setDecision] = useState<ReviewDecision | null>(null)
  const [reason, setReason] = useState('')
  const [revealed, setRevealed] = useState(false)
  const panel = useRef<HTMLElement>(null)
  const current = reviewCandidates[candidate]
  function reset() {
    setDecision(null)
    setReason('')
    setRevealed(false)
  }
  return (
    <div className="react-learning react-activities">
      <section className="react-workspace" aria-label="AI 改动审查练习">
        <div className="react-heading">
          <h2>AI 说完成了，你会接受这份改动吗？</h2>
          <p>先读需求、代码和验证记录，写下判断，再用反例检查它。</p>
          <p className="react-note">
            以本站双语知识地图入口为背景的教学改写。候选 diff
            与验证记录为预设，不是实际提交或真实故障；本页只计算固定链接，不运行项目测试、不调用
            AI。
          </p>
        </div>
        <div className="react-experiment-layout">
          <section className="react-experiment-input space-y-6" aria-label="候选改动与审查">
            <details open>
              <summary>任务与完成条件</summary>
              <p>
                假设要给知识地图卡片添加详情链接。中文入口应打开中文内容；英文入口没有英文内容时会展示中文卡片，应打开中文原文。若存在英文译文，应打开英文详情。
              </p>
              <p>
                卡片必须支持键盘激活，手机和桌面可用；完成前应有相关行为测试和构建验证，不夹带无关修改。
              </p>
            </details>
            <details>
              <summary>必要上下文：两种语言分别指什么？</summary>
              <p>
                <code>locale</code> 是当前列表页面语言，<code>topic.lang</code>{' '}
                是卡片内容语言。英文列表可以展示中文内容，两者不一定相同。
              </p>
              <pre className="break-words whitespace-pre-wrap">
                <code>{`const localized = getLearningTopics(locale)
const topics = localized.length ? localized : getLearningTopics('zh')
const localePathPrefix = { zh: '', en: '/en' }`}</code>
              </pre>
              <p className="react-note">
                抽取自本站列表逻辑，省略类型、导入、布局和语言提示。实验中的英文译文是虚构测试条件，不表示网站已有该译文。
              </p>
            </details>
            <fieldset>
              <legend>1. 选择候选改动</legend>
              <div className="react-options">
                {(['A', 'B', 'C'] as const).map((value) => (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={candidate === value}
                    onClick={() => {
                      setCandidate(value)
                      reset()
                    }}
                  >
                    候选 {value}
                  </button>
                ))}
              </div>
            </fieldset>
            <details open key={candidate}>
              <summary>查看候选 {candidate} 的 diff</summary>
              <pre className="break-words whitespace-pre-wrap">
                <code>{current.diff}</code>
              </pre>
            </details>
            <div>
              <h3 className="font-medium">提交者给出的验证记录（教学预设）</h3>
              <ul className="list-disc space-y-2 pl-5">
                {current.evidence.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <fieldset>
              <legend>2. 你的审查结论</legend>
              <div className="react-options">
                {(Object.keys(reviewDecisions) as ReviewDecision[]).map((value) => (
                  <button
                    type="button"
                    key={value}
                    disabled={revealed}
                    aria-pressed={decision === value}
                    onClick={() => setDecision(value)}
                  >
                    {reviewDecisions[value]}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="block" htmlFor="review-reason">
              3. 写一句判断依据或最小反例
            </label>
            <textarea
              id="review-reason"
              rows={3}
              className="w-full rounded border border-[var(--site-border)] bg-transparent p-3"
              value={reason}
              disabled={revealed}
              onChange={(event) => setReason(event.target.value)}
              placeholder="哪种输入会出错？或还有什么证据没给出？"
            />
            <p className="react-note">
              这段推理不自动评分。换候选、重新练习、切换学习方式或刷新会清空。
            </p>
            <button
              type="button"
              className="react-primary"
              disabled={decision === null || !reason.trim() || revealed}
              onClick={() => {
                setRevealed(true)
                requestAnimationFrame(() => {
                  panel.current?.focus({ preventScroll: true })
                  if (window.matchMedia('(max-width: 760px)').matches)
                    panel.current?.scrollIntoView({ block: 'start' })
                })
              }}
            >
              检查我的判断
            </button>
          </section>
          <section
            ref={panel}
            tabIndex={-1}
            className="react-timeline-panel min-w-0"
            aria-label="审查反馈"
          >
            {!revealed ? (
              <div className="react-await">
                <h3>先判断，再看证据</h3>
                <p>区分三个问题：代码是否有错、验证是否充分、是否可以在本题范围内接受。</p>
              </div>
            ) : (
              <div className="react-trace">
                <div aria-live="polite" aria-atomic="true">
                  <h3>{reviewDecisions[current.decision]}</h3>
                  <p>
                    {decision === current.decision
                      ? '你的选择与参考判断一致。'
                      : `你选择了“${reviewDecisions[decision!]}”，请对照以下证据重新判断。`}
                  </p>
                  <p>{current.explanation}</p>
                </div>
                <h3>运行固定片段的链接推导</h3>
                <ul className="space-y-4">
                  {inspectReview(candidate).map((row) => (
                    <li key={row.id} className="border-b border-[var(--site-border)] pb-3">
                      <p>
                        <strong>{row.passed ? '符合预期' : '反例成立'}</strong> · {row.label}
                      </p>
                      <p className="break-words">
                        实际：<code>{row.actual}</code>
                      </p>
                      <p className="break-words">
                        预期：<code>{row.expected}</code>
                      </p>
                    </li>
                  ))}
                </ul>
                <p className="react-note">
                  这里只验证 URL
                  推导，不能替代真实路由、键盘交互、布局和生产构建检查。即使推导全部通过，候选 B
                  的交付证据仍不完整。
                </p>
                <details>
                  <summary>查看可执行的后续反馈</summary>
                  <p>{current.followup}</p>
                </details>
                <p className="react-result">
                  回读自己写的依据：是否说清了触发条件、预期与实际、以及下一步如何验证？选对结论不等于已经理解。
                </p>
              </div>
            )}
            <div className="react-controls">
              <button type="button" onClick={reset}>
                重新练习
              </button>
            </div>
            <button type="button" className="react-text-link" onClick={() => onExplore('checks')}>
              回到检查通过不等于需求完成
            </button>
          </section>
        </div>
      </section>
    </div>
  )
}
function AiCodingPractice({ onExplore }: { onExplore: (id: string) => void }) {
  const [answer, setAnswer] = useState('')
  const notes = `# AI 辅助软件开发 · 我的理解\n\n## 练习问题\n\n1. 页面语言和内容语言有什么区别？为什么类型检查可能发现不了链接错误？\n2. 怎样把“测试全绿”转成可核实的验证证据？\n3. 下一次自己的改动要如何定义完成条件？\n\n## 我的解释、证据与待验证问题\n\n${answer}\n`
  return (
    <div className="react-learning react-activities">
      <section className="react-workspace">
        <div className="react-practice">
          <h2 className="font-serif text-3xl">把这次判断变成自己的理解</h2>
          <h3>解释</h3>
          <p>不看参考，用自己的话解释页面语言和内容语言的区别。为什么这类错误可能通过类型检查？</p>
          <h3>诊断</h3>
          <p>
            AI
            说“全部测试通过”，但只测了中文页面。你会怎样确认覆盖范围，并要求一个修复前会失败的反例？
          </p>
          <h3>迁移</h3>
          <p>
            为你下一次真实代码改动写下：目标、必要上下文、约束、完成条件，以及一个仍不确定的问题。
          </p>
          <label htmlFor="coding-notes">我的解释、证据与待验证问题</label>
          <textarea
            id="coding-notes"
            rows={8}
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="我原来以为……现在的证据是……下次我要验证……"
          />
          <p className="react-note">
            文字只保留在当前视图，离开、切换学习方式或刷新即清空；不上传、不自动保存、不自动评分。可以复制
            Markdown 留存。
          </p>
          {answer.trim() && (
            <details>
              <summary>导出我的 Markdown 笔记</summary>
              <label htmlFor="coding-markdown">点入文本框全选，再复制到自己的笔记</label>
              <textarea
                id="coding-markdown"
                rows={10}
                readOnly
                value={notes}
                onFocus={(event) => event.currentTarget.select()}
              />
            </details>
          )}
          <details>
            <summary>查看推理标准</summary>
            <p>
              以需求定义预期，而不是照抄实现。分别说明明确缺陷、证据缺口和有限接受范围；反馈应包含触发场景、具体后果与验证方法。记录自己不能解释的部分，下一次先复述再查证。
            </p>
          </details>
          <button
            type="button"
            className="react-text-link"
            onClick={() => onExplore('retrospective')}
          >
            回到把一次协作变成自己的知识
          </button>
        </div>
      </section>
    </div>
  )
}
