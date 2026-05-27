import { describe, expect, it } from 'vitest'
import { getReadingTime, getTableOfContents } from '@/lib/post-metadata'

describe('getReadingTime', () => {
  it('returns at least one minute for short posts', () => {
    expect(getReadingTime('短文 mixed with English words.').text).toBe('约 1 分钟阅读')
  })

  it('counts Chinese characters and Latin words together', () => {
    const content = `${'中文'.repeat(260)} ${'word '.repeat(221)}`

    expect(getReadingTime(content).minutes).toBe(3)
  })
})

describe('getTableOfContents', () => {
  it('extracts h1-h3 headings and skips the duplicated document title', () => {
    expect(
      getTableOfContents(
        [
          '# 文章标题',
          '## 为什么 90% 的 AI 直出 HTML PPT 都很丑',
          '### `token` 和 **brief**',
          '#### 不进目录',
        ].join('\n'),
        '文章标题'
      )
    ).toEqual([
      {
        id: '为什么-90-的-ai-直出-html-ppt-都很丑',
        level: 2,
        title: '为什么 90% 的 AI 直出 HTML PPT 都很丑',
      },
      {
        id: 'token-和-brief',
        level: 3,
        title: 'token 和 brief',
      },
    ])
  })

  it('ignores headings inside fenced code blocks and de-duplicates repeated headings', () => {
    expect(
      getTableOfContents(['```', '## fake', '```', '## Repeat', '## Repeat'].join('\n'))
    ).toEqual([
      {
        id: 'repeat',
        level: 2,
        title: 'Repeat',
      },
      {
        id: 'repeat-1',
        level: 2,
        title: 'Repeat',
      },
    ])
  })
})
