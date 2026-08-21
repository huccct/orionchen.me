import { describe, expect, it } from 'vitest'
import { isStandaloneImage } from '@/components/mdx/mdx-image'

describe('isStandaloneImage', () => {
  it('only enables original-image opening outside an existing link', () => {
    expect(isStandaloneImage({ closest: () => null })).toBe(true)
    expect(isStandaloneImage({ closest: () => ({}) as HTMLAnchorElement })).toBe(false)
  })
})
