import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="space-y-4 py-24 text-center font-mono">
      <p className="text-sm text-[var(--color-muted)]">{`// 404`}</p>
      <h1 className="font-serif text-lg">页面不在这里</h1>
      <Link href="/" className="text-[var(--color-accent)]">
        返回首页
      </Link>
    </div>
  )
}
