import { branches, concepts, conceptNotes } from './nestjs-data'
import { nestAdditionalBranches, nestCurriculum } from './nestjs-curriculum'
import type { MapConcept, MapNote } from './map-types'
export const nestMapBranches = [...branches, ...nestAdditionalBranches]
export const nestMapConcepts: MapConcept[] = [
  ...concepts.map((node) => ({ ...node, group: '核心概念', level: '基础' as const })),
  ...nestCurriculum.concepts,
]
export const nestMapNotes: Record<string, MapNote> = { ...conceptNotes, ...nestCurriculum.notes }
