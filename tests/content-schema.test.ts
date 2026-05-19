import { describe, expect, it } from 'vitest'
import { postSchema, workSchema } from '@/content/schemas'

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

describe('workSchema', () => {
  it('accepts a minimal code work', () => {
    const r = workSchema.safeParse({
      slug: 'movorca',
      title: 'Movorca',
      summary: 'AI knowledge video skill',
      type: 'code',
      status: 'live',
      publishedAt: '2026-04-01',
      cover: '/images/works/movorca.jpg',
    })
    expect(r.success).toBe(true)
  })

  it('rejects unknown type', () => {
    const r = workSchema.safeParse({
      slug: 'x',
      title: 'X',
      summary: 'y',
      type: 'podcast',
      status: 'live',
      publishedAt: '2026-04-01',
      cover: '/x.jpg',
    })
    expect(r.success).toBe(false)
  })

  it('accepts documentary with guests + episode', () => {
    const r = workSchema.safeParse({
      slug: 'ep01',
      title: 'EP01',
      summary: 's',
      type: 'documentary',
      status: 'live',
      publishedAt: '2026-06-01',
      cover: '/x.jpg',
      meta: {
        runtime: '32 min',
        guests: ['A'],
        episode: 'EP01',
      },
      links: {
        youtube: 'https://youtu.be/x',
      },
    })
    expect(r.success).toBe(true)
  })

  it('defaults hasDetail to false when absent', () => {
    const r = workSchema.safeParse({
      slug: 'x',
      title: 'X',
      summary: 's',
      type: 'code',
      status: 'live',
      publishedAt: '2026-04-01',
      cover: '/x.jpg',
    })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.hasDetail).toBe(false)
  })

  it('honors explicit hasDetail: true', () => {
    const r = workSchema.safeParse({
      slug: 'x',
      title: 'X',
      summary: 's',
      type: 'code',
      status: 'live',
      publishedAt: '2026-04-01',
      cover: '/x.jpg',
      hasDetail: true,
    })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.hasDetail).toBe(true)
  })
})
