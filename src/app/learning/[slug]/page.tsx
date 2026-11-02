import { notFound } from 'next/navigation'
import { LearningTopicContent } from '@/components/page-content/learning-page-content'
import { getLearningTopics, getLearningTopic, getLearningAvailableLocales } from '@/lib/learning'
import { createMetadata } from '@/lib/seo'

export function generateStaticParams() {
  return getLearningTopics('zh').map((topic) => ({ slug: topic.slug }))
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const topic = getLearningTopic(slug, 'zh')
  if (!topic) notFound()
  return createMetadata({
    title: topic.title,
    description: topic.summary,
    path: `/learning/${slug}`,
    keywords: topic.tags,
    availableLocales: getLearningAvailableLocales(slug),
  })
}
export default async function LearningTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <LearningTopicContent locale="zh" slug={slug} />
}
