'use client'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="space-y-4 py-24 text-center">
      <p className="font-mono text-sm text-[var(--color-muted)]">{`// 500`}</p>
      <button onClick={reset} className="text-[var(--color-accent)]">
        重试
      </button>
    </div>
  )
}
