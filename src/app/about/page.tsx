import { SectionHeader } from '@/components/section-header'
import { siteConfig } from '@/lib/site-config'

export const metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-12">
      <section>
        <SectionHeader>About</SectionHeader>
        <div className="space-y-5 text-base leading-relaxed">
          <p>
            我是 图南 (Orion Chen)。做内容的账号叫{' '}
            <a
              href={siteConfig.social.bilibili}
              className="text-accent font-serif italic"
              target="_blank"
              rel="noreferrer"
            >
              第三幕
            </a>
            。
          </p>
          <p>
            从高中做网页开始算,代码断断续续也写了有些年头了。一路从古法编程写到 AI agent 开发,工具换了三轮,活儿还是那个活儿 —— 把模糊的需求,做成能跑的东西。
          </p>
          <p>
            写字是顺手开始的。先写技术,写着写着写到了县城、亲情、买房、和那些「用不着 AI 的人」。写得越多越觉得,
            <strong>比技术更值得记下来的,是这个时代里普通人怎么活</strong>。
          </p>
          <p>
            最近开始拍人。戏剧有三幕 —— 铺垫、冲突、收场。AI 时代是人类故事的第三幕,我们这代人也正好走到自己的第三幕。我想拍这一幕里{' '}
            <strong>那些不在叙事中心、却把自己的一幕走完的人</strong>
            {' '}—— 麻将馆的阿姨、深夜写代码的同行、回不去也留不下的同学。第一支还在准备。
          </p>
        </div>
      </section>

      <section>
        <SectionHeader>Reading</SectionHeader>
        <ul className="space-y-2 text-sm">
          <li>
            <a
              href="https://book.douban.com/subject/26984629/"
              className="text-accent"
              target="_blank"
              rel="noreferrer"
            >
              这世界既残酷也温柔
            </a>{' '}
            <span className="text-muted-foreground">— 给自己留一点不被磨平的余地</span>
          </li>
          <li>
            <a
              href="https://www.amazon.com/%E5%B9%A3%E5%AE%89%E4%BA%BA%E7%94%9F-%E5%B9%B8%E9%81%8B%E3%80%81%E9%9F%8C%E6%80%A7%E8%88%87%E4%BF%9D%E8%AD%B7%E7%94%A8%E6%88%B6%E7%9A%84%E5%9B%9E%E6%86%B6%E9%8C%84-Traditional-Changpeng-Zhao-ebook/dp/B0GDG6D3WP"
              className="text-accent"
              target="_blank"
              rel="noreferrer"
            >
              币安人生
            </a>{' '}
            <span className="text-muted-foreground">— 看一个工程师怎么撞上时代第三幕</span>
          </li>
          <li>
            <a
              href="https://book.douban.com/subject/6021440/"
              className="text-accent"
              target="_blank"
              rel="noreferrer"
            >
              黑客与画家
            </a>{' '}
            <span className="text-muted-foreground">— 写代码的人为什么也该懂商业</span>
          </li>
          <li>
            <a
              href="https://book.douban.com/subject/6811366/"
              className="text-accent"
              target="_blank"
              rel="noreferrer"
            >
              禅与摩托车维修艺术
            </a>{' '}
            <span className="text-muted-foreground">— 关于「认真做一件事」最厚的一本书</span>
          </li>
          <li>
            <a
              href="https://book.douban.com/subject/25961458/"
              className="text-accent"
              target="_blank"
              rel="noreferrer"
            >
              大问题:简明哲学导论
            </a>{' '}
            <span className="text-muted-foreground">— 把那些不敢问的问题排成一张清单</span>
          </li>
          <li>
            <a
              href="https://book.douban.com/subject/1786387/"
              className="text-accent"
              target="_blank"
              rel="noreferrer"
            >
              影响力
            </a>{' '}
            <span className="text-muted-foreground">— 知道自己什么时候在被说服</span>
          </li>
          <li>
            <a
              href="https://book.douban.com/subject/26320572/"
              className="text-accent"
              target="_blank"
              rel="noreferrer"
            >
              The Mom Test
            </a>{' '}
            <span className="text-muted-foreground">— 怎么问问题才不会被自己骗</span>
          </li>
          <li>
            <a
              href="https://book.douban.com/subject/30316487/"
              className="text-accent"
              target="_blank"
              rel="noreferrer"
            >
              资本论
            </a>{' '}
            <span className="text-muted-foreground">— 看清自己卖的是什么</span>
          </li>
          <li>
            <a
              href="https://book.douban.com/subject/1139360/"
              className="text-accent"
              target="_blank"
              rel="noreferrer"
            >
              毛泽东选集
            </a>{' '}
            <span className="text-muted-foreground">— 中国式做事方法论的源代码</span>
          </li>
          <li>
            <a
              href="https://book.douban.com/subject/1261560/"
              className="text-accent"
              target="_blank"
              rel="noreferrer"
            >
              国富论
            </a>{' '}
            <span className="text-muted-foreground">— 看不见的手,两百年前就写好了</span>
          </li>
          <li>
            <a
              href="https://book.douban.com/subject/6798611/"
              className="text-accent"
              target="_blank"
              rel="noreferrer"
            >
              史蒂夫·乔布斯传
            </a>{' '}
            <span className="text-muted-foreground">— 把产品做到偏执,是什么代价</span>
          </li>
          <li>
            <a
              href="https://book.douban.com/subject/36518892/"
              className="text-accent"
              target="_blank"
              rel="noreferrer"
            >
              埃隆·马斯克传
            </a>{' '}
            <span className="text-muted-foreground">— 一个人怎么把不可能当成日程表</span>
          </li>
        </ul>
      </section>

      <section>
        <SectionHeader>Contact</SectionHeader>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li>
            Email —{' '}
            <a href={`mailto:${siteConfig.email}`} className="text-accent">
              {siteConfig.email}
            </a>
          </li>
          <li>
            GitHub —{' '}
            <a
              href={siteConfig.social.github}
              className="text-accent"
              target="_blank"
              rel="noreferrer"
            >
              {siteConfig.social.github.replace('https://', '')}
            </a>
          </li>
          <li>
            X —{' '}
            <a href={siteConfig.social.x} className="text-accent" target="_blank" rel="noreferrer">
              {siteConfig.social.x.replace('https://', '')}
            </a>
          </li>
        </ul>
      </section>
    </div>
  )
}
