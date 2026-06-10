/**
 * i18n configuration. See docs/superpowers/specs/2026-06-10-i18n-unfreeze.md
 * for the routing decision (zh = no path prefix, en = `/en/*` prefix).
 */

export const locales = ['zh', 'en'] as const
export type Locale = (typeof locales)[number]

/** zh has no path prefix; it's the default Chinese-primary site. */
export const defaultLocale: Locale = 'zh'

/** Path segment under which the non-default locale lives. */
export const localePathPrefix: Record<Locale, string> = {
  zh: '',
  en: '/en',
}

/** `<html lang>` value per locale. */
export const htmlLang: Record<Locale, string> = {
  zh: 'zh-CN',
  en: 'en',
}

/** Display label for the language toggle. */
export const localeLabel: Record<Locale, string> = {
  zh: '中',
  en: 'EN',
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
