import { expect, it } from 'vitest'
import { llmBranches, llmCurriculum } from '@/components/learning/llm-data'
import { llmScenarios, llmTrace, type LlmScenario } from '@/components/learning/llm-trace'

it('keeps partial and unvalidated responses out of business use', () => {
  for (const scenario of Object.keys(llmScenarios) as LlmScenario[]) {
    const trace = llmTrace(scenario)
    expect(trace.slice(0, -1).every((step) => !step.usable)).toBe(true)
    expect(trace.at(-1)!.usable).toBe(scenario === 'success')
  }
  expect(llmTrace('success').at(-2)!.state).toBe('响应完成 · 待校验')
  expect(llmTrace('disconnected').at(-1)!.text).toBe(llmTrace('truncated').at(-1)!.text)
  expect(llmTrace('disconnected').at(-1)!.state).not.toBe(llmTrace('truncated').at(-1)!.state)
  expect(llmTrace('rateLimit').every((step) => step.text === '')).toBe(true)
})
it('connects every concept to existing branches and concepts', () => {
  const ids = llmCurriculum.concepts.map((concept) => concept.id)
  expect(new Set(ids).size).toBe(ids.length)
  for (const concept of llmCurriculum.concepts) {
    expect(llmBranches.some((branch) => branch.id === concept.branch)).toBe(true)
    for (const related of llmCurriculum.notes[concept.id]!.related) expect(ids).toContain(related)
  }
})
