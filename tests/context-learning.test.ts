import { expect, it } from 'vitest'
import {
  assessContext,
  contextCards,
  type ContextCardId,
} from '@/components/learning/context-evidence'
import { contextBranches, contextCurriculum } from '@/components/learning/context-data'

it('bounds claims by selected evidence, preserving omissions, freshness and conflicts', () => {
  expect(assessContext('stack', [], 8).status).toBe('missing')
  expect(assessContext('stack', ['old'], 8).status).toBe('missing')
  expect(assessContext('stack', ['summary'], 8).status).toBe('partial')
  expect(assessContext('stack', ['plan', 'old'], 8).citations).toEqual(['A'])
  expect(assessContext('release', ['plan'], 8).status).toBe('missing')
  expect(assessContext('release', ['release'], 8).status).toBe('unverified')
  expect(assessContext('release', ['conflict'], 8).status).toBe('unverified')
  expect(assessContext('release', ['release', 'conflict'], 8).status).toBe('conflict')
  expect(assessContext('release', ['external'], 8).status).toBe('missing')
  expect(assessContext('stack', ['plan'], 6).status).toBe('supported')
  expect(assessContext('stack', ['plan', 'noise'], 6).status).toBe('overflow')
  expect(assessContext('stack', ['plan', 'noise'], 8).status).toBe('supported')
})
it('accounts for all selections without hidden truncation or accidental order authority', () => {
  for (let mask = 0; mask < 2 ** contextCards.length; mask++) {
    const selected: ContextCardId[] = contextCards
      .filter((_, index) => mask & (1 << index))
      .map((card) => card.id)
    for (const question of ['stack', 'release'] as const)
      for (const budget of [6, 8, 12]) {
        const result = assessContext(question, selected, budget)
        expect(result).toEqual(assessContext(question, [...selected].reverse(), budget))
        expect(result.cards).toHaveLength(selected.length)
        expect(result.used).toBe(3 + result.cards.reduce((sum, card) => sum + card.cost, 0))
        expect(result.status === 'overflow').toBe(result.used > budget)
        if (result.status === 'overflow') expect(result.citations).toEqual([])
        for (const citation of result.citations)
          expect(result.cards.some((card) => card.title.startsWith(citation))).toBe(true)
      }
  }
})
it('keeps map links valid', () => {
  const ids = contextCurriculum.concepts.map((item) => item.id)
  expect(new Set(ids).size).toBe(ids.length)
  for (const concept of contextCurriculum.concepts) {
    expect(contextBranches.some((branch) => branch.id === concept.branch)).toBe(true)
    for (const id of contextCurriculum.notes[concept.id]!.related) expect(ids).toContain(id)
  }
})
