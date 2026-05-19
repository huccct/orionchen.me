'use client'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="space-y-4 py-24 text-center">
      <p className="text-muted-foreground font-mono text-sm">{`// 500`}</p>
      <button onClick={reset} className="text-accent">
        重试
      </button>
    </div>
  )
}
