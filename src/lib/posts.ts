import { allPosts } from 'content-collections'

export const POSTS_PER_PAGE = 10

export type PublishedPost = (typeof allPosts)[number]

export function getPublishedPosts() {
  return allPosts.filter((post) => !post.draft).sort((a, b) => b.date.localeCompare(a.date))
}

export function getBlogPageCount(posts: PublishedPost[] = getPublishedPosts()) {
  return Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE))
}

export function getBlogPagePosts(page: number, posts: PublishedPost[] = getPublishedPosts()) {
  const start = (page - 1) * POSTS_PER_PAGE

  return posts.slice(start, start + POSTS_PER_PAGE)
}

export function getBlogPageHref(page: number) {
  return page <= 1 ? '/blog' : `/blog/page/${page}`
}

export function getPostWithNeighbors(slug: string) {
  const posts = getPublishedPosts()
  const index = posts.findIndex((post) => post.slug === slug)

  if (index === -1) {
    return {
      post: null,
      newerPost: null,
      olderPost: null,
    }
  }

  return {
    post: posts[index] ?? null,
    newerPost: posts[index - 1] ?? null,
    olderPost: posts[index + 1] ?? null,
  }
}
