'use client'

import { useRef, useState, type ReactNode } from 'react'
import { KnowledgeMapWorkspace } from './knowledge-map-workspace'
import { mechanicsBranches, mechanicsCurriculum } from './llm-mechanics-data'
import {
  generationContexts,
  generationDraws,
  generationTrace,
  type GenerationContext,
  type GenerationMode,
} from './llm-generation'
import './react-explorer.css'

export function LlmMechanicsExplorer({ reference }: { reference: ReactNode }) {
  return (
    <KnowledgeMapWorkspace
      title="大模型工作原理"
      subtitle="从文字表示到逐步生成"
      branches={mechanicsBranches}
      concepts={mechanicsCurriculum.concepts}
      conceptNotes={mechanicsCurriculum.notes}
      modes={['知识地图', '生成实验', '理解检查']}
      reference={reference}
      experimentFor={(concept) =>
        ['context', 'softmax', 'sampling', 'autoregression'].includes(concept.id)
          ? '生成实验'
          : null
      }
      Experiment={MechanicsActivities}
    />
  )
}

function MechanicsActivities({
  mode,
  onExplore,
}: {
  mode: string
  onExplore: (id: string) => void
}) {
  return mode === '理解检查' ? (
    <MechanicsPractice onExplore={onExplore} />
  ) : (
    <GenerationExperiment onExplore={onExplore} />
  )
}

