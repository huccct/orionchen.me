import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { MDXContent } from '@content-collections/mdx/react'
import { ReactExplorer } from '@/components/learning/react-explorer'
import { reactMapBranches } from '@/components/learning/react-map-data'
import { NestjsExplorer } from '@/components/learning/nestjs-mindmap'
import { notFound } from 'next/navigation'
import { RoomHeader } from '@/components/room-header'
import { JsonLd } from '@/components/json-ld'
import { mdxComponents } from '@/components/mdx/mdx-components'
import { localePathPrefix, type Locale } from '@/i18n/config'
import { getLearningTopic, getLearningTopics } from '@/lib/learning'
import { createBreadcrumbJsonLd, createCollectionPageJsonLd } from '@/lib/seo'
import '@/components/room-header.css'
import { nestMapBranches } from '@/components/learning/nestjs-map-data'
import { LearningMapPreview } from '@/components/learning/learning-map-preview'
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
          These topics are available in Chinese. English topics will appear here when translated.
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
              {(topic.slug === 'nestjs' || topic.slug === 'react') && (
                <LearningMapPreview
                  title={topic.title}
                  branches={topic.slug === 'react' ? reactMapBranches : nestMapBranches}
                />
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
  if (slug === 'react')
    return <ReactExplorer reference={<MDXContent code={topic.body} components={mdxComponents} />} />
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
