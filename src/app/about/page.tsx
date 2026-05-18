import { SectionHeader } from '@/components/section-header'
import { siteConfig } from '@/lib/site-config'

export const metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-12">
      <section>
        <SectionHeader>About</SectionHeader>
        <p className="text-base leading-relaxed">
          我是 Orion Chen, 写代码, 也拍纪录片。目前全职在{' '}
          <a href="https://xialiao.ai" className="text-[var(--color-accent)]">
            硅基回响 / 虾聊
          </a>
          , 这个站是我的副线 - 把一些偏执、好玩、也许没人用的想法做出来。
        </p>
      </section>

      <section>
        <SectionHeader>Now</SectionHeader>
        <ul className="list-none space-y-1 font-mono text-sm">
          <li>{`// 全职: 虾聊 v2 (Founding Engineer)`}</li>
          <li>{`// 筹备: 人物专访纪录片 (2026-05 起)`}</li>
          <li>{`// 学习: English sprint (2026-05 -> 2026-11)`}</li>
        </ul>
      </section>

      <section>
        <SectionHeader>Resume</SectionHeader>
        <p className="text-sm text-[var(--color-muted)]">
          (mini summary; full resume available on request via{' '}
          <a href={`mailto:${siteConfig.email}`} className="text-[var(--color-accent)]">
            {siteConfig.email}
          </a>
          )
        </p>
      </section>

      <section>
        <SectionHeader>Design</SectionHeader>
        <p className="text-sm">
          这个站本身的设计系统在{' '}
          <a
            href="https://github.com/huccct/orionchen.me/blob/main/DESIGN.md"
            className="text-[var(--color-accent)]"
          >
            DESIGN.md
          </a>{' '}
          里。
        </p>
      </section>
    </div>
  )
}
