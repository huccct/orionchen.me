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

async function main() {
  const srcDir = process.env.SRC ?? path.resolve(process.env.HOME!, 'Frontend/blog/data/blog')
  const destDir = path.resolve('src/content/posts')
  await fs.mkdir(destDir, {
    recursive: true,
  })

  const files = (await fs.readdir(srcDir)).filter((file) => file.endsWith('.mdx'))
  let ok = 0
  let fail = 0

  for (const file of files) {
    try {
      const { slug, serialized } = await migrateOne(path.join(srcDir, file))
      await fs.writeFile(path.join(destDir, `${slug}.mdx`), serialized)
      ok += 1
    } catch (error) {
      console.error(`FAIL ${file}:`, error)
      fail += 1
    }
  }

  console.log(`migrated ${ok}/${files.length}, failed ${fail}`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void main()
}
