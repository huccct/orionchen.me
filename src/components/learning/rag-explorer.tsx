'use client'

import { useRef, useState, type ReactNode } from 'react'
import { KnowledgeMapWorkspace } from './knowledge-map-workspace'
import { ragBranches, ragCurriculum } from './rag-data'
import { ragChunks, ragQueries, retrieveExample, type RetrievalMethod } from './rag-retrieval'
import './react-explorer.css'

export function RagExplorer({ reference }: { reference: ReactNode }) {
  return (
    <KnowledgeMapWorkspace
      title="RAG 与知识检索"
      subtitle="让回答有据可查"
      branches={ragBranches}
      concepts={ragCurriculum.concepts}
      conceptNotes={ragCurriculum.notes}
      modes={['知识地图', '检索实验', '理解检查']}
      reference={reference}
      experimentFor={(concept) =>
        ['cosine', 'keyword', 'top-k', 'context-budget', 'grounding', 'retrieval-eval'].includes(
          concept.id
        )
          ? '检索实验'
          : null
      }
      Experiment={RagActivity}
    />
  )
}

function RagActivity({ mode, onExplore }: { mode: string; onExplore: (id: string) => void }) {
  return mode === '理解检查' ? (
    <RagPractice onExplore={onExplore} />
  ) : (
    <RagExperiment onExplore={onExplore} />
  )
}

