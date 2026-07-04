'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MenuIcon } from 'lucide-react'
import { Drawer } from '@base-ui/react/drawer'

type NavItem = { href: string; label: string }

export function SiteHeaderMobileNav({ nav, openLabel }: { nav: NavItem[]; openLabel: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger
        className="hover:bg-muted hover:text-foreground inline-flex size-8 items-center justify-center rounded-md transition-colors"
        aria-label={openLabel}
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
                {nav.map((item) => (
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
