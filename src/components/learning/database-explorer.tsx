'use client'

import { useState, type ReactNode } from 'react'
import { KnowledgeMapWorkspace } from './knowledge-map-workspace'
import { databaseBranches, databaseCurriculum } from './database-data'
import {
  databaseStrategies,
  databaseTrace,
  databaseSql,
  type DatabaseStrategy,
} from './database-trace'
import './react-explorer.css'

export function DatabaseExplorer({ reference }: { reference: ReactNode }) {
  return (
    <KnowledgeMapWorkspace
      title="数据库与数据建模"
      subtitle="让数据守住业务规则"
      branches={databaseBranches}
      concepts={databaseCurriculum.concepts}
      conceptNotes={databaseCurriculum.notes}
      modes={['知识地图', '并发库存实验']}
      reference={reference}
      experimentFor={(concept) =>
        ['check', 'lost-update', 'atomic', 'locking', 'transaction'].includes(concept.id)
          ? '并发库存实验'
          : null
      }
      Experiment={DatabaseExperiment}
    />
  )
}

function DatabaseExperiment({ onExplore }: { mode: string; onExplore: (id: string) => void }) {
  const [strategy, setStrategy] = useState<DatabaseStrategy>('naive')
  const [failOrder, setFailOrder] = useState(false)
  const [prediction, setPrediction] = useState<number | null>(null)
  const [step, setStep] = useState(-1)
  const trace = databaseTrace(strategy, failOrder)
  const current = trace[Math.max(step, 0)]!
  function reset() {
    setStep(-1)
    setPrediction(null)
  }
  return (
    <div className="react-learning react-activities">
      <section className="react-workspace" aria-label="并发库存实验">
        <div className="react-heading">
          <h2>只剩 1 件，两个人都能买到吗？</h2>
          <p>
            固定 A 先拿到写锁，B 随后竞争。所有方案都使用事务；区别在于读取、检查和写入怎样协作。
          </p>
        </div>
        <div className="react-experiment-layout">
          <section className="react-experiment-input" aria-label="实验条件与预测">
            <fieldset>
              <legend>选择扣库存方式</legend>
              <div className="react-options">
                {(Object.keys(databaseStrategies) as DatabaseStrategy[]).map((value) => (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={strategy === value}
                    onClick={() => {
                      setStrategy(value)
                      reset()
                    }}
                  >
                    {databaseStrategies[value]}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="flex min-h-11 items-center gap-2">
              <input
                type="checkbox"
                checked={failOrder}
                onChange={(event) => {
                  setFailOrder(event.target.checked)
                  reset()
                }}
              />
              让 A 的订单插入失败（事务回滚）
            </label>
            <pre>
              <code>{databaseSql[strategy]}</code>
            </pre>
            <fieldset>
              <legend>预测：最终会有几笔已提交订单？</legend>
              <div className="react-options">
                {[0, 1, 2].map((value) => (
                  <button
                    type="button"
                    key={value}
                    disabled={step >= 0}
                    aria-pressed={prediction === value}
                    onClick={() => setPrediction(value)}
                  >
                    {value} 笔
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
              PostgreSQL Read Committed 下的固定教学轨迹，不连接数据库。SQL
              是带应用分支说明的片段，表结构与错误处理未完整展开，不可直接作为生产代码。
            </p>
          </section>
          <section className="react-timeline-panel" aria-label="并发事务时间线">
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
                <h3>先预测，再跟踪两位买家</h3>
                <p>库存没有变成负数，也可能已经卖出了不存在的商品。</p>
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
                      ['已提交库存', `${current.stock} 件`],
                      ['已提交订单', `${current.orders} 笔`],
                      ['买家 A', current.a],
                      ['买家 B', current.b],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label} className="min-w-0 border-t border-current/20 pt-3">
                      <dt className="text-sm opacity-70">{label}</dt>
                      <dd className="mt-2 text-lg break-words">{value}</dd>
                    </div>
                  ))}
                </dl>
                {step === trace.length - 1 && (
                  <p className="react-result">
                    {prediction === current.orders
                      ? '预测正确。'
                      : `你预测 ${prediction} 笔，实际为 ${current.orders} 笔。`}{' '}
                    {failOrder
                      ? '回滚保住了 A 的库存；这一次没超卖，不能证明先查后写在所有交错顺序下安全。'
                      : '再打开建单失败，观察扣减是否随事务回滚。'}
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
                  failOrder
                    ? 'transaction'
                    : strategy === 'naive'
                      ? 'lost-update'
                      : strategy === 'atomic'
                        ? 'atomic'
                        : 'locking'
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
