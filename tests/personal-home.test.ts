import fs from 'node:fs'
import path from 'node:path'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import { HomePageContent } from '@/components/page-content/home-page-content'
import { ReadingPageContent } from '@/components/page-content/reading-page-content'
import { RoomHeader } from '@/components/room-header'
import { BlogFilter } from '@/components/blog-filter'
import { getDictionary } from '@/i18n/get-dictionary'
import type { PublishedPost } from '@/lib/posts'

vi.stubGlobal('React', React)
vi.mock('@/lib/posts', () => ({
  POSTS_PER_PAGE: 10,
  getBlogPageHref: (page: number, prefix: string) => `${prefix}/blog/page/${page}`,
  getPublishedPosts: () => [{ slug: 'real-post', title: 'Real writing', date: '2026-08-30' }],
}))

it('introduces the author with localized reading links and no retired scene navigation', () => {
  for (const locale of ['zh', 'en'] as const) {
    const prefix = locale === 'en' ? '/en' : ''
    const html = renderToStaticMarkup(React.createElement(HomePageContent, { locale }))
    expect(html).toContain('Orion Chen')
    expect(html).toContain(`href="${prefix}/blog/real-post"`)
    expect(html).toContain(`href="${prefix}/reading"`)
    expect(html).toContain('href="/rss.xml"')
    expect(html).toContain('href="https://huccct.github.io/vibe/toys/fly-cube/"')
    expect(html).toContain('href="https://huccct.github.io/vibe/toys/west-lake/"')
    expect(html.match(/<img /g)).toHaveLength(2)
    expect(html).not.toMatch(/pixel-town|\/town|gallery-fold/)
    const header = renderToStaticMarkup(
      React.createElement(RoomHeader, { locale, room: 'writing' })
    )
    expect(header).toContain(`href="${prefix}/tags"`)
    expect(header).not.toMatch(/<img|\/town|小屋/)
  }
})

it('groups consecutive article years once while retaining older-page navigation', () => {
  const posts = [
    { slug: 'a', title: 'A', date: '2026-08-30' },
    { slug: 'b', title: 'B', date: '2026-07-12' },
    { slug: 'c', title: 'C', date: '2025-12-01' },
  ] as PublishedPost[]
  const html = renderToStaticMarkup(
    React.createElement(BlogFilter, {
      allPosts: posts,
      pagedPosts: posts,
      dict: getDictionary('en'),
      page: 1,
      pageCount: 2,
      pathPrefix: '/en',
    })
  )
  expect(html.match(/class="writing-year"/g)).toHaveLength(2)
  expect(html).toContain('href="/en/blog/c"')
  expect(html).toContain('href="/en/blog/page/2"')
})

it('shows article context and local artwork without requiring every post to have an image', async () => {
  const { PostCard } = await import('@/components/post-card')
  const post = {
    title: 'A',
    slug: 'a',
    date: '2026-01-01',
    summary: 'Useful context',
    tags: ['history'],
    content: '![A diagram](/images/posts/example.webp)',
  } as PublishedPost
  const html = renderToStaticMarkup(React.createElement(PostCard, { post, pathPrefix: '/en' }))
  expect(html).toContain('Useful context')
  expect(html).toContain('href="/en/tags/history"')
  expect(html).toContain('<img ')
  const textOnly = renderToStaticMarkup(
    React.createElement(PostCard, { post: { ...post, content: '' } })
  )
  expect(textOnly).not.toContain('<img ')
})

it('renders a real local cover for every recommendation in both languages', () => {
  for (const locale of ['zh', 'en'] as const) {
    const books = getDictionary(locale).about.readingItems
    const html = renderToStaticMarkup(React.createElement(ReadingPageContent, { locale }))
    expect(html.match(/<img /g)).toHaveLength(books.length)
    expect(html).not.toMatch(/Orion’s bookshelf|reading-book-imprint|reading-colophon/)
    for (const book of books) {
      const cover = fs.readFileSync(path.join(process.cwd(), 'public', book.cover))
      expect(cover.toString('ascii', 8, 12)).toBe('WEBP')
      expect(html).toContain(encodeURIComponent(book.cover))
    }
  }
})
