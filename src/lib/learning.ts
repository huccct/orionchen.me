import { allLearnings } from 'content-collections'
import { locales, type Locale } from '@/i18n/config'

export function getLearningTopics(locale: Locale = 'zh') {
  return allLearnings
    .filter((topic) => !topic.draft && topic.lang === locale)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getLearningTopic(slug: string, locale: Locale = 'zh') {
  return getLearningTopics(locale).find((topic) => topic.slug === slug) ?? null
}

export function getLearningAvailableLocales(slug: string) {
  return locales.filter((locale) => getLearningTopic(slug, locale) !== null)
}
