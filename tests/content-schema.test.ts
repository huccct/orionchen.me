import { describe, expect, it } from 'vitest'
import { postSchema } from '@/content/schemas'

describe('postSchema', () => {
  it('accepts a minimal valid post', () => {
    const result = postSchema.safeParse({
      title: 'Hello',
      date: '2024-01-01',
      slug: 'hello',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing title', () => {
    const result = postSchema.safeParse({
      date: '2024-01-01',
      slug: 'hello',
    })
    expect(result.success).toBe(false)
  })

  it('accepts earlyContent flag', () => {
    const result = postSchema.safeParse({
      title: 'X',
      date: '2024-01-01',
      slug: 'x',
      earlyContent: true,
    })
    expect(result.success).toBe(true)
  })
})
