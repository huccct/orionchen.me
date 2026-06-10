import type { Metadata } from 'next'
import { HtmlLangSync } from '@/components/html-lang-sync'
import { JsonLd } from '@/components/json-ld'
import { Plausible } from '@/components/plausible'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { ThemeProvider } from '@/components/theme-provider'
import { geistMono, geistSans, newsreader, notoSerifSC } from '@/lib/fonts'
import { createMetadata, createPersonJsonLd, createWebSiteJsonLd } from '@/lib/seo'
import './globals.css'

const baseMetadata = createMetadata()

export const metadata: Metadata = {
  ...baseMetadata,
  title: {
    default: 'Orion Chen',
    template: `%s — Orion Chen`,
  },
  applicationName: 'Orion Chen',
  alternates: {
    ...baseMetadata.alternates,
    canonical: '/',
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} ${notoSerifSC.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <HtmlLangSync />
        <JsonLd data={[createPersonJsonLd(), createWebSiteJsonLd('zh')]} />
        <ThemeProvider>
          <SiteHeader />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 md:px-8 md:py-8">
            {children}
          </main>
          <SiteFooter />
          <Plausible />
        </ThemeProvider>
      </body>
    </html>
  )
}
