import { expect, it } from 'vitest'
import { databaseTrace, type DatabaseStrategy } from '@/components/learning/database-trace'
import { databaseBranches, databaseCurriculum } from '@/components/learning/database-data'

it.each(['naive', 'atomic', 'locked'] as DatabaseStrategy[])(
  '%s models committed state and rollback',
  (strategy) => {
    const normal = databaseTrace(strategy, false)
    expect(normal.at(-1)).toMatchObject({ stock: 0, orders: strategy === 'naive' ? 2 : 1 })
    expect(normal.find((step) => step.title === 'A 扣减，B 等待写锁')).toMatchObject({
      stock: 1,
      orders: 0,
    })
    if (strategy !== 'naive') expect(normal.at(-1)?.b).toBe('售罄，不建单')
    const failed = databaseTrace(strategy, true)
    expect(failed.find((step) => step.title === 'A 建单失败，回滚')).toMatchObject({
      stock: 1,
      orders: 0,
    })
    expect(failed.at(-1)).toMatchObject({ stock: 0, orders: 1, a: '失败，已回滚', b: '购买成功' })
  }
)
it('connects all database concepts and populates all branches', () => {
  const ids = new Set(databaseCurriculum.concepts.map((node) => node.id))
  expect(ids.size).toBe(databaseCurriculum.concepts.length)
  for (const branch of databaseBranches)
    expect(databaseCurriculum.concepts.some((node) => node.branch === branch.id)).toBe(true)
  for (const node of databaseCurriculum.concepts) {
    expect(databaseBranches.some((branch) => branch.id === node.branch)).toBe(true)
    for (const related of databaseCurriculum.notes[node.id]!.related)
      expect(ids.has(related)).toBe(true)
  }
})
