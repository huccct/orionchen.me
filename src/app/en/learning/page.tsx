import { LearningIndexContent } from '@/components/page-content/learning-page-content'
import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: 'Knowledge Maps',
  description:
    'Build useful mental models with knowledge maps, interactive experiments and reasoning checks.',
  path: '/en/learning',
})
export default function LearningPage() {
  return <LearningIndexContent locale="en" />
}
