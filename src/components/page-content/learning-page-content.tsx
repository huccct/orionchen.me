import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { MDXContent } from '@content-collections/mdx/react'
import { NestjsExplorer } from '@/components/learning/nestjs-mindmap'
import { notFound } from 'next/navigation'
import { RoomHeader } from '@/components/room-header'
import { JsonLd } from '@/components/json-ld'
import { mdxComponents } from '@/components/mdx/mdx-components'
import { localePathPrefix, type Locale } from '@/i18n/config'
import { getLearningTopic, getLearningTopics } from '@/lib/learning'
import { createBreadcrumbJsonLd, createCollectionPageJsonLd } from '@/lib/seo'
import '@/components/room-header.css'
import { branches } from '@/components/learning/nestjs-data'
import '@/components/learning/learning-index.css'

export function LearningIndexContent({ locale }: { locale: Locale }) {
  const zh = locale === 'zh'
  const prefix = localePathPrefix[locale]
  const localized = getLearningTopics(locale)
  const topics = localized.length ? localized : getLearningTopics('zh')
  return (
    <div className="archive-page">
      <JsonLd
        data={createCollectionPageJsonLd({
          name: zh ? '知识地图' : 'Knowledge Maps',
          description: zh
            ? '通过知识地图、预测和实验，建立理解与判断力。'
            : 'Build understanding through maps, predictions and experiments.',
          path: `${prefix}/learning`,
          locale,
        })}
      />
      <RoomHeader room="learning" locale={locale} />
      {!zh && !localized.length && (
        <p className="text-muted-foreground mb-6 text-sm">
          The first topic is available in Chinese. English topics will appear here when translated.
        </p>
      )}
      <div className="learning-shelf">
        {topics.map((topic) => (
          <article key={`${topic.lang}-${topic.slug}`}>
            <Link
              href={`${localePathPrefix[topic.lang]}/learning/${topic.slug}`}
              className="learning-entry"
            >
              <div className="learning-entry-copy">
                <h2>{topic.title}</h2>
                {!zh && topic.lang === 'zh' && (
                  <span className="learning-language" lang="en">
                    In Chinese
                  </span>
                )}
                <p>{topic.summary}</p>
                <span className="learning-entry-action">
                  {zh ? '展开知识地图' : 'Explore the knowledge map'}
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              </div>
              {topic.slug === 'nestjs' && (
                <svg className="learning-map-preview" viewBox="0 0 440 260" aria-hidden="true">
                  {branches.map((branch, index) => {
                    const left = index < 3
                    const y = 58 + (index % 3) * 72
                    const start = left ? 182 : 258
                    const end = left ? 122 : 318
                    return (
                      <g key={branch.id}>
                        <path
                          d={`M ${start} 130 C ${left ? 148 : 292} 130, ${left ? 158 : 282} ${y}, ${end} ${y}`}
                        />
                        <path d={`M ${end} ${y} H ${left ? 40 : 400}`} />
                        <text x={left ? 80 : 360} y={y - 10} textAnchor="middle">
                          {branch.title}
                        </text>
                      </g>
                    )
                  })}
                  <rect x="177" y="110" width="86" height="40" rx="6" />
                  <text className="learning-map-root" x="220" y="135" textAnchor="middle">
                    NestJS
                  </text>
                </svg>
              )}
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}

export function LearningTopicContent({ locale, slug }: { locale: Locale; slug: string }) {
  const topic = getLearningTopic(slug, locale)
  if (!topic) notFound()
  const zh = locale === 'zh'
  const prefix = localePathPrefix[locale]
  if (slug === 'nestjs')
    return (
      <NestjsExplorer reference={<MDXContent code={topic.body} components={mdxComponents} />} />
    )
  return (
    <article data-page="learning" className="mx-auto w-full min-w-0">
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: zh ? '首页' : 'Home', path: prefix || '/' },
          { name: zh ? '知识地图' : 'Knowledge Maps', path: `${prefix}/learning` },
          { name: topic.title, path: `${prefix}/learning/${slug}` },
        ])}
      />
      <nav
        className="room-navigation detail-navigation"
        aria-label={zh ? '学习导航' : 'Learning navigation'}
      >
        <Link
          className="hover:text-accent inline-flex min-h-11 items-center gap-2"
          href={`${prefix}/learning`}
        >
          <ArrowLeft size={15} aria-hidden="true" />
          {zh ? '全部学习专题' : 'All learning topics'}
        </Link>
      </nav>
      <header className="mb-8 space-y-3">
        <h1 className="font-serif text-3xl leading-tight text-balance break-words sm:text-4xl">
          {topic.title}
        </h1>
        <p className="text-muted-foreground text-xs">
          {zh ? '知识地图 · 动手理解' : 'Knowledge Maps · Learn by doing'}
        </p>
      </header>
      <div className="prose min-w-0">
        <MDXContent code={topic.body} components={mdxComponents} />
      </div>
      <Link
        className="text-accent mt-10 inline-flex min-h-11 items-center gap-2 text-sm"
        href={`${prefix}/learning`}
      >
        <ArrowLeft size={15} aria-hidden="true" />
        {zh ? '回到知识地图' : 'Back to knowledge maps'}
      </Link>
    </article>
  )
}
