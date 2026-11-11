'use client'

import { useRef, useState, type ReactNode } from 'react'
import { KnowledgeMapWorkspace } from './knowledge-map-workspace'
import { evaluationBranches, evaluationCurriculum } from './evaluation-data'
import {
  compareEvaluation,
  evaluationCases,
  evaluationPrompts,
  type EvalMetric,
  type EvalSlice,
} from './evaluation-results'
import './react-explorer.css'

const slices = { all: '全部样例', typical: '常规样例', edge: '边界样例' } as const
const metrics = { schema: '只看结构合规', correct: '结构与答案都正确' } as const
const predictions = { A: 'A 更高', B: 'B 更高', tie: '一样高' } as const

export function EvaluationExplorer({ reference }: { reference: ReactNode }) {
  return (
    <KnowledgeMapWorkspace
      title="模型评测与可观测性"
      subtitle="用证据判断一次改动"
      branches={evaluationBranches}
      concepts={evaluationCurriculum.concepts}
      conceptNotes={evaluationCurriculum.notes}
      modes={['知识地图', '评测实验', '理解检查']}
      reference={reference}
      experimentFor={(concept) =>
        ['objective', 'dataset', 'grader', 'slices', 'latency', 'usage'].includes(concept.id)
          ? '评测实验'
          : null
      }
      Experiment={EvaluationActivity}
    />
  )
}
function EvaluationActivity({
  mode,
  onExplore,
}: {
  mode: string
  onExplore: (id: string) => void
}) {
  return mode === '理解检查' ? (
    <EvaluationPractice onExplore={onExplore} />
  ) : (
    <EvaluationExperiment onExplore={onExplore} />
  )
}
function EvaluationExperiment({ onExplore }: { onExplore: (id: string) => void }) {
  const [slice, setSlice] = useState<EvalSlice>('all')
  const [metric, setMetric] = useState<EvalMetric>('correct')
  const [prediction, setPrediction] = useState<keyof typeof predictions | null>(null)
  const [revealed, setRevealed] = useState(false)
  const panel = useRef<HTMLElement>(null)
  const result = compareEvaluation(slice, metric)
  function reset() {
    setPrediction(null)
    setRevealed(false)
  }
  return (
    <div className="react-learning react-activities">
      <section className="react-workspace" aria-label="模型评测实验">
        <div className="react-heading">
          <h2>哪版提示词更好，取决于你测什么？</h2>
          <p>同一组退货期限提取任务，对比 A / B。改变样本组与评分标准，观察排名是否反转。</p>
          <p className="react-note">
            输出、耗时与 Token 均为手工教学数据，并非模型实测。TypeScript 实际执行 JSON
            校验、答案比对与聚合，不调用模型、不消耗额度。
          </p>
        </div>
        <div className="react-experiment-layout">
          <section className="react-experiment-input space-y-6" aria-label="评测条件">
            <details>
              <summary>查看两版提示词与固定条件</summary>
              {(['A', 'B'] as const).map((version) => (
                <p key={version}>
                  <strong>{version}：</strong>
                  {evaluationPrompts[version]}
                </p>
              ))}
              <p className="react-note">
                假设同一模型与配置、每题每版各一次、均完整结束，无重试或缓存。只靠提示词要求
                JSON，未启用 API 结构化输出。B 仍可能不遵循格式；这些记录不是提示词效果的实证。
              </p>
            </details>
            <fieldset>
              <legend>1. 比较哪些样例？</legend>
              <div className="react-options">
                {(Object.keys(slices) as EvalSlice[]).map((value) => (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={slice === value}
                    onClick={() => {
                      setSlice(value)
                      reset()
                    }}
                  >
                    {slices[value]}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>2. 采用哪条评分标准？</legend>
              <div className="react-options">
                {(Object.keys(metrics) as EvalMetric[]).map((value) => (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={metric === value}
                    onClick={() => {
                      setMetric(value)
                      reset()
                    }}
                  >
                    {metrics[value]}
                  </button>
                ))}
              </div>
              <p className="react-note">
                结构：仅含 days 字段的 JSON 对象，值为非负安全整数或 null。联合通过：结构合规且 days
                等于人工参考值。资料未提及期限时必须为 null。
              </p>
            </fieldset>
            <details>
              <summary>查看题目、参考答案与依据</summary>
              {evaluationCases
                .filter((item) => slice === 'all' || item.group === slice)
                .map((item) => (
                  <div key={item.id} className="mt-4">
                    <p>{item.input}</p>
                    <p className="react-note">
                      参考：{JSON.stringify({ days: item.expected })}。{item.reason}
                    </p>
                  </div>
                ))}
            </details>
            <fieldset>
              <legend>预测：当前标准下谁的通过率更高？</legend>
              <div className="react-options">
                {(Object.keys(predictions) as (keyof typeof predictions)[]).map((value) => (
                  <button
                    type="button"
                    key={value}
                    disabled={revealed}
                    aria-pressed={prediction === value}
                    onClick={() => setPrediction(value)}
                  >
                    {predictions[value]}
                  </button>
                ))}
              </div>
            </fieldset>
            <button
              type="button"
              className="react-primary"
              disabled={prediction === null || revealed}
              onClick={() => {
                setRevealed(true)
                requestAnimationFrame(() => {
                  panel.current?.focus({ preventScroll: true })
                  if (window.matchMedia('(max-width: 760px)').matches)
                    panel.current?.scrollIntoView({ block: 'start' })
                })
              }}
            >
              运行评分
            </button>
          </section>
          <section
            className="react-timeline-panel min-w-0"
            aria-label="评测结果"
            ref={panel}
            tabIndex={-1}
          >
            {!revealed ? (
              <div className="react-await">
                <h3>先预测，再比较</h3>
                <p>这不是选一个永久赢家。分别看格式、业务结果和样本构成，才知道分数说明了什么。</p>
              </div>
            ) : (
              <div className="react-trace">
                <div aria-live="polite" aria-atomic="true">
                  <h3>{predictions[result.winner]}</h3>
                  <p>
                    {prediction === result.winner ? '预测正确。' : '预测与本次结果不同。'}{' '}
                    当前比较：{slices[slice]} · {metrics[metric]}，每版 {result.count} 条记录。
                  </p>
                </div>
                <div className="react-values mt-6">
                  {result.results.map((item) => (
                    <div key={item.version}>
                      <span>
                        {item.version} · 通过 {item.passed}/{result.count}
                      </span>
                      <strong>{Math.round((item.passed / result.count) * 100)}%</strong>
                    </div>
                  ))}
                </div>
                <p className="react-result">
                  {metric === 'schema'
                    ? 'A 可以格式全对但内容答错。切换“结构与答案都正确”，检查名次是否改变。'
                    : slice === 'typical'
                      ? '常规题中 A 更高，但这没有覆盖例外和缺失信息。加入边界样例再比较。'
                      : 'B 在本组联合通过率更高，但仍有格式失败或未覆盖的场景。回看常规组，不能只凭总体分决定上线。'}
                </p>
                <h3>性能与用量 · 教学记录</h3>
                <div
                  className="overflow-x-auto"
                  role="region"
                  aria-label="性能与用量对比表"
                  tabIndex={0}
                >
                  <table className="w-full text-left text-sm">
                    <caption className="sr-only">所选样本的平均延迟和累计 Token</caption>
                    <thead>
                      <tr>
                        {[
                          '版本',
                          '首段均值 ms',
                          '总耗时均值 ms',
                          '输入 Token 总计',
                          '输出 Token 总计',
                        ].map((title) => (
                          <th scope="col" className="p-2" key={title}>
                            {title}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.results.map((item) => (
                        <tr key={item.version}>
                          <th scope="row" className="p-2">
                            {item.version}
                          </th>
                          {[
                            Math.round(item.firstMs),
                            Math.round(item.totalMs),
                            item.inputTokens,
                            item.outputTokens,
                          ].map((value, i) => (
                            <td className="p-2" key={i}>
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="react-note">
                  时间起点均为请求发出，分别到首段文字与完整响应结束；不含后续校验。本例仅聚合完整请求，生产应另看失败、超时、重试和延迟分布。Token
                  不等于费用，本页不估算真实账单。
                </p>
                <h3>逐题复核</h3>
                {result.results[0]!.rows.map((row, index) => (
                  <details key={row.id} className="mt-4">
                    <summary>
                      {index + 1}. {row.label} · 参考{' '}
                      {row.expected === null ? 'null（未提供）' : `${row.expected} 天`}
                    </summary>
                    <p>{row.input}</p>
                    <p className="react-note">{row.reason}</p>
                    {result.results.map((item) => {
                      const record = item.rows[index]!
                      return (
                        <div key={item.version} className="mt-3">
                          <p>
                            <strong>{item.version}</strong> · 结构{record.schema ? '通过' : '失败'}{' '}
                            · 联合{record.correct ? '通过' : '失败'}
                          </p>
                          <pre className="break-words whitespace-pre-wrap">
                            <code>{record.output}</code>
                          </pre>
                        </div>
                      )
                    })}
                  </details>
                ))}
                <p className="react-note">
                  这些样例已公开，属于教学 /
                  开发集；四题、每版一次不能估计泛化表现或显著性。真实比较需独立留出样本、重复运行并检查关键分组。
                </p>
              </div>
            )}
            <div className="react-controls">
              <button type="button" onClick={reset}>
                重新预测
              </button>
            </div>
            <button type="button" className="react-text-link" onClick={() => onExplore('slices')}>
              回到分组结果与样本量
            </button>
          </section>
        </div>
      </section>
    </div>
  )
}
function EvaluationPractice({ onExplore }: { onExplore: (id: string) => void }) {
  const [answer, setAnswer] = useState('')
  return (
    <div className="react-learning react-activities">
      <section className="react-workspace">
        <div className="react-practice">
          <h2 className="font-serif text-3xl">分数之外，还需要哪些证据？</h2>
          <h3>解释</h3>
          <p>A 的结构通过率更高，为什么联合通过率却可能更低？为什么“14天”不能算接口验收通过？</p>
          <h3>诊断</h3>
          <p>
            B
            的总体成绩更好但常规题退化，你会先检查哪些具体输出和评分规则？怎样判断是模型错误、格式错误还是标注错误？
          </p>
          <h3>迁移</h3>
          <p>
            把实验换成本站文章问答：如何保留未参与调参的样例，评估引用依据，并记录足够诊断、又不泄漏私有内容的日志？
          </p>
          <label htmlFor="evaluation-reflection">写下推理与验证方法</label>
          <textarea
            id="evaluation-reflection"
            rows={7}
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
          />
          <p className="react-note">
            仅保留在当前理解检查视图，切换学习方式、离开或刷新即清空。不上传、不保存、不自动评分。
          </p>
          <details>
            <summary>查看推理标准</summary>
            <p>
              结构和业务分别评分，联合通过要求两者都满足。按题复核输入、参考与原始输出，不让总平均掩盖分组退化。保留独立留出集并重复比较；开放式答案按依据性
              rubric
              人工校准裁判。日志记录版本、状态、各阶段耗时和用量，内容最小化、脱敏并限制访问与保留时间。
            </p>
          </details>
          <button type="button" className="react-text-link" onClick={() => onExplore('regression')}>
            回到回归门槛与线上反馈
          </button>
        </div>
      </section>
    </div>
  )
}
