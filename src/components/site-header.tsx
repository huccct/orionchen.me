'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MenuIcon } from 'lucide-react'
import { Drawer } from '@base-ui/react/drawer'
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
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 md:px-8 md:py-4">
        <Link href="/" className="hover:text-accent shrink-0 font-mono text-sm">
          orionchen.me
        </Link>
        <div className="flex items-center gap-1 sm:gap-3">
          <div className="sm:hidden">
            <MobileNav />
          </div>
          <nav className="hidden items-center gap-3 text-sm sm:flex md:gap-6">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-accent">
                {item.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger
        className="hover:bg-muted hover:text-foreground inline-flex size-8 items-center justify-center rounded-md transition-colors"
        aria-label="Open navigation"
      >
        <MenuIcon className="size-4" />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px]" />
        <Drawer.Viewport className="fixed inset-x-0 bottom-0 z-50 outline-none">
          <Drawer.Popup className="translate-y-0 outline-none">
            <Drawer.Content className="border-border bg-popover rounded-t-2xl border-t shadow-2xl">
              <div className="flex justify-center py-3">
                <span className="bg-muted-foreground/30 block h-1 w-10 rounded-full" />
              </div>
              <nav className="flex flex-col px-2 pb-3 text-sm">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="hover:bg-muted hover:text-foreground rounded-lg px-4 py-3"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
