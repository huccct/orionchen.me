import { expect, it } from 'vitest'
import { muscles, muscleSources } from '@/components/learning/muscle-data'

it('keeps anatomy markers, sources and answer choices connected', () => {
  expect(new Set(muscles.map((muscle) => muscle.id)).size).toBe(muscles.length)
  expect(new Set(muscles.map((muscle) => muscle.number)).size).toBe(muscles.length)
  for (const view of ['front', 'back'])
    expect(muscles.some((muscle) => muscle.view === view)).toBe(true)
  for (const muscle of muscles) {
    expect(muscle.x).toBeGreaterThan(0)
    expect(muscle.x).toBeLessThan(100)
    expect(muscle.y).toBeGreaterThan(0)
    expect(muscle.y).toBeLessThan(100)
    expect(muscle.choices[muscle.answer]).toBeTruthy()
    expect(new Set(muscle.choices).size).toBe(muscle.choices.length)
    expect(muscleSources[muscle.source]).toMatch(/^https:\/\/openstax.org\//)
  }
})
