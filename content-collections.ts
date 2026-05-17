import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import { postSchema } from './src/content/schemas'

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

export default defineConfig({
  content: [posts],
})
