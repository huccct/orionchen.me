import type { Locale } from '@/i18n/config'
import { localePathPrefix } from '@/i18n/config'

export type NeighborhoodEntry = { title: string; summary: string; href: string }
export type NeighborhoodStop = NeighborhoodEntry & { label: string; note: string }

export function createNeighborhoodStops(
  locale: Locale,
  posts: { title: string; summary?: string; slug: string }[],
  works: { title: string; summary: string }[],
  books: { title: string; note: string }[]
): [NeighborhoodStop, NeighborhoodStop, NeighborhoodStop] {
  const prefix = localePathPrefix[locale]
  const zh = locale === 'zh'
  return [
    {
      label: zh ? '写作' : 'Writing',
      note: zh ? '把想法写下来' : 'Thinking on paper',
      title: posts[0]?.title ?? (zh ? '写作归档' : 'Writing archive'),
      summary:
        posts[0]?.summary ??
        (zh ? '文字、观察和还在形成的想法。' : 'Words, observations, and ideas in progress.'),
      href: `${prefix}/blog`,
    },
    {
      label: zh ? '作品' : 'Works',
      note: zh ? '做一点，记录一点' : 'Making and recording',
      title: works[0]?.title ?? (zh ? '作品归档' : 'Works archive'),
      summary:
        works[0]?.summary ??
        (zh ? '代码、影像和正在尝试的事。' : 'Code, film, and things in progress.'),
      href: `${prefix}/works`,
    },
    {
      label: zh ? '阅读' : 'Reading',
      note: zh ? '在别人的句子里停一会儿' : 'Stay with a good sentence',
      title: books[0]?.title ?? (zh ? '一些想留下来的书' : 'Books to keep close'),
      summary: books[0]?.note ?? '',
      href: `${prefix}/reading`,
    },
  ]
}

// ponytail: fixed footpaths need only a timed return trip; use navigation meshes if residents gain free roaming.
export function neighborhoodWalk(time: number, duration: number) {
  const cycle = time % (2 * (duration + 3))
  const returning = cycle > duration + 3
  const legTime = returning ? cycle - duration - 3 : cycle
  const fraction = Math.min(legTime / duration, 1)
  return { returning, moving: legTime < duration, u: returning ? 1 - fraction : fraction }
}
