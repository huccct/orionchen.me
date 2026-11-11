import { expect, it } from 'vitest'
import {
  cosineSimilarity,
  ragChunks,
  ragQueries,
  retrieveExample,
} from '@/components/learning/rag-retrieval'
import { ragBranches, ragCurriculum } from '@/components/learning/rag-data'

it('calculates cosine direction and rejects undefined or incompatible vectors', () => {
  expect(cosineSimilarity([1, 0], [4, 0])).toBe(1)
  expect(cosineSimilarity([1, 0], [0, 1])).toBe(0)
  expect(cosineSimilarity([1, 0], [-1, 0])).toBe(-1)
  expect(cosineSimilarity([3, 4], [4, 3])).toBeCloseTo(0.96)
  for (const vector of [[], [1], [0, 0], [NaN, 1], [Infinity, 1]])
    expect(() => cosineSimilarity([1, 0], vector)).toThrow()
})

it('separates relevant neighbours, complete evidence and unanswerable questions', () => {
  expect(retrieveExample('cancel', 'keyword', 4).selected).toEqual([])
  expect(retrieveExample('cancel', 'vector', 1)).toMatchObject({ recall: 0.5, sufficient: false })
  expect(retrieveExample('cancel', 'vector', 2)).toMatchObject({ recall: 1, sufficient: true })
  expect(retrieveExample('code', 'keyword', 1).selected[0]?.id).toBe('conflict')
  expect(retrieveExample('code', 'vector', 1).sufficient).toBe(false)
  expect(retrieveExample('code', 'vector', 4).sufficient).toBe(true)
  const missing = retrieveExample('missing', 'vector', 4)
  expect(missing.ranked[0]!.score).toBeGreaterThan(0.99)
  expect(missing).toMatchObject({ recall: null, sufficient: false })
  for (const query of ragQueries)
    for (const method of ['keyword', 'vector'] as const)
      for (const k of [1, 2, 3, 4]) {
        const result = retrieveExample(query.id, method, k)
        expect(result.selected.length).toBeLessThanOrEqual(k)
        expect(new Set(result.selected.map((chunk) => chunk.id)).size).toBe(result.selected.length)
        for (const chunk of ragChunks)
          expect(result.context.includes(chunk.text)).toBe(
            result.selected.some((item) => item.id === chunk.id)
          )
      }
  expect(() => retrieveExample('missing', 'vector', 0)).toThrow()
  expect(() => retrieveExample('missing', 'vector', 1.5)).toThrow()
  expect(() => retrieveExample('unknown', 'vector', 1)).toThrow()
})

it('connects the curriculum without dangling concepts or branches', () => {
  const ids = new Set(ragCurriculum.concepts.map((node) => node.id))
  expect(ids.size).toBe(ragCurriculum.concepts.length)
  for (const branch of ragBranches)
    expect(ragCurriculum.concepts.some((node) => node.branch === branch.id)).toBe(true)
  for (const node of ragCurriculum.concepts) {
    expect(ragBranches.some((branch) => branch.id === node.branch)).toBe(true)
    for (const related of ragCurriculum.notes[node.id]!.related) expect(ids.has(related)).toBe(true)
  }
})
