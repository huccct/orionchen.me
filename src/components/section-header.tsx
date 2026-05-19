import type { ReactNode } from 'react'

export function SectionHeader({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="border-border mb-6 flex min-w-0 items-baseline justify-between gap-4 border-b pb-2">
      <h2 className="text-muted-foreground min-w-0 font-mono text-sm break-words">
        {`// `}
        {children}
      </h2>
      {action && <div className="shrink-0 font-mono text-xs">{action}</div>}
    </div>
  )
}
