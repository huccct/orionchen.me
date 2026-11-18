'use client'

import { useState } from 'react'

const architectures = [
  {
    name: 'Workflow',
    example: '步骤固定的周报',
    path: '收集 → 校验 → 审批 → 发布',
    tradeoff: '应用预先定义步骤和分支，易于复现。新增例外要显式修改流程。',
  },
  {
    name: '工具循环（ReAct 类）',
    example: '需要搜集未知线索的报告',
    path: '提出查询 → 读证据 → 决定继续查询或结束',
    tradeoff: '模型依据观察决定下一步，能处理未知输入。执行器需要限制步数、工具和预算。',
  },
  {
    name: 'Planner–Executor',
    example: '有依赖、需要调整计划的多步调研',
    path: '拟定计划 → 校验 → 逐步执行 → 必要时调整剩余步骤',
    tradeoff: '计划可以先审阅，执行时仍需根据新证据复查。重规划需要保留已完成的步骤和副作用。',
  },
  {
    name: 'Multi-Agent',
    example: '数据核验与合规复核需要独立证据',
    path: '主任务分派 → 各角色独立处理 → 汇合并处理分歧',
    tradeoff: '角色可以独立验收。交接、冲突、上下文和权限隔离会增加成本，由主任务定义汇合规则。',
  },
] as const

const versions = {
  v1: { result: '通过', detail: '基准版本，恢复后仍只有一份报告。' },
  v2: { result: '通过', detail: '更新报告模板，恢复后仍只有一份报告。' },
  v3: { result: '失败', detail: '将执行次数加入幂等键，接管后创建了第二份报告。' },
} as const
type Version = keyof typeof versions

// ponytail: one routing target and a fixed regression verdict per immutable teaching version.
export function routeRelease(active: Version, candidate: Version) {
  return versions[candidate].result === '通过' ? candidate : active
}

export function AgentPlatformExperiment({ onExplore }: { onExplore: (id: string) => void }) {
  const [architecture, setArchitecture] = useState<(typeof architectures)[number]>(architectures[0])
  const [candidate, setCandidate] = useState<Version>('v2')
  const [active, setActive] = useState<Version>('v1')
  const [runVersion, setRunVersion] = useState<Version>('v1')
  const [message, setMessage] = useState('已有一项任务按 v1 运行。')

  function release(version: Version) {
    const next = routeRelease(active, version)
    setActive(next)
    setMessage(
      versions[version].result === '通过'
        ? `路由已切到 ${next}，已启动任务仍使用 ${runVersion}。`
        : `${version} 未通过门禁，新任务仍使用 ${active}。`
    )
  }

  return (
    <div className="react-learning react-activities">
      <section className="react-workspace" aria-label="Agent 执行架构与发布演练">
        <div className="react-heading">
          <h2>一份报告怎样执行，哪个版本可以上线？</h2>
        </div>
        <div className="react-experiment-layout">
          <section className="react-experiment-input" aria-label="执行架构">
            <fieldset>
              <legend>比较执行方式</legend>
              <div className="react-options">
                {architectures.map((item) => (
                  <button
                    type="button"
                    key={item.name}
                    aria-pressed={architecture === item}
                    onClick={() => setArchitecture(item)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="react-trace" aria-live="polite">
              <h3>{architecture.example}</h3>
              <p>{architecture.path}</p>
              <p>{architecture.tradeoff}</p>
            </div>
            <button
              type="button"
              className="react-text-link"
              onClick={() => onExplore('harness-patterns')}
            >
              回到执行架构取舍
            </button>
          </section>
          <section className="react-timeline-panel min-w-0" aria-label="发布与回滚">
            <fieldset>
              <legend>尝试发布候选版本</legend>
              <div className="react-options">
                {(['v2', 'v3'] as const).map((version) => (
                  <button
                    type="button"
                    key={version}
                    aria-pressed={candidate === version}
                    onClick={() => setCandidate(version)}
                  >
                    {version}
                  </button>
                ))}
              </div>
            </fieldset>
            <p>
              回归门禁：{versions[candidate].result}。{versions[candidate].detail}
            </p>
            <div className="react-controls">
              <button type="button" onClick={() => release(candidate)}>
                尝试发布 {candidate}
              </button>
              <button type="button" disabled={active === 'v1'} onClick={() => release('v1')}>
                回滚到 v1
              </button>
              <button
                type="button"
                onClick={() => {
                  setRunVersion(active)
                  setMessage(`新任务以 ${active} 启动，下面显示这项任务的版本。`)
                }}
              >
                启动并跟踪新任务
              </button>
            </div>
            <div className="react-trace" aria-live="polite">
              <p>新任务的路由版本：{active}</p>
              <p>当前跟踪的任务版本：{runVersion}</p>
              <p>{message}</p>
            </div>
            <p className="react-note">门禁结果为教学样例。浏览器实际演练路由切换和任务版本绑定。</p>
            <button
              type="button"
              className="react-text-link"
              onClick={() => onExplore('release-routing')}
            >
              回到回归门禁、发布与回滚
            </button>
          </section>
        </div>
      </section>
    </div>
  )
}
