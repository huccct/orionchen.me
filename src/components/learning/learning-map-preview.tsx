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
              d={`M ${left ? 152 : 288} ${center} C ${left ? 148 : 292} ${center}, ${left ? 158 : 282} ${y}, ${left ? 122 : 318} ${y}`}
            />
            <path d={`M ${left ? 122 : 318} ${y} H ${left ? 20 : 420}`} />
            <foreignObject x={left ? 8 : 300} y={y - 39} width="132" height="36">
              <div className="learning-map-label">{branch.title}</div>
            </foreignObject>
          </g>
        )
      })}
      <rect x="152" y={center - 36} width="136" height="72" rx="6" />
      <foreignObject x="160" y={center - 28} width="120" height="56">
        <div className="learning-map-root">{title}</div>
      </foreignObject>
    </svg>
  )
}
