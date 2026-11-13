import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import { MatrixComputer, monitorPath, terminalMessage, terminalRoute } from '@/app/matrix/computer'
import { buildLocalePath } from '@/i18n/get-locale'

vi.stubGlobal('React', React)
vi.mock('next-themes', () => ({ useTheme: () => ({ resolvedTheme: 'light', setTheme: vi.fn() }) }))

it('offers an accessible terminal without mixing in website chrome', () => {
  const posts = [{ title: 'A < B & C', slug: 'real-post', date: '2026-11-11' }]
  const room = renderToStaticMarkup(React.createElement(MatrixComputer, { posts }))
  expect(room).toContain('role="button"')
  expect(room).toContain('按回车靠近')
  expect(room).toContain('Wake up, Orion.')
  expect(room).not.toContain('靠近电脑</button>')
  expect(room).not.toContain('点击屏幕，进入我的世界')
  expect(room).not.toContain('PERSONAL SPACE')
  expect(room).not.toContain('aria-label="暂停环境"')
  expect(room).toContain('data-daylight="false"')
  expect(room).not.toContain('matrix-content-header')
  expect(room).not.toContain('matrix-content-footer')
  expect(room).toContain('Type ')
  expect(room).not.toContain('CONNECTED')
  expect(room).not.toContain('disconnect')
  expect(room).not.toContain('lamp: on')
  expect(room).toContain('aria-label="终端指令"')
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

it('types the wake-up message and keeps it visible', () => {
  expect(terminalMessage(0)).toBe('W')
  expect(terminalMessage(110)).toBe('Wa')
  expect(terminalMessage(5000)).toBe('Wake up, Orion.')
  expect(terminalMessage(6000)).toBe('Wake up, Orion.')
  expect(terminalMessage(10000)).toBe('Wake up, Orion.')
})

it('routes only supported terminal commands, without interpreting input as code or a URL', () => {
  expect(terminalRoute(' BLOG ')).toBe('/blog')
  expect(terminalRoute('works')).toBe('/works')
  expect(terminalRoute('ls --all')).toBe('/blog')
  expect(terminalRoute('about')).toBe('/about')
  for (const value of ['whoami', '__proto__', 'constructor', 'https://example.com', 'blog; exit']) {
    expect(terminalRoute(value)).toBeNull()
  }
})
