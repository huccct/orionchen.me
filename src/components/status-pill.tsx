const styles = {
  code: 'border-border',
  documentary: 'border-accent text-accent',
  writing: 'border-border',
  wip: 'border-amber-500 text-amber-600 dark:text-amber-400',
  live: 'border-emerald-500 text-emerald-600 dark:text-emerald-400',
  archived: 'border-muted-foreground text-muted-foreground',
}

export function StatusPill({ kind }: { kind: keyof typeof styles }) {
  return (
    <span
      className={`inline-block rounded-sm border px-2 py-0.5 font-mono text-xs ${styles[kind]}`}
    >
      {kind}
    </span>
  )
}
