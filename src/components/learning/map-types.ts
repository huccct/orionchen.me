export type MapLevel = '基础' | '进阶' | '工程' | '生态'
export type MapBranch = { id: string; title: string; question: string }
export type MapConcept = {
  id: string
  branch: string
  group?: string
  level?: MapLevel
  name: string
  role: string
  why: string
  link: string
  check: string
  docs: string
}
export type MapNote = { when: string; pitfall: string; code?: string; related: string[] }
export type CurriculumEntry = {
  id: string
  branch: string
  group: string
  level: MapLevel
  name: string
  why: string
  when: string
  pitfall: string
  check: string
  docs: string
  related: string[]
}
export function curriculumData(entries: CurriculumEntry[]) {
  return {
    concepts: entries.map((entry) => ({
      id: entry.id,
      branch: entry.branch,
      group: entry.group,
      level: entry.level,
      name: entry.name,
      why: entry.why,
      check: entry.check,
      docs: entry.docs,
      role: `${entry.level} · ${entry.group}`,
      link: '先理解关联概念，再将本节点用于具体场景；下方链接是知识依赖与延伸，不是调用顺序。',
    })),
    notes: Object.fromEntries(
      entries.map((entry) => [
        entry.id,
        { when: entry.when, pitfall: entry.pitfall, related: entry.related },
      ])
    ),
  }
}
