import { expect, it } from 'vitest'
import { aiCodingBranches, aiCodingCurriculum } from '@/components/learning/ai-coding-data'
import { inspectReview, reviewCandidates } from '@/components/learning/ai-coding-review'

it('exposes the locale fallback counterexample without treating missing evidence as a code bug', () => {
  const broken = inspectReview('A')
  expect(broken.map((row) => row.passed)).toEqual([true, false, true])
  expect(broken[1]).toMatchObject({ actual: '/en/learning/llm', expected: '/learning/llm' })
  for (const candidate of ['B', 'C'] as const)
    expect(inspectReview(candidate).every((row) => row.passed)).toBe(true)
  expect(reviewCandidates.B.diff).toBe(reviewCandidates.C.diff)
  expect(reviewCandidates.A.decision).toBe('fix')
  expect(reviewCandidates.B.decision).toBe('verify')
  expect(reviewCandidates.C.decision).toBe('accept')
})
it('keeps curriculum relationships and exercise entry concepts valid', () => {
  const ids = new Set(aiCodingCurriculum.concepts.map((node) => node.id))
  expect(ids.size).toBe(aiCodingCurriculum.concepts.length)
  for (const branch of aiCodingBranches)
    expect(aiCodingCurriculum.concepts.some((node) => node.branch === branch.id)).toBe(true)
  for (const node of aiCodingCurriculum.concepts) {
    expect(aiCodingBranches.some((branch) => branch.id === node.branch)).toBe(true)
    for (const related of aiCodingCurriculum.notes[node.id]!.related)
      expect(ids.has(related)).toBe(true)
  }
  for (const id of ['goal', 'context', 'debug', 'diff', 'checks', 'feedback', 'retrospective'])
    expect(ids.has(id)).toBe(true)
})
