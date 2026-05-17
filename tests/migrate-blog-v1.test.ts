import { describe, expect, it } from 'vitest'
import { mapFrontmatter, rewriteImagePaths } from '@/scripts/migrate-blog-v1'

describe('mapFrontmatter', () => {
  it('preserves title/date/summary/tags', () => {
    const out = mapFrontmatter(
      {
        title: 'X',
        date: '2023-10-22',
        tags: ['frontend'],
        summary: 's',
        draft: false,
      },
      'canvas-drag'
    )
    expect(out).toMatchObject({
      title: 'X',
      date: '2023-10-22',
      summary: 's',
      tags: ['frontend'],
      slug: 'canvas-drag',
    })
  })

  it('flags interview posts as earlyContent', () => {
    const out = mapFrontmatter(
      {
        title: 'Interview',
        date: '2022-01-01',
      },
      'frontend-interview'
    )
    expect(out.earlyContent).toBe(true)
  })

  it('does not flag non-early posts', () => {
    const out = mapFrontmatter(
      {
        title: 'X',
        date: '2024-01-01',
      },
      'ai-agent-crypto-payments'
    )
    expect(out.earlyContent).toBeFalsy()
  })
})

describe('rewriteImagePaths', () => {
  it('rewrites local /static/images/ to /images/posts/', () => {
    expect(rewriteImagePaths(`![x](/static/images/foo.png)`)).toBe(
      `![x](/images/posts/foo.png)`
    )
  })

  it('leaves absolute CDN URLs untouched', () => {
    const md = `![x](https://cdn.jsdelivr.net/foo.webp)`
    expect(rewriteImagePaths(md)).toBe(md)
  })

  it('handles HTML <img> tags', () => {
    expect(rewriteImagePaths(`<img src="/static/images/y.png" />`)).toBe(
      `<img src="/images/posts/y.png" />`
    )
  })
})