function RagExperiment({ onExplore }: { onExplore: (id: string) => void }) {
  const [queryId, setQueryId] = useState('cancel')
  const [method, setMethod] = useState<RetrievalMethod>('vector')
  const [topK, setTopK] = useState(1)
  const [prediction, setPrediction] = useState<boolean | null>(null)
  const [revealed, setRevealed] = useState(false)
  const resultPanel = useRef<HTMLElement>(null)
  const query = ragQueries.find((item) => item.id === queryId)!
  const result = retrieveExample(queryId, method, topK)
  function reset() {
    setPrediction(null)
    setRevealed(false)
  }

  return (
    <div className="react-learning react-activities">
      <section className="react-workspace" aria-label="RAG 检索实验">
        <div className="react-heading">
          <h2>找到相关片段，就能回答了吗？</h2>
          <p>先读资料，预测证据是否齐全，再比较检索结果与送给模型的上下文。</p>
          <p className="react-note">
            纯 TypeScript 教学实验：资料为虚构手册，向量为手工二维数值；余弦与排名实时计算，不调用
            Embedding 或生成模型。
          </p>
        </div>
        <div className="react-experiment-layout">
          <section className="react-experiment-input space-y-6" aria-label="检索条件">
            <fieldset>
              <legend>1. 选择问题</legend>
              <div className="react-options">
                {ragQueries.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    aria-pressed={queryId === item.id}
                    onClick={() => {
                      setQueryId(item.id)
                      reset()
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="mt-3">{query.text}</p>
            </fieldset>
            <fieldset>
              <legend>2. 检索方式</legend>
              <div className="react-options">
                {(['keyword', 'vector'] as const).map((value) => (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={method === value}
                    onClick={() => {
                      setMethod(value)
                      reset()
                    }}
                  >
                    {value === 'keyword' ? '关键词匹配' : '向量相似度'}
                  </button>
                ))}
              </div>
              <p className="react-note">
                {method === 'keyword'
                  ? `人工选定查询词：${query.terms.join(' / ')}。每命中一个词计 1 分，零命中不返回；不是 BM25 或自动分词。`
                  : `手工问题向量：[${query.vector.join(', ')}]。按余弦相似度排序，不设阈值；分数不是置信度。`}
              </p>
            </fieldset>
            <fieldset>
              <legend>3. 最多取几个片段（Top-K）？</legend>
              <div className="react-options">
                {[1, 2, 3, 4].map((value) => (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={topK === value}
                    onClick={() => {
                      setTopK(value)
                      reset()
                    }}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </fieldset>
            <details>
              <summary>查看全部 4 条原始资料与手工向量</summary>
              {ragChunks.map((chunk) => (
                <div key={chunk.id}>
                  <h3 className="font-medium">
                    {chunk.title} [{chunk.vector.join(', ')}]
                  </h3>
                  <p>{chunk.text}</p>
                </div>
              ))}
            </details>
            <fieldset>
              <legend>预测：返回的片段能提供完整回答依据吗？</legend>
              <div className="react-options">
                {[true, false].map((value) => (
                  <button
                    type="button"
                    key={String(value)}
                    disabled={revealed}
                    aria-pressed={prediction === value}
                    onClick={() => setPrediction(value)}
                  >
                    {value ? '证据齐全' : '证据不足'}
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
                  resultPanel.current?.focus({ preventScroll: true })
                  if (window.matchMedia('(max-width: 760px)').matches)
                    resultPanel.current?.scrollIntoView({ block: 'start' })
                })
              }}
            >
              运行检索
            </button>
          </section>
          <section
            className="react-timeline-panel min-w-0"
            aria-label="检索结果"
            tabIndex={-1}
            ref={resultPanel}
          >
            {!revealed ? (
              <div className="react-await">
                <h3>先预测，再揭晓</h3>
                <p>资料、向量和算法都可查看。试着区分“主题相关”和“能支持结论”。</p>
              </div>
            ) : (
              <div className="react-trace">
                <div aria-live="polite" aria-atomic="true">
                  <h3>{result.sufficient ? '证据齐全' : '证据不足'}</h3>
                  <p>
                    {prediction === result.sufficient ? '预测正确。' : '这次预测与标注结果不同。'}{' '}
                    {query.explanation}
                  </p>
                  <p className="react-note">
                    判定依据是本题人工标注的相关片段，不是自动语义判断；真实系统需要独立评测。
                  </p>
                </div>
                <div className="react-values mt-6">
                  <div>
                    <span>实际返回</span>
                    <strong>{result.selected.length} 条</strong>
                  </div>
                  <div>
                    <span>本题标注 Recall@{topK}</span>
                    <strong>
                      {result.recall === null ? '不适用' : `${Math.round(result.recall * 100)}%`}
                    </strong>
                  </div>
                </div>
                {result.recall === null && (
                  <p className="react-note">
                    无相关证据，recall 分母为零；此时应评测能否正确说明无法回答。
                  </p>
                )}
                <h3 className="mt-6!">候选排名</h3>
                <ol className="space-y-3">
                  {result.ranked.map((chunk, index) => (
                    <li key={chunk.id} className="border-b border-[var(--site-border)] pb-3">
                      <p>
                        <strong>
                          {index + 1}. {chunk.title}
                        </strong>{' '}
                        · {method === 'vector' ? chunk.score.toFixed(3) : `${chunk.score} 词命中`}
                      </p>
                      <p className="react-note">
                        {result.selected.some((item) => item.id === chunk.id)
                          ? '已送入上下文'
                          : '未选入'}{' '}
                        ·{' '}
                        {query.relevant.includes(chunk.id)
                          ? '人工标注：相关证据'
                          : '人工标注：不支持本题答案'}
                      </p>
                    </li>
                  ))}
                </ol>
                <h3 className="mt-6!">交给生成模型的资料</h3>
                <p>
                  下面只展示检索上下文，不生成回答。引用 ID
                  应随原文保留，真实调用还需加入问题、指令并计算 token 预算。
                </p>
                <pre className="break-words whitespace-pre-wrap">
                  <code>
                    {result.context || '没有命中资料。应说明证据不足或调整查询，不应编造答案。'}
                  </code>
                </pre>
              </div>
            )}
            <div className="react-controls">
              <button type="button" onClick={reset}>
                重新预测
              </button>
            </div>
            <button type="button" className="react-text-link" onClick={() => onExplore('top-k')}>
              回到 Top-K 与相关性阈值
            </button>
          </section>
        </div>
      </section>
    </div>
  )
}

function RagPractice({ onExplore }: { onExplore: (id: string) => void }) {
  const [answer, setAnswer] = useState('')
  return (
    <div className="react-learning react-activities">
      <section className="react-workspace">
        <div className="react-practice">
          <h2 className="font-serif text-3xl">把检索结果解释清楚</h2>
          <h3>解释</h3>
          <p>
            为什么“停止任务”用向量检索更容易找到取消规则，而 E409
            在本例中关键词更准确？哪些现象来自手工数据，不能推广为模型结论？
          </p>
          <h3>诊断</h3>
          <p>
            相关片段都已检索到，回答却说“取消会删除报告”。你会先检查上下文组装、原文版本，还是模型生成？写出排查顺序与证据。
          </p>
          <h3>迁移</h3>
          <p>
            如果改成公司内部知识库，财务文档的权限被撤销，哪些片段、索引或缓存需要处理？为什么不能让模型自行保密？
          </p>
          <label htmlFor="rag-reflection">写下推理与验证方法</label>
          <textarea
            id="rag-reflection"
            rows={7}
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="区分检索、组装、生成三个阶段，说明你要观察什么。"
          />
          <p className="react-note">
            仅保留在当前理解检查视图；切换学习方式或刷新即清空，不上传、不保存、不自动评分。
          </p>
          <details>
            <summary>查看推理标准</summary>
            <p>
              解释应区分精确匹配与语义表示，并指出向量是人工设定。诊断先看候选与最终上下文，再查回答是否忠于证据。权限应在资料进入模型前强制执行，并同步撤销派生片段与缓存的访问；校验失败时拒绝访问。
            </p>
          </details>
          <button
            type="button"
            className="react-text-link"
            onClick={() => onExplore('answer-eval')}
          >
            回到答案依据性与回归样例
          </button>
        </div>
      </section>
    </div>
  )
}
