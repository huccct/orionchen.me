import { z } from 'zod'

/**
 * Locale of the post or work body. Defaults to 'zh' so existing content
 * needs no frontmatter migration. English entries opt in with `lang: en`.
 * See docs/superpowers/specs/2026-06-10-i18n-unfreeze.md §5.
 */
export const langSchema = z.enum(['zh', 'en']).optional().default('zh')

export const postSchema = z.object({
  title: z.string(),
  date: z.string(),
  slug: z.string(),
  content: z.string(),
  summary: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  draft: z.boolean().optional().default(false),
  earlyContent: z.boolean().optional().default(false),
  cover: z.string().optional(),
  lang: langSchema,
})

export type Post = z.infer<typeof postSchema>

export const workSchema = z.object({
  slug: z.string(),
  title: z.string(),
  content: z.string(),
  summary: z.string(),
  type: z.enum(['code', 'documentary', 'writing']),
  status: z.enum(['wip', 'live', 'archived']),
  publishedAt: z.string(),
  cover: z.string(),
  featured: z.boolean().optional().default(false),
  hasDetail: z.boolean().optional().default(false),
  updatedAt: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  links: z
    .object({
      repo: z.string().optional(),
      demo: z.string().optional(),
      youtube: z.string().optional(),
      bilibili: z.string().optional(),
      xiaoyuzhou: z.string().optional(),
      article: z.string().optional(),
      other: z
        .array(
          z.object({
            label: z.string(),
            url: z.string(),
          })
        )
        .optional(),
    })
    .optional(),
  meta: z
    .object({
      stars: z.number().optional(),
      language: z.string().optional(),
      runtime: z.string().optional(),
      guests: z.array(z.string()).optional(),
      episode: z.string().optional(),
      wordCount: z.number().optional(),
    })
    .optional(),
  lang: langSchema,
})

export type Work = z.infer<typeof workSchema>
