import { expect, it } from 'vitest'
import { mechanicsBranches, mechanicsCurriculum } from '@/components/learning/llm-mechanics-data'
import {
  generationDraws,
  generationProbabilities,
  generationScores,
  generationTrace,
} from '@/components/learning/llm-generation'

it('normalizes stable scores, changes concentration and samples cumulative boundaries', () => {
  const scores = generationScores('rain', [])
  const low = generationProbabilities(scores, 0.3)
  const high = generationProbabilities(scores, 2)
  expect(low[0]!.probability).toBeGreaterThan(high[0]!.probability)
  expect(high.reduce((sum, item) => sum + item.probability, 0)).toBeCloseTo(1)
  expect(
    generationProbabilities(
      [
        { token: 'a', score: 1000 },
        { token: 'b', score: 1000 },
      ],
      1
    )[0]!.probability
  ).toBe(0.5)
  const boundary = generationProbabilities(scores, 1)[0]!.probability
  expect(generationTrace('rain', 1, 'sample', [0])[0]!.selected).toBe('带上')
  expect(generationTrace('rain', 1, 'sample', [boundary])[0]!.selected).toBe('戴上')
  expect(() => generationProbabilities(scores, 0)).toThrow()
  expect(() => generationTrace('rain', 1, 'sample', [1])).toThrow()
})

it('feeds chosen prefixes back, replays exactly and distinguishes EOS from truncation', () => {
  const trace = generationTrace('rain', 1, 'sample', generationDraws[0]!)
  expect(trace).toEqual(generationTrace('rain', 1, 'sample', generationDraws[0]!))
  expect(trace[1]!.prefix).toBe(trace[0]!.selected)
  expect(trace.at(-1)!.stop).toBe('eos')
  expect(trace.at(-1)!.output).not.toContain('<EOS>')
  expect(generationScores('rain', ['<EOS>'])).toEqual([])
  expect(generationTrace('rain', 1, 'sample', generationDraws[0]!, 2).at(-1)!.stop).toBe('limit')
  expect(generationTrace('rain', 1, 'sample', generationDraws[1]!)[0]!.selected).not.toBe(
    trace[0]!.selected
  )
  expect(generationScores('rain', ['带上'])).not.toEqual(generationScores('rain', ['戴上']))
  expect(generationScores('rain', [])).not.toEqual(generationScores('sun', []))
  for (const context of ['rain', 'sun'] as const)
    for (const temperature of [0.3, 1, 2]) {
      const a = generationTrace(context, temperature, 'greedy', generationDraws[0]!)
      const b = generationTrace(context, temperature, 'greedy', generationDraws[1]!)
      expect(a.map((item) => item.selected)).toEqual(b.map((item) => item.selected))
      expect(a[0]!.selected).toBe(context === 'rain' ? '带上' : '戴上')
    }
})

it('connects the curriculum without dangling concepts', () => {
  const ids = mechanicsCurriculum.concepts.map((item) => item.id)
  expect(new Set(ids).size).toBe(ids.length)
  for (const concept of mechanicsCurriculum.concepts) {
    expect(mechanicsBranches.some((branch) => branch.id === concept.branch)).toBe(true)
    for (const id of mechanicsCurriculum.notes[concept.id]!.related) expect(ids).toContain(id)
  }
})
