import { siteConfig } from '@/lib/site-config'

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--color-border)]">
      <div className="mx-auto flex max-w-5xl flex-col justify-between gap-4 px-4 py-8 font-mono text-xs text-[var(--color-muted)] md:flex-row md:px-8">
        <span>{`// ${new Date().getFullYear()} · ${siteConfig.name}`}</span>
        <span className="flex gap-4">
          <a href={siteConfig.social.github}>GitHub</a>
          <a href={siteConfig.social.x}>X</a>
          <a href={`mailto:${siteConfig.email}`}>Email</a>
        </span>
      </div>
    </footer>
  )
}
