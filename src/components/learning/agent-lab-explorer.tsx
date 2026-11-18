'use client'

import type { ReactNode } from 'react'
import { agentLabMaps } from './agent-lab-data'
import { KnowledgeMapWorkspace } from './knowledge-map-workspace'

export function AgentLabExplorer({
  slug,
  title,
  summary,
  lesson,
}: {
  slug: keyof typeof agentLabMaps
  title: string
  summary: string
  lesson: ReactNode
}) {
  const { branches, curriculum } = agentLabMaps[slug]
  return (
    <KnowledgeMapWorkspace
      title={title}
      subtitle={summary}
      branches={branches}
      concepts={curriculum.concepts}
      conceptNotes={curriculum.notes}
      modes={['知识地图', '动手实验']}
      experimentFor={() => '动手实验'}
      Experiment={<article className="prose mx-auto w-full max-w-3xl">{lesson}</article>}
    />
  )
}
