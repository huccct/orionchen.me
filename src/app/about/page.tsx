import type { Metadata } from 'next'
import { SectionHeader } from '@/components/section-header'
import { getDictionary } from '@/i18n/get-dictionary'
import { siteConfig } from '@/lib/site-config'
import { createMetadata } from '@/lib/seo'

const dict = getDictionary('zh')

const lenses = [
  {
    label: 'Code',
    title: '做能运行的东西',
    body: '把模糊的问题拆开，压进系统里，让判断可以被反复使用。',
  },
  {
    label: 'Writing',
    title: '写技术解释不了的人',
    body: 'AI、工作、家庭、时代变化，最后都会落到具体的人身上。',
  },
  {
    label: 'Film',
    title: '把问题放回现场',
    body: '纪录片还在起步。想拍那些不在叙事中心、但仍然认真活着的人。',
  },
]

const readingItems = [
  ['这世界既残酷也温柔', 'https://book.douban.com/subject/26984629/', '给自己留一点不被磨平的余地'],
  [
    '币安人生',
    'https://www.amazon.com/%E5%B9%A3%E5%AE%89%E4%BA%BA%E7%94%9F-%E5%B9%B8%E9%81%8B%E3%80%81%E9%9F%8C%E6%80%A7%E8%88%87%E4%BF%9D%E8%AD%B7%E7%94%A8%E6%88%B6%E7%9A%84%E5%9B%9E%E6%86%B6%E9%8C%84-Traditional-Changpeng-Zhao-ebook/dp/B0GDG6D3WP',
    '看一个工程师怎么撞上时代第三幕',
  ],
  ['黑客与画家', 'https://book.douban.com/subject/6021440/', '写代码的人为什么也该懂商业'],
  ['禅与摩托车维修艺术', 'https://book.douban.com/subject/6811366/', '关于认真做一件事'],
  ['The Mom Test', 'https://book.douban.com/subject/26320572/', '怎么问问题才不会被自己骗'],
  ['资本论', 'https://book.douban.com/subject/30316487/', '看清自己卖的是什么'],
] as const

export const metadata: Metadata = createMetadata({
  title: dict.about.title,
  description: 'Orion Chen，一个不只关心技术的工程师。',
  path: '/about',
})

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-14">
      <section>
        <SectionHeader>About</SectionHeader>
        <div className="grid gap-8 md:grid-cols-[1fr_13rem] md:items-end">
          <div className="space-y-6">
            <p className="text-muted-foreground font-mono text-xs tracking-[0.24em] uppercase">
              Engineer / Writer / Not Act V
            </p>
            <h1 className="font-serif text-4xl leading-[1.08] text-balance sm:text-5xl md:text-6xl">
              一个不只关心技术的工程师。
            </h1>
            <div className="max-w-2xl space-y-4 text-base leading-relaxed">
              <p>我是 Orion Chen。写代码让我学会拆解问题，写作和影像让我重新看见问题里的人。</p>
              <p className="text-muted-foreground">
                内容账号叫{' '}
                <a
                  href={siteConfig.social.bilibili}
                  className="text-accent font-serif italic"
                  target="_blank"
                  rel="noreferrer"
                >
                  还没到第五幕
                </a>
                ：故事还没到终场，人还在场上。
              </p>
            </div>
          </div>

          <aside className="border-border text-muted-foreground border-t pt-4 font-mono text-xs leading-relaxed md:border-t-0 md:border-l md:pt-0 md:pl-5">
            <p className="text-foreground mb-2 text-sm">Orion Chen</p>
            <p>Software Engineer</p>
            <p>Hangzhou / Web / AI</p>
            <p className="mt-4">
              <a
                href={siteConfig.social.bilibili}
                className="text-accent"
                target="_blank"
                rel="noreferrer"
              >
                还没到第五幕
              </a>
            </p>
          </aside>
        </div>
      </section>

      <section>
        <SectionHeader>Coordinates</SectionHeader>
        <div className="grid gap-5 md:grid-cols-3">
          {lenses.map((item) => (
            <div key={item.label} className="border-border border-t pt-4">
              <p className="text-muted-foreground mb-4 font-mono text-xs">{item.label}</p>
              <h2 className="font-serif text-xl leading-snug">{item.title}</h2>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>Reading</SectionHeader>
        <ul className="grid gap-x-8 gap-y-3 text-sm md:grid-cols-2">
          {readingItems.map(([title, href, note]) => (
            <li key={title} className="border-border border-t pt-3">
              <a href={href} className="text-accent" target="_blank" rel="noreferrer">
                {title}
              </a>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionHeader>Contact</SectionHeader>
        <div className="text-muted-foreground flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
          <a href={`mailto:${siteConfig.email}`} className="text-accent">
            Email
            <span className="text-muted-foreground ml-2 font-sans">{siteConfig.email}</span>
          </a>
          <a
            href={siteConfig.social.github}
            className="text-accent"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
            <span className="text-muted-foreground ml-2 font-sans">
              {siteConfig.social.github.replace('https://', '')}
            </span>
          </a>
          <a href={siteConfig.social.x} className="text-accent" target="_blank" rel="noreferrer">
            X
            <span className="text-muted-foreground ml-2 font-sans">
              {siteConfig.social.x.replace('https://', '')}
            </span>
          </a>
        </div>
      </section>
    </div>
  )
}
