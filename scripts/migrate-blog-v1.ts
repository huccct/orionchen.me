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
