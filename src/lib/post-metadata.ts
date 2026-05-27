export type ReadingTime = {
  minutes: number
  text: string
  wordCount: number
}

export type TableOfContentsItem = {
  id: string
  title: string
  level: 1 | 2 | 3
}

const CJK_RE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu
const LATIN_WORD_RE = /[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g

export function getReadingTime(content: string): ReadingTime {
  const text = stripMarkdown(content)
  const cjkCharacterCount = text.match(CJK_RE)?.length ?? 0
  const latinWordCount = text.replace(CJK_RE, ' ').match(LATIN_WORD_RE)?.length ?? 0
  const wordCount = cjkCharacterCount + latinWordCount
  const minutes = Math.max(1, Math.ceil(cjkCharacterCount / 500 + latinWordCount / 220))

  return {
    minutes,
    text: `约 ${minutes} 分钟阅读`,
    wordCount,
  }
}

export function getTableOfContents(
  content: string,
  documentTitle?: string
): TableOfContentsItem[] {
  const slugger = createSlugger()
  const headings: TableOfContentsItem[] = []
  let inCodeFence = false

  for (const line of content.split(/\r?\n/)) {
    if (/^\s{0,3}(```|~~~)/.test(line)) {
      inCodeFence = !inCodeFence
      continue
    }

    if (inCodeFence) continue

    const match = line.match(/^\s{0,3}(#{1,3})\s+(.+?)\s*#*\s*$/)
    if (!match) continue

    const marker = match[1]
    const heading = match[2]
    if (!marker || !heading) continue

    const level = marker.length as TableOfContentsItem['level']
    const title = stripInlineMarkdown(heading)

    if (!title || (level === 1 && title === documentTitle)) continue

    headings.push({
      id: slugger.slug(title),
      title,
      level,
    })
  }

  return headings
}

function stripMarkdown(content: string) {
  return content
    .replace(/^\s{0,3}---[\s\S]*?^\s{0,3}---/m, ' ')
    .replace(/^\s{0,3}(```|~~~)[\s\S]*?^\s{0,3}\1/gm, ' ')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_~|[\]()-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function stripInlineMarkdown(value: string) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[*_~]/g, '')
    .replace(/\\([\\`*{}[\]()#+\-.!_>])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function createSlugger() {
  const occurrences = new Map<string, number>()

  return {
    slug(value: string) {
      const originalSlug = slug(value)
      let result = originalSlug

      while (occurrences.has(result)) {
        const nextCount = (occurrences.get(originalSlug) ?? 0) + 1
        occurrences.set(originalSlug, nextCount)
        result = `${originalSlug}-${nextCount}`
      }

      occurrences.set(result, 0)
      return result
    },
  }
}

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Mark}\p{Number}_ ]+/gu, '')
    .replace(/ /g, '-')
}
