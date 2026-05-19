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
    <header className="border-border bg-background/85 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-3 sm:flex-nowrap sm:px-6 md:px-8 md:py-4">
        <Link href="/" className="hover:text-accent shrink-0 font-mono text-sm">
          orionchen.me
        </Link>
        <nav className="-mx-1 flex max-w-full min-w-0 flex-1 items-center justify-end gap-1 overflow-x-auto px-1 text-sm sm:mx-0 sm:flex-none sm:gap-3 sm:overflow-visible sm:px-0 md:gap-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-accent shrink-0 rounded-sm px-1.5 py-1 sm:px-0"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
