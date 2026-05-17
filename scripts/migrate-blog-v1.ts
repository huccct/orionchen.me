import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const EARLY_SLUGS = new Set(['frontend-interview', 'frontend-interview2'])

export function mapFrontmatter(old: Record<string, unknown>, slug: string) {
  const out: Record<string, unknown> = {
    title: old.title,
    date: old.date,
    slug,
    summary: old.summary,
    tags: old.tags ?? [],
    draft: old.draft ?? false,
  }

  if (EARLY_SLUGS.has(slug)) {
    out.earlyContent = true
  }

  return out
}

export function rewriteImagePaths(content: string): string {
  return content.replace(/\/static\/images\//g, '/images/posts/')
}

export async function migrateOne(srcPath: string) {
  const slug = path.basename(srcPath, '.mdx')
  const raw = await fs.readFile(srcPath, 'utf8')
  const { data, content } = matter(raw)
  const serialized = matter.stringify(rewriteImagePaths(content), mapFrontmatter(data, slug))

  return {
    slug,
    serialized,
  }
}
