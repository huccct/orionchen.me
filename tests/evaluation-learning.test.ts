import { expect, it } from 'vitest'
import {
  compareEvaluation,
  evaluationCases,
  gradeEvaluation,
} from '@/components/learning/evaluation-results'
import { evaluationBranches, evaluationCurriculum } from '@/components/learning/evaluation-data'

it('rejects malformed shapes and separates schema from correct business values', () => {
  for (const output of [
    '14天',
    'null',
    '[]',
    '7',
    '{}',
    '{"days":"7"}',
    '{"days":-1}',
    '{"days":1.5}',
    '{"days":1e100}',
    '{"days":7,"extra":true}',
  ]) {
    expect(gradeEvaluation(output, 7)).toEqual({ schema: false, correct: false })
  }
  expect(gradeEvaluation('{"days":14}', 30)).toEqual({ schema: true, correct: false })
  expect(gradeEvaluation('{"days":null}', null)).toEqual({ schema: true, correct: true })
  expect(gradeEvaluation('{"days":0}', 0)).toEqual({ schema: true, correct: true })
  expect(gradeEvaluation('{"days":0}', null).correct).toBe(false)
})
it('changes ranking with metric and cohort while keeping identical denominators', () => {
  const all = compareEvaluation('all', 'correct')
  expect(all.winner).toBe('B')
  expect(all.results.map((row) => row.passed)).toEqual([2, 3])
  expect(all.results[0]).toMatchObject({
    inputTokens: 350,
    outputTokens: 32,
    firstMs: 217.5,
    totalMs: 650,
  })
  expect(all.results[1]).toMatchObject({
    inputTokens: 550,
    outputTokens: 27,
    firstMs: 312.5,
    totalMs: 850,
  })
  expect(compareEvaluation('all', 'schema').winner).toBe('A')
  expect(compareEvaluation('typical', 'correct').winner).toBe('A')
  expect(compareEvaluation('edge', 'correct').winner).toBe('B')
  expect(compareEvaluation('edge', 'schema').winner).toBe('tie')
  for (const slice of ['all', 'typical', 'edge'] as const)
    for (const metric of ['schema', 'correct'] as const) {
      const result = compareEvaluation(slice, metric)
      expect(result.count).toBe(slice === 'all' ? 4 : 2)
      expect(result.results[0]!.rows.map((row) => row.id)).toEqual(
        result.results[1]!.rows.map((row) => row.id)
      )
    }
  for (const item of evaluationCases)
    for (const run of Object.values(item.runs)) expect(run.firstMs).toBeLessThanOrEqual(run.totalMs)
})
it('keeps all curriculum links and branches reachable', () => {
  const ids = new Set(evaluationCurriculum.concepts.map((node) => node.id))
  expect(ids.size).toBe(evaluationCurriculum.concepts.length)
  for (const branch of evaluationBranches)
    expect(evaluationCurriculum.concepts.some((node) => node.branch === branch.id)).toBe(true)
  for (const node of evaluationCurriculum.concepts) {
    expect(evaluationBranches.some((branch) => branch.id === node.branch)).toBe(true)
    for (const related of evaluationCurriculum.notes[node.id]!.related)
      expect(ids.has(related)).toBe(true)
  }
})
