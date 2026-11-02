import { expect, it } from 'vitest'
import { buildLocalePath } from '@/i18n/get-locale'
import type { LocaleAvailability } from '@/i18n/locale-availability-types'

const availability: LocaleAvailability = {
  posts: { zh: [], en: [] },
  works: { zh: [], en: [] },
  learning: { zh: ['nestjs'], en: [] },
}

it('falls back to the learning index for an untranslated topic', () => {
  expect(buildLocalePath('en', '/learning/nestjs', availability)).toBe('/en/learning')
  expect(buildLocalePath('zh', '/en/learning/nestjs', availability)).toBe('/learning/nestjs')
})

it('preserves the independent learning index when switching language', () => {
  expect(buildLocalePath('en', '/learning', availability)).toBe('/en/learning')
  expect(buildLocalePath('zh', '/en/learning', availability)).toBe('/learning')
})
