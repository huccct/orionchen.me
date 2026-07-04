const styles = {
  code: 'border-border',
  documentary: 'border-accent text-accent',
  writing: 'border-border',
  wip: 'border-amber-500 text-amber-600 dark:text-amber-400',
  live: 'border-emerald-500 text-emerald-600 dark:text-emerald-400',
  archived: 'border-muted-foreground text-muted-foreground',
}

export type StatusPillKind = keyof typeof styles

export function StatusPill({ kind, label = kind }: { kind: StatusPillKind; label?: string }) {
  return (
    <span
      className={`inline-block rounded-sm border px-2 py-0.5 font-mono text-xs ${styles[kind]}`}
    >
      {label}
    </span>
  )
}
