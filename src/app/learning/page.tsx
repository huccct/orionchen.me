import { LearningIndexContent } from '@/components/page-content/learning-page-content'
import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: '知识地图',
  description: '用知识地图、交互实验和理解检查，建立能用的知识框架。',
  path: '/learning',
})
export default function LearningPage() {
  return <LearningIndexContent locale="zh" />
}
