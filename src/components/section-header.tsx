import type { ReactNode } from 'react'

export function SectionHeader({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-6 flex items-baseline justify-between border-b border-[var(--color-border)] pb-2">
      <h2 className="font-mono text-sm text-[var(--color-muted)]">
        {`// `}
        {children}
      </h2>
      {action && <div className="font-mono text-xs">{action}</div>}
    </div>
  )
}
