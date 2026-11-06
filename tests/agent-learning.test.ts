import { expect, it } from 'vitest'
import { agentTrace } from '@/components/learning/agent-trace'
import { agentBranches, agentCurriculum } from '@/components/learning/agent-data'

it('distinguishes acknowledgements, duplicate side effects and cancellation', () => {
  expect(agentTrace('success', true).at(-1)).toMatchObject({ state: '成功', writes: 1 })
  expect(agentTrace('failure', true).every((step) => step.writes === 0)).toBe(true)
  const retry = agentTrace('timeout', true)
  expect(retry.find((step) => step.state === '结果未知')?.writes).toBe(1)
  expect(retry.at(-1)?.writes).toBe(1)
  expect(agentTrace('timeout', false).at(-1)?.writes).toBe(2)
  expect(agentTrace('cancel', true).at(-1)).toMatchObject({
    state: '已取消 · 副作用待核实',
    writes: 1,
  })
})

it('connects every concept to a branch and existing related concepts', () => {
  const ids = new Set(agentCurriculum.concepts.map((node) => node.id))
  expect(ids.size).toBe(agentCurriculum.concepts.length)
  for (const branch of agentBranches)
    expect(agentCurriculum.concepts.some((node) => node.branch === branch.id)).toBe(true)
  for (const node of agentCurriculum.concepts) {
    expect(agentBranches.some((branch) => branch.id === node.branch)).toBe(true)
    for (const related of agentCurriculum.notes[node.id]!.related)
      expect(ids.has(related)).toBe(true)
  }
})