function GenerationExperiment({ onExplore }: { onExplore: (id: string) => void }) {
  const [context, setContext] = useState<GenerationContext>('rain')
  const [temperature, setTemperature] = useState(1)
  const [mode, setMode] = useState<GenerationMode>('sample')
  const [drawSet, setDrawSet] = useState(0)
  const [limit, setLimit] = useState(4)
  const [prediction, setPrediction] = useState<string | null>(null)
  const [step, setStep] = useState(-1)
  const panel = useRef<HTMLElement>(null)
  const trace = generationTrace(context, temperature, mode, generationDraws[drawSet]!, limit)
  const current = trace[Math.max(0, step)]!
  function reset() {
    setStep(-1)
    setPrediction(null)
  }
  return (
    <div className="react-learning react-activities">
      <section className="react-workspace" aria-label="逐步生成实验">
        <div className="react-heading">
          <h2>一句话，是怎样一步步接出来的？</h2>
          <p>
            任务：根据窗外天气，续写一句出门建议。文字片段 → 分数 → 概率 → 选择 → 追加 → 再计算。
          </p>
        </div>
        <div className="react-experiment-layout">
          <section className="react-experiment-input space-y-6" aria-label="实验条件">
            <fieldset>
              <legend>1 · 当前上下文</legend>
              <div className="react-options">
                {(Object.keys(generationContexts) as GenerationContext[]).map((value) => (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={context === value}
                    onClick={() => {
                      setContext(value)
                      reset()
                    }}
                  >
                    {generationContexts[value]}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>2 · 温度 T（只改变概率分布）</legend>
              <div className="react-options">
                {[0.3, 1, 2].map((value) => (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={temperature === value}
                    onClick={() => {
                      setTemperature(value)
                      reset()
                    }}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>3 · 选择方法</legend>
              <div className="react-options">
                {(['sample', 'greedy'] as const).map((value) => (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={mode === value}
                    onClick={() => {
                      setMode(value)
                      reset()
                    }}
                  >
                    {value === 'sample' ? '按概率采样' : '贪心选择'}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>4 · 可复现的抽样值序列</legend>
              <div className="react-options">
                {generationDraws.map((draws, index) => (
                  <button
                    type="button"
                    key={index}
                    disabled={mode === 'greedy'}
                    aria-pressed={drawSet === index}
                    onClick={() => {
                      setDrawSet(index)
                      reset()
                    }}
                  >
                    序列 {index === 0 ? 'A' : 'B'} · {draws[0]}
                  </button>
                ))}
              </div>
              <p className="react-note">
                A：0.18 / 0.72 / 0.41 / 0.90；B：0.84 / 0.24 / 0.63 /
                0.10。预设值替代随机数源，便于回放；贪心不使用它们。
              </p>
            </fieldset>
            <fieldset>
              <legend>5 · 最多生成几步</legend>
              <div className="react-options">
                {[2, 4].map((value) => (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={limit === value}
                    onClick={() => {
                      setLimit(value)
                      reset()
                    }}
                  >
                    {value} 步
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>先预测：第一个片段会是什么？</legend>
              <div className="react-options">
                {['带上', '戴上', '准备好'].map((value) => (
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
              onClick={() => {
                setStep(0)
                requestAnimationFrame(() => {
                  panel.current?.focus({ preventScroll: true })
                  if (window.matchMedia('(max-width: 760px)').matches)
                    panel.current?.scrollIntoView({ block: 'start' })
                })
              }}
            >
              开始生成
            </button>
            <p className="react-note">
              教学模拟：分数和候选来自手工规则，片段不是实际 tokenizer 输出。Softmax
              与按累计概率选取的计算是真实的；没有神经网络、Attention、真实模型调用或费用。修改条件会清空预测与进度。
            </p>
          </section>
          <section
            ref={panel}
            tabIndex={-1}
            className="react-timeline-panel min-w-0"
            aria-label="生成过程"
          >
            {step < 0 ? (
              <div className="react-await">
                <h3>先预测，再看分布</h3>
                <p>试着解释：相同上下文下，为什么最可能的片段也不一定被选中？</p>
              </div>
            ) : (
              <div className="react-trace" aria-live="polite" aria-atomic="true">
                <p className="react-note">
                  第 {step + 1} 步 ·{' '}
                  {mode === 'sample' ? `采样值 u = ${current.draw}` : '选择最大概率，不抽样'}
                </p>
                <h3>这一轮看到了什么？</h3>
                <p>{generationContexts[context]}。请给一句出门建议。</p>
                <pre className="break-words whitespace-pre-wrap">
                  <code>已生成前缀：{current.prefix || '（空）'}</code>
                </pre>
                <p>
                  手工规则根据天气与前缀给分，再计算 pᵢ = exp(zᵢ/T) / Σ
                  exp(zⱼ/T)。表中按固定词表顺序累计，区间左闭右开。
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <caption className="mb-2 text-left">
                      候选分布 · 温度 {temperature}（显示值四舍五入）
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col" className="p-2">
                          片段
                        </th>
                        <th scope="col" className="p-2">
                          分数
                        </th>
                        <th scope="col" className="p-2">
                          概率
                        </th>
                        <th scope="col" className="p-2">
                          累计区间
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {current.candidates.map((candidate, index) => {
                        const start = current.candidates
                          .slice(0, index)
                          .reduce((sum, item) => sum + item.probability, 0)
                        return (
                          <tr key={candidate.token}>
                            <th scope="row" className="p-2 font-normal">
                              {candidate.token === '<EOS>' ? '〈结束〉' : candidate.token}
                              {candidate.token === current.selected ? ' ← 选中' : ''}
                            </th>
                            <td className="p-2">{candidate.score}</td>
                            <td className="p-2">{(candidate.probability * 100).toFixed(1)}%</td>
                            <td className="p-2 tabular-nums">
                              [{start.toFixed(3)}, {(start + candidate.probability).toFixed(3)})
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <h3>追加后的输出</h3>
                <pre className="break-words whitespace-pre-wrap">
                  <code>{current.output}</code>
                </pre>
                {step === 0 && (
                  <p className="react-result">
                    {prediction === current.selected
                      ? '预测正确。'
                      : `你预测了“${prediction}”，实际选中“${current.selected}”。`}{' '}
                    {mode === 'sample'
                      ? '查找包含 u 的累计区间，解释选择依据。'
                      : '找出最大概率，解释为什么这一轮没有使用抽样值。'}
                  </p>
                )}
                <p className="react-result">
                  {current.stop === 'eos'
                    ? '遇到 EOS：生成自然结束。结束标记不显示在正文里。'
                    : current.stop === 'limit'
                      ? '达到步数上限：被截断，还没有遇到 EOS。'
                      : '尚未停止：将选中的片段放回前缀，再计算下一步。'}
                </p>
                <p className="react-note">
                  词表与语法被大幅简化，可能生成不自然的搭配；不代表真实模型质量。候选概率也不代表建议正确或适合你的概率。
                </p>
              </div>
            )}
            <div className="react-controls">
              <button type="button" disabled={step <= 0} onClick={() => setStep(step - 1)}>
                上一步
              </button>
              <button
                type="button"
                disabled={step < 0 || step >= trace.length - 1}
                onClick={() => setStep(step + 1)}
              >
                下一步
              </button>
              <button type="button" onClick={reset}>
                重新预测
              </button>
            </div>
            <details>
              <summary>怎么做一次有意义的对比？</summary>
              <p>
                固定雨天、采样和序列 A，比较温度 0.3 与 2 的概率；再固定温度 1，仅换序列
                B。观察第一步不同怎样影响第二步分数。最后选择贪心，比较“最大概率”与“必然选中”的区别。
              </p>
              <p>
                真实模型从完整的可见上下文计算分数。本实验仅用天气、前缀长度和首个片段查规则表，不实现
                embedding、Attention 或训练。
              </p>
            </details>
            <button type="button" className="react-text-link" onClick={() => onExplore('softmax')}>
              回到 Softmax 与温度
            </button>
          </section>
        </div>
      </section>
    </div>
  )
}

const questions =
  '解释：用自己的话串起 Token、向量、Attention、logits、概率与采样。参数和上下文各是什么？\n诊断：有人说“把温度调低，就不会编造论文”。问题在哪里？怎样验证引用？\n迁移：个人博客每天更新，想让助手回答最新内容。上下文、RAG 与微调分别改变哪里？你会先做什么？'
function MechanicsPractice({ onExplore }: { onExplore: (id: string) => void }) {
  const [answer, setAnswer] = useState('')
  return (
    <div className="react-learning react-activities">
      <section className="react-workspace">
        <div className="react-practice">
          <h2 className="font-serif text-3xl">把生成过程讲给未来的自己</h2>
          {questions.split('\n').map((question) => (
            <p className="mt-6" key={question}>
              {question}
            </p>
          ))}
          <label htmlFor="mechanics-reflection">我的解释、证据与下一次实验</label>
          <textarea
            id="mechanics-reflection"
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
              分词得到 ID，向量与位置信息经网络产生 logits，Softmax
              转成概率，再按策略选择并追加。训练更新参数，普通推理使用参数；RAG
              将检索结果加入上下文。低温度使分布集中，但高概率续写仍可能为假。引用应核对原始论文、作者与出版信息，缺少证据时允许说不知道。最新博客优先尝试附加相关原文或检索，用真实问题检查是否引用正确、是否遗漏与是否拒答。
            </p>
          </details>
          {answer.trim() && (
            <details>
              <summary>导出我的 Markdown 笔记</summary>
              <label htmlFor="mechanics-export">选中后复制到自己的笔记</label>
              <textarea
                id="mechanics-export"
                readOnly
                rows={10}
                value={`# 大模型工作原理 · 学习笔记\n\n${questions}\n\n## 我的思考\n\n${answer}`}
                onFocus={(event) => event.currentTarget.select()}
              />
            </details>
          )}
          <button
            type="button"
            className="react-text-link"
            onClick={() => onExplore('hallucination')}
          >
            回到流畅不等于真实
          </button>
        </div>
      </section>
    </div>
  )
}
