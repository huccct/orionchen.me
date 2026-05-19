import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="space-y-4 py-24 text-center font-mono">
      <p className="text-muted-foreground text-sm">{`// 404`}</p>
      <h1 className="font-serif text-3xl">页面不在这里</h1>
      <Link href="/" className="text-accent">
        返回首页
      </Link>
    </div>
  )
}
