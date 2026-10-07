import { expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { experiments, pickExperimentPair } from '@/lib/experiments'

it('selects distinct valid works and never repeats the previous pair', () => {
  const seen = new Set<string>()
  for (let i = 0; i < 15; i++) {
    const pair = pickExperimentPair(null, () => (i + 0.5) / 15)
    expect(pair[0]).not.toBe(pair[1])
    pair.forEach((index) => expect(experiments[index]).toBeDefined())
    seen.add(pair.join(','))
    for (let j = 0; j < 14; j++) {
      expect(pickExperimentPair(pair.join(','), () => (j + 0.5) / 14).join(',')).not.toBe(
        pair.join(',')
      )
    }
  }
  expect(seen.size).toBe(15)
  experiments.forEach((item) =>
    expect(existsSync(`public/images/experiments/${item.image}.jpg`)).toBe(true)
  )
})
