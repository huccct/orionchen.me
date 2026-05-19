import type { ReactNode } from 'react'

export function SectionHeader({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="border-border mb-6 flex items-baseline justify-between border-b pb-2">
      <h2 className="text-muted-foreground font-mono text-sm">
        {`// `}
        {children}
      </h2>
      {action && <div className="font-mono text-xs">{action}</div>}
    </div>
  )
}
