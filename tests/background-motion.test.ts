import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import { SiteFooter } from '@/components/site-footer'

const route = vi.hoisted(() => ({ pathname: '/' }))
vi.stubGlobal('React', React)
vi.mock('next/navigation', () => ({ usePathname: () => route.pathname }))

it('offers a localized, keyboard-accessible background pause control on both locales', () => {
  for (const [pathname, label] of [
    ['/', '暂停背景'],
    ['/en', 'Pause background'],
  ]) {
    route.pathname = pathname!
    const html = renderToStaticMarkup(React.createElement(SiteFooter))
    expect(html).toMatch(/<button[^>]*type="button"[^>]*aria-pressed="false"/)
    expect(html).toContain(label)
    expect(html).toContain('data-motion-paused="false"')
  }
})
