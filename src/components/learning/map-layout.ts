import type { MapBranch, MapConcept } from './map-types'

export type MapPosition = {
  id: string
  kind: 'branch' | 'group' | 'concept'
  label: string
  x: number
  y: number
  width: number
  height: number
  branch: string
  colorIndex: number
  right: boolean
  count?: number
}
export function groupKey(branch: string, group: string) {
  return `${branch}::${group}`
}
export function layoutKnowledgeMap(
  branches: MapBranch[],
  concepts: MapConcept[],
  collapsed: string[],
  collapsedGroups: string[]
) {
  const positions: MapPosition[] = []
  const edges: { from: string; to: string; colorIndex: number }[] = []
  const split = Math.ceil(branches.length / 2)
  const sides = [branches.slice(0, split), branches.slice(split)]
  const root = { x: -90, y: -36, width: 180, height: 72 }
  let maxExtent = 300
  sides.forEach((side, sideIndex) => {
    const right = sideIndex === 1
    const measured = side.map((branch) => {
      const leaves = concepts.filter((c) => c.branch === branch.id)
      const groups = [...new Set(leaves.map((c) => c.group ?? '核心概念'))].map((label) => {
        const id = groupKey(branch.id, label)
        const children = leaves.filter((c) => (c.group ?? '核心概念') === label)
        return {
          id,
          label,
          children,
          height: collapsedGroups.includes(id) ? 66 : Math.max(66, children.length * 58),
        }
      })
      return {
        branch,
        groups,
        count: leaves.length,
        height: collapsed.includes(branch.id)
          ? 84
          : Math.max(
              104,
              groups.reduce((h, g) => h + g.height + 18, 0)
            ),
      }
    })
    const height = measured.reduce((sum, b) => sum + b.height + 16, 0)
    maxExtent = Math.max(maxExtent, height / 2)
    let cursor = -height / 2
    for (const { branch, groups, count, height: branchHeight } of measured) {
      const colorIndex = branches.findIndex((b) => b.id === branch.id)
      const y = cursor + branchHeight / 2
      positions.push({
        id: `branch:${branch.id}`,
        kind: 'branch',
        label: branch.title,
        x: right ? 310 : -490,
        y: y - 35,
        width: 180,
        height: 70,
        branch: branch.id,
        colorIndex,
        right,
        count,
      })
      edges.push({ from: 'root', to: `branch:${branch.id}`, colorIndex })
      if (!collapsed.includes(branch.id)) {
        let groupCursor = cursor
        for (const group of groups) {
          const gy = groupCursor + group.height / 2
          positions.push({
            id: group.id,
            kind: 'group',
            label: group.label,
            x: right ? 570 : -770,
            y: gy - 25,
            width: 200,
            height: 50,
            branch: branch.id,
            colorIndex,
            right,
            count: group.children.length,
          })
          edges.push({ from: `branch:${branch.id}`, to: group.id, colorIndex })
          if (!collapsedGroups.includes(group.id))
            group.children.forEach((leaf, index) => {
              positions.push({
                id: leaf.id,
                kind: 'concept',
                label: leaf.name,
                x: right ? 850 : -1090,
                y: groupCursor + index * 58 + 7,
                width: 240,
                height: 44,
                branch: branch.id,
                colorIndex,
                right,
              })
              edges.push({ from: group.id, to: leaf.id, colorIndex })
            })
          groupCursor += group.height + 18
        }
      }
      cursor += branchHeight + 16
    }
  })
  const extent =
    Math.max(640, ...positions.map((p) => Math.max(Math.abs(p.x), Math.abs(p.x + p.width)))) + 40
  const top = -maxExtent - 50
  return {
    root,
    positions,
    edges,
    bounds: { x: -extent, y: top, width: extent * 2, height: maxExtent * 2 + 100 },
  }
}
