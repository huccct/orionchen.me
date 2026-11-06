import { expect, it } from 'vitest'
import { requestTrace } from '@/components/learning/request-trace'
import { requestBranches, requestCurriculum } from '@/components/learning/request-data'

it('distinguishes progressive delivery, buffering and cancellation propagation', () => {
  const streaming = requestTrace('streaming')
  const buffered = requestTrace('buffered')
  expect(streaming.slice(1, 4).map((step) => step.visible)).toEqual([
    '你好，',
    '你好，这是',
    '你好，这是流式回答。',
  ])
  expect(buffered.slice(0, -1).every((step) => step.received === '' && step.visible === '')).toBe(
    true
  )
  expect(buffered[3]?.buffered).toBe('你好，这是流式回答。')
  expect(buffered.at(-1)).toMatchObject({ buffered: '', visible: streaming.at(-1)?.visible })
  expect(requestTrace('disconnected', true).at(-1)).toMatchObject({
    generated: '你好，',
    visible: '你好，',
  })
  expect(requestTrace('disconnected', false).at(-1)).toMatchObject({
    generated: '你好，这是流式回答。',
    received: '你好，',
    visible: '你好，',
  })
})
it('connects request concepts to populated branches and valid related nodes', () => {
  const ids = new Set(requestCurriculum.concepts.map((node) => node.id))
  expect(ids.size).toBe(requestCurriculum.concepts.length)
  for (const branch of requestBranches)
    expect(requestCurriculum.concepts.some((node) => node.branch === branch.id)).toBe(true)
  for (const node of requestCurriculum.concepts) {
    expect(requestBranches.some((branch) => branch.id === node.branch)).toBe(true)
    for (const related of requestCurriculum.notes[node.id]!.related)
      expect(ids.has(related)).toBe(true)
  }
})
