import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import { postSchema, workSchema } from './src/content/schemas'

const posts = defineCollection({
  name: 'posts',
  directory: 'src/content/posts',
  include: '**/*.mdx',
  schema: postSchema,
  transform: async (doc, ctx) => ({
    ...doc,
    body: await compileMDX(ctx, doc),
  }),
})

const works = defineCollection({
  name: 'works',
  directory: 'src/content/works',
  include: '**/*.mdx',
  schema: workSchema,
  transform: async (doc, ctx) => ({
    ...doc,
    body: await compileMDX(ctx, doc),
  }),
})

export default defineConfig({
  content: [posts, works],
})
