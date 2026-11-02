import { describe, expect, it } from 'vitest'
import { reactConcepts, renderTrace } from '@/components/learning/react-data'

describe('React teaching trace', () => {
  it.each([
    ['replace', 1],
    ['updater', 3],
  ] as const)('%s updates keep DOM unchanged until commit', (mode, result) => {
    const steps = renderTrace(mode)
    expect(steps.slice(0, -1).map((step) => step.dom)).toEqual([0, 0, 0])
    expect(steps[2]!.value).toBe(result)
    expect(steps[3]!.dom).toBe(result)
  })
  it('links every related concept to an existing node', () => {
    const ids = new Set<string>(reactConcepts.map((item) => item.id))
    for (const concept of reactConcepts) {
      for (const id of concept.related) expect(ids.has(id)).toBe(true)
    }
  })
})

import {
  reactMapBranches,
  reactMapConcepts,
  reactMapNotes,
} from '@/components/learning/react-map-data'

it('connects every React leaf to a branch, inspector and valid related concepts', () => {
  const branches = new Set(reactMapBranches.map((branch) => branch.id))
  const nodes = new Set(reactMapConcepts.map((node) => node.id))
  expect(nodes.size).toBe(reactMapConcepts.length)
  for (const node of reactMapConcepts) {
    expect(branches.has(node.branch)).toBe(true)
    const notes = reactMapNotes[node.id]!
    expect(notes.code.length).toBeGreaterThan(0)
    for (const related of notes.related) expect(nodes.has(related)).toBe(true)
  }
  for (const branch of branches)
    expect(reactMapConcepts.some((node) => node.branch === branch)).toBe(true)
})
