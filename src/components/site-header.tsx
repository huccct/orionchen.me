import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'

const NAV = [
  {
    href: '/works',
    label: 'Works',
  },
  {
    href: '/blog',
    label: 'Writing',
  },
  {
    href: '/guestbook',
    label: 'Guestbook',
  },
  {
    href: '/about',
    label: 'About',
  },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link
          href="/"
          className="shrink-0 font-mono text-sm hover:text-[var(--color-accent)]"
        >
          orionchen.me
        </Link>
        <nav className="flex items-center gap-3 text-sm md:gap-6">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[var(--color-accent)]">
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
