import Link from 'next/link'
import Image from 'next/image'
import { MuscleExplorer } from '@/components/learning/muscle-explorer'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { MDXContent } from '@content-collections/mdx/react'
import { DatabaseExplorer } from '@/components/learning/database-explorer'
import { databaseBranches } from '@/components/learning/database-data'
import { RequestExplorer } from '@/components/learning/request-explorer'
import { requestBranches } from '@/components/learning/request-data'
import { AgentExplorer } from '@/components/learning/agent-explorer'
import { agentBranches } from '@/components/learning/agent-data'
import { AiCodingExplorer } from '@/components/learning/ai-coding-explorer'
import { aiCodingBranches } from '@/components/learning/ai-coding-data'
import { EvaluationExplorer } from '@/components/learning/evaluation-explorer'
import { evaluationBranches } from '@/components/learning/evaluation-data'
import { ToolsMcpExplorer } from '@/components/learning/tools-mcp-explorer'
import { toolsMcpBranches } from '@/components/learning/tools-mcp-data'
import { ContextExplorer } from '@/components/learning/context-explorer'
import { contextBranches } from '@/components/learning/context-data'
import { LlmMechanicsExplorer } from '@/components/learning/llm-mechanics-explorer'
import { mechanicsBranches } from '@/components/learning/llm-mechanics-data'
import { LlmExplorer } from '@/components/learning/llm-explorer'
import { llmBranches } from '@/components/learning/llm-data'
import { RagExplorer } from '@/components/learning/rag-explorer'
import { ragBranches } from '@/components/learning/rag-data'
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
              {topic.slug === 'muscle-function' && (
                <Image
                  src="/images/learning/muscles/anatomy-plate.png"
                  alt="人体肌肉前后视教学图"
                  width={1536}
                  height={1024}
                  sizes="(max-width: 600px) 100vw, 520px"
                  className="max-h-72 w-full rounded-lg bg-white object-contain"
                />
              )}
              {(topic.slug === 'nestjs' ||
                topic.slug === 'react' ||
                topic.slug === 'agent-engineering' ||
                topic.slug === 'rag' ||
                topic.slug === 'llm' ||
                topic.slug === 'llm-mechanics' ||
                topic.slug === 'context-engineering' ||
                topic.slug === 'tools-mcp' ||
                topic.slug === 'evaluation' ||
                topic.slug === 'ai-coding' ||
                topic.slug === 'request-journey' ||
                topic.slug === 'database') && (
                <LearningMapPreview
                  title={topic.title}
                  branches={
                    topic.slug === 'tools-mcp'
                      ? toolsMcpBranches
                      : topic.slug === 'context-engineering'
                        ? contextBranches
                        : topic.slug === 'llm-mechanics'
                          ? mechanicsBranches
                          : topic.slug === 'ai-coding'
                            ? aiCodingBranches
                            : topic.slug === 'evaluation'
                              ? evaluationBranches
                              : topic.slug === 'llm'
                                ? llmBranches
                                : topic.slug === 'rag'
                                  ? ragBranches
                                  : topic.slug === 'database'
                                    ? databaseBranches
                                    : topic.slug === 'request-journey'
                                      ? requestBranches
                                      : topic.slug === 'agent-engineering'
                                        ? agentBranches
                                        : topic.slug === 'react'
                                          ? reactMapBranches
                                          : nestMapBranches
                  }
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
  if (slug === 'muscle-function')
    return (
      <MuscleExplorer reference={<MDXContent code={topic.body} components={mdxComponents} />} />
    )
  if (slug === 'database')
    return (
      <DatabaseExplorer reference={<MDXContent code={topic.body} components={mdxComponents} />} />
    )
  if (slug === 'request-journey')
    return (
      <RequestExplorer reference={<MDXContent code={topic.body} components={mdxComponents} />} />
    )
  if (slug === 'agent-engineering')
    return <AgentExplorer reference={<MDXContent code={topic.body} components={mdxComponents} />} />
  if (slug === 'ai-coding')
    return (
      <AiCodingExplorer reference={<MDXContent code={topic.body} components={mdxComponents} />} />
    )
  if (slug === 'evaluation')
    return (
      <EvaluationExplorer reference={<MDXContent code={topic.body} components={mdxComponents} />} />
    )
  if (slug === 'tools-mcp')
    return (
      <ToolsMcpExplorer reference={<MDXContent code={topic.body} components={mdxComponents} />} />
    )
  if (slug === 'context-engineering')
    return (
      <ContextExplorer reference={<MDXContent code={topic.body} components={mdxComponents} />} />
    )
  if (slug === 'llm-mechanics')
    return (
      <LlmMechanicsExplorer
        reference={<MDXContent code={topic.body} components={mdxComponents} />}
      />
    )
  if (slug === 'llm')
    return <LlmExplorer reference={<MDXContent code={topic.body} components={mdxComponents} />} />
  if (slug === 'rag')
    return <RagExplorer reference={<MDXContent code={topic.body} components={mdxComponents} />} />
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
