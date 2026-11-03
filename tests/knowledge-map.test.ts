import { describe, expect, it } from 'vitest'
import { layoutKnowledgeMap, groupKey } from '@/components/learning/map-layout'
import {
  reactMapBranches,
  reactMapConcepts,
  reactMapNotes,
} from '@/components/learning/react-map-data'
import {
  nestMapBranches,
  nestMapConcepts,
  nestMapNotes,
} from '@/components/learning/nestjs-map-data'

for (const [name, branches, concepts, notes] of [
  ['React', reactMapBranches, reactMapConcepts, reactMapNotes],
  ['NestJS', nestMapBranches, nestMapConcepts, nestMapNotes],
] as const) {
  describe(`${name} curriculum`, () => {
    it('has explained, connected advanced and engineering topics in every branch', () => {
      const ids = new Set(concepts.map((node) => node.id))
      expect(ids.size).toBe(concepts.length)
      expect(concepts.some((node) => node.level === '进阶')).toBe(true)
      expect(concepts.some((node) => node.level === '工程')).toBe(true)
      for (const branch of branches)
        expect(concepts.some((node) => node.branch === branch.id)).toBe(true)
      for (const node of concepts) {
        expect(branches.some((branch) => branch.id === node.branch)).toBe(true)
        expect(node.why.length).toBeGreaterThan(10)
        expect(node.check.length).toBeGreaterThan(10)
        expect(notes[node.id]?.when.length).toBeGreaterThan(5)
        expect(notes[node.id]?.pitfall.length).toBeGreaterThan(5)
        for (const related of notes[node.id]!.related)
          expect(ids.has(related), `${node.id} → ${related}`).toBe(true)
      }
    })
    it('reveals branches, then groups, then concepts without six-branch assumptions', () => {
      const closed = branches.map((branch) => branch.id)
      const groups = [
        ...new Set(concepts.map((node) => groupKey(node.branch, node.group ?? '核心概念'))),
      ]
      const overview = layoutKnowledgeMap(branches, concepts, closed, groups)
      expect(overview.positions.length).toBe(branches.length)
      const grouped = layoutKnowledgeMap(branches, concepts, [], groups)
      expect(grouped.positions.filter((node) => node.kind === 'group').length).toBe(groups.length)
      expect(grouped.positions.some((node) => node.kind === 'concept')).toBe(false)
      const full = layoutKnowledgeMap(branches, concepts, [], [])
      expect(full.positions.filter((node) => node.kind === 'concept').length).toBe(concepts.length)
      for (const side of [false, true]) {
        const leaves = full.positions
          .filter((node) => node.kind === 'concept' && node.right === side)
          .sort((a, b) => a.y - b.y)
        for (let i = 1; i < leaves.length; i++)
          expect(leaves[i]!.y).toBeGreaterThanOrEqual(leaves[i - 1]!.y + leaves[i - 1]!.height)
      }
      const ids = new Set(['root', ...full.positions.map((node) => node.id)])
      expect(ids.size).toBe(full.positions.length + 1)
      for (const edge of full.edges) {
        expect(ids.has(edge.from)).toBe(true)
        expect(ids.has(edge.to)).toBe(true)
      }
    })
  })
}
