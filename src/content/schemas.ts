import { z } from 'zod'

export const postSchema = z.object({
  title: z.string(),
  date: z.string(),
  slug: z.string(),
  summary: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  draft: z.boolean().optional().default(false),
  earlyContent: z.boolean().optional().default(false),
  cover: z.string().optional(),
})

export type Post = z.infer<typeof postSchema>

export const workSchema = z.object({
  slug: z.string(),
  title: z.string(),
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
})

export type Work = z.infer<typeof workSchema>
