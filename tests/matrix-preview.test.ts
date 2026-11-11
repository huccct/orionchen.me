import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import { MatrixComputer, monitorPath } from '@/app/matrix/computer'
import { buildLocalePath } from '@/i18n/get-locale'
import { MatrixTerminal } from '@/app/matrix/terminal'

vi.stubGlobal('React', React)

it('offers a keyboard entry without WebGL and preserves real article destinations in the terminal', () => {
  const posts = [{ title: 'A < B & C', slug: 'real-post', date: '2026-11-11' }]
  const room = renderToStaticMarkup(React.createElement(MatrixComputer, { posts }))
  expect(room).toContain('role="button"')
  expect(room).toContain('按回车靠近')
  expect(room).toContain('href="/blog/real-post"')
  expect(room).not.toContain('靠近电脑</button>')
  expect(room).toContain('href="/"')
  expect(room).toContain('href="/classic"')
  const terminal = renderToStaticMarkup(React.createElement(MatrixTerminal, { posts }))
  expect(terminal).toContain('href="/blog/real-post"')
  expect(terminal).toContain('A &lt; B &amp; C')
  expect(terminal).toContain('href="/learning"')
  expect(terminal).toContain('aria-pressed="false"')
  expect(terminal).not.toContain('id="rabbit-hole"')
})

it('embeds only local content and prevents recursive matrix pages while preserving article anchors', () => {
  const origin = 'https://orionchen.me'
  expect(monitorPath('/blog/a?view=full#code', origin)).toBe('/blog/a?view=full#code')
  expect(monitorPath('https://orionchen.me/works', origin)).toBe('/works')
  for (const href of [
    '/',
    '/matrix',
    '/matrix/recursive',
    'https://other.example/blog/a',
    'javascript:alert(1)',
    'mailto:hi@orionchen.me',
    'https://[',
  ]) {
    expect(monitorPath(href, origin)).toBeNull()
  }
})

it('maps the Chinese text home to the existing English home', () => {
  expect(buildLocalePath('en', '/classic')).toBe('/en')
  expect(buildLocalePath('zh', '/classic')).toBe('/classic')
})
