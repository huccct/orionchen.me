import type { MapBranch } from './map-types'
export function LearningMapPreview({ title, branches }: { title: string; branches: MapBranch[] }) {
  const split = Math.ceil(branches.length / 2)
  const height = Math.max(260, split * 44 + 32)
  const center = height / 2
  return (
    <svg className="learning-map-preview" viewBox={`0 0 440 ${height}`} aria-hidden="true">
      {branches.map((branch, index) => {
        const left = index < split
        const sideCount = left ? split : branches.length - split
        const y = center + ((index % split) - (sideCount - 1) / 2) * 44
        return (
          <g key={branch.id}>
            <path
              d={`M ${left ? 177 : 263} ${center} C ${left ? 148 : 292} ${center}, ${left ? 158 : 282} ${y}, ${left ? 122 : 318} ${y}`}
            />
            <path d={`M ${left ? 122 : 318} ${y} H ${left ? 20 : 420}`} />
            <text x={left ? 72 : 368} y={y - 7} textAnchor="middle" style={{ fontSize: 12 }}>
              {branch.title}
            </text>
          </g>
        )
      })}
      <rect x="177" y={center - 20} width="86" height="40" rx="6" />
      <text className="learning-map-root" x="220" y={center + 5} textAnchor="middle">
        {title}
      </text>
    </svg>
  )
}
