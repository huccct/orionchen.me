'use client'

import type { ReactNode } from 'react'
import { KnowledgeMapWorkspace } from './knowledge-map-workspace'
import { branches, concepts, conceptNotes } from './nestjs-data'
import { RequestWalkthrough, ModuleWorkshop, Practice } from './nestjs-explorer'

export function NestjsExplorer({ reference }: { reference?: ReactNode }) {
  return (
    <KnowledgeMapWorkspace
      title="NestJS"
      subtitle="构建一个后端系统"
      branches={branches}
      concepts={concepts}
      conceptNotes={conceptNotes}
      modes={['知识地图', '请求实验', '模块实验', '理解检查']}
      reference={reference}
      experimentFor={(concept) => (concept.branch === 'structure' ? '模块实验' : '请求实验')}
      Experiment={NestjsActivities}
    />
  )
}

function NestjsActivities({ mode, onExplore }: { mode: string; onExplore: (id: string) => void }) {
  return mode === '请求实验' ? (
    <RequestWalkthrough />
  ) : mode === '模块实验' ? (
    <ModuleWorkshop />
  ) : (
    <Practice onExplore={onExplore} />
  )
}
