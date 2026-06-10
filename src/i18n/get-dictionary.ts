import type { Locale } from './config'

import zh from './dictionaries/zh.json'
import en from './dictionaries/en.json'

/**
 * Synchronous dictionary access. The JSON files are imported statically so
 * the server bundle includes both locales — at ~70 lines each, the cost is
 * negligible and avoids async plumbing in every page.
 *
 * Components stay in Server Component territory (no 'use client' files
 * import this), so the dictionaries do not ship to the browser bundle.
 */

export type Dictionary = typeof zh

const dictionaries: Record<Locale, Dictionary> = {
  zh,
  en,
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}

/**
 * Substitute `{key}` placeholders in a dictionary string. Used for the
 * handful of templated strings (page numbers, tag counts) — the dictionary
 * keeps the placeholder, this fills it.
 */
export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in vars ? String(vars[key]) : match
  )
}
