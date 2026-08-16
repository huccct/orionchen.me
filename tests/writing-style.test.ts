import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { describe, expect, it } from 'vitest'

const postsDirectory = path.join(process.cwd(), 'src/content/posts')
const postFiles = fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.mdx'))

function bodyLines(content: string) {
  let inFence = false

  return content.split(/\r?\n/).filter((line) => {
    if (/^\s{0,3}(```|~~~)/.test(line)) {
      inFence = !inFence
      return false
    }

    return !inFence
  })
}

describe('writing style', () => {
  it.each(postFiles)('%s follows the shared structural rules', (file) => {
    const source = fs.readFileSync(path.join(postsDirectory, file), 'utf8')
    const { content, data } = matter(source)
    const lines = bodyLines(content)
    const headings = lines.flatMap((line) => {
      const match = line.match(/^(#{2,4})\s+(.+)$/)
      return match ? [{ level: match[1]!.length, title: match[2]!.trim() }] : []
    })
    const imageAlts = lines.flatMap((line) =>
      [...line.matchAll(/!\[([^\]]*)\]\([^)]+\)/g)].map((match) => match[1]!.trim())
    )
    const tags = data.tags ?? []

    expect(headings[0]?.level).toBe(2)
    expect(
      headings.every((heading) => !/^(?:[一二三四五六七八九十\d]+[、.]?)?$/.test(heading.title))
    ).toBe(true)
    expect(tags.length).toBeGreaterThanOrEqual(1)
    expect(tags.length).toBeLessThanOrEqual(3)
    expect(new Set(tags).size).toBe(tags.length)
    expect(tags).not.toContain('chinese')
    expect(tags).not.toContain('english')
    expect(imageAlts.every((alt) => alt !== '' && !/^(?:iamge|image)\d*$/i.test(alt))).toBe(true)
    expect(source).toMatch(/^date: ['"]\d{4}-\d{2}-\d{2}['"]$/m)
  })
})
