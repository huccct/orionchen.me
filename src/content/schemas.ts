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
