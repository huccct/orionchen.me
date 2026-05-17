const styles = {
  code: 'border-[var(--color-border)]',
  film: 'border-[var(--color-accent)] text-[var(--color-accent)]',
  writing: 'border-[var(--color-border)]',
  wip: 'border-amber-500 text-amber-600 dark:text-amber-400',
  live: 'border-emerald-500 text-emerald-600 dark:text-emerald-400',
  archived: 'border-[var(--color-muted)] text-[var(--color-muted)]',
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
