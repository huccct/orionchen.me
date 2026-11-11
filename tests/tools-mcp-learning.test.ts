import { expect, it } from 'vitest'
import {
  sampleNote,
  toolCallTrace,
  toolScenarios,
  validNoteArguments,
  type ToolScenario,
} from '@/components/learning/tool-call-trace'
import { toolsMcpBranches, toolsMcpCurriculum } from '@/components/learning/tools-mcp-data'

it('validates external save arguments instead of relying on TypeScript types', () => {
  expect(validNoteArguments(sampleNote)).toBe(true)
  for (const value of [
    null,
    [],
    {},
    { ...sampleNote, body: 42 },
    { ...sampleNote, title: ' ' },
    { ...sampleNote, body: 'a'.repeat(201) },
    { ...sampleNote, notebook: '别人的笔记' },
    { ...sampleNote, admin: true },
  ])
    expect(validNoteArguments(value)).toBe(false)
})
it('never simulates a write before approval or after validation/permission/decline failures', () => {
  for (const scenario of Object.keys(toolScenarios) as ToolScenario[]) {
    const pending = toolCallTrace(scenario)
    expect(pending.every((step) => step.writes === 0)).toBe(true)
    const denied = toolCallTrace(scenario, 'deny', 'retry')
    expect(denied.every((step) => step.writes === 0)).toBe(true)
    for (const recovery of ['pending', 'query', 'retry'] as const) {
      const approved = toolCallTrace(scenario, 'approve', recovery)
      if (['search', 'invalid', 'forbidden', 'failure'].includes(scenario))
        expect(approved.every((step) => step.writes === 0)).toBe(true)
      else {
        const confirmation = approved.findIndex((step) => step.gate === 'approval')
        expect(confirmation).toBeGreaterThan(0)
        expect(approved.slice(0, confirmation + 1).every((step) => step.writes === 0)).toBe(true)
        expect(approved.at(-1)!.writes).toBe(1)
      }
    }
  }
  expect(toolCallTrace('save').at(-1)!.gate).toBe('approval')
  expect(toolCallTrace('save', 'deny').at(-1)!.state).toBe('已拒绝 · 未保存')
  expect(toolCallTrace('invalid', 'approve').at(-1)!.state).toBe('未调用保存工具')
  expect(toolCallTrace('forbidden', 'approve').some((step) => step.gate === 'approval')).toBe(false)
  expect(toolCallTrace('failure', 'approve').at(-1)!.payload).toContain('isError: true')
})
it('keeps timeout unknown until recovery and preserves one write on both recovery paths', () => {
  const timeout = toolCallTrace('timeout', 'approve')
  expect(timeout.at(-1)!.state).toBe('保存结果待核实')
  expect(timeout.at(-1)!.gate).toBe('recovery')
  expect(timeout.at(-1)!.writes).toBe(1)
  for (const recovery of ['query', 'retry'] as const) {
    const recovered = toolCallTrace('timeout', 'approve', recovery)
    expect(recovered.slice(0, timeout.length)).toEqual(timeout)
    expect(recovered.at(-1)!.state).toBe('保存成功')
    expect(recovered.every((step) => step.writes <= 1)).toBe(true)
    expect(recovered.at(-2)!.payload).toContain('note-op-001')
  }
})
it('connects every concept to existing map nodes', () => {
  const ids = toolsMcpCurriculum.concepts.map((item) => item.id)
  expect(new Set(ids).size).toBe(ids.length)
  for (const concept of toolsMcpCurriculum.concepts) {
    expect(toolsMcpBranches.some((branch) => branch.id === concept.branch)).toBe(true)
    for (const id of toolsMcpCurriculum.notes[concept.id]!.related) expect(ids).toContain(id)
  }
})
