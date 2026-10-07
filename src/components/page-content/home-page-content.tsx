import { ExperimentPreview } from '@/components/experiment-preview'
import { JsonLd } from '@/components/json-ld'
import Link from 'next/link'
import { ArrowUpRight, Code2, Rss, Mail } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import type { Locale } from '@/i18n/config'
import { localePathPrefix } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import { getPublishedPosts } from '@/lib/posts'
import { createBreadcrumbJsonLd, createCollectionPageJsonLd } from '@/lib/seo'

/**
 * Home page body. Used by both `/` (zh) and `/en` route shells. Filters
 * posts and works by locale once it's wired through the schema.
 */
export function HomePageContent({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale)
  const prefix = localePathPrefix[locale]
  const posts = getPublishedPosts(locale).slice(0, 3)
  const en = locale === 'en'

  return (
    <>
      <JsonLd
        data={[
          createCollectionPageJsonLd({
            name: 'Orion Chen',
            description: dict.site.homeCollectionDescription,
            path: prefix === '' ? '/' : prefix,
            locale,
          }),
          createBreadcrumbJsonLd([
            { name: dict.breadcrumb.home, path: prefix === '' ? '/' : prefix },
          ]),
        ]}
      />
      <div className="personal-home">
        <h1>
          Orion Chen<span className="home-period">.</span>
        </h1>
        <div className="personal-intro">
          <p>
            {en ? (
              <>Hi, I’m Orion. A software engineer who cares about more than technology.</>
            ) : (
              <>嗨，我是 Orion，一个不只关心技术的工程师。</>
            )}
          </p>
          <p>
            {en ? (
              <>
                Code helps me take problems apart. <Link href={`${prefix}/blog`}>Writing</Link> and
                film help me see the people inside them.
              </>
            ) : (
              <>
                写代码让我学会拆解问题，<Link href="/blog">写作</Link>和影像让我重新看见问题里的人。
              </>
            )}
          </p>
          <p>
            {en ? (
              <>
                I make small interactive experiments, collected in{' '}
                <a href="https://huccct.github.io/vibe/">
                  Vibe <ArrowUpRight size={13} />
                </a>
                . Two experiments to discover each visit. Open one and try it.
              </>
            ) : (
              <>
                喜欢把想法做成能运行的东西。最近做的一些互动小实验，放在{' '}
                <a href="https://huccct.github.io/vibe/">
                  Vibe 大合集 <ArrowUpRight size={13} />
                </a>
                里。每次来，遇见两件不同的小作品，欢迎打开玩玩。
              </>
            )}
          </p>
          <ExperimentPreview locale={locale} />
          <p>
            {en ? (
              <>
                Beyond code, I’m starting to explore documentary filmmaking. My video account is{' '}
                <a href={siteConfig.social.bilibili}>
                  阿南走街串巷 <ArrowUpRight size={13} />
                </a>
                . I want to tell stories about people outside the spotlight, still living with care.
              </>
            ) : (
              <>
                代码之外，也在慢慢开始拍纪录片。内容账号叫{' '}
                <a href={siteConfig.social.bilibili}>
                  阿南走街串巷 <ArrowUpRight size={13} />
                </a>
                ，想记录那些不在叙事中心、但仍然认真活着的人。
              </>
            )}
          </p>
          <p>
            {en ? (
              <>
                I keep a small <Link href={`${prefix}/reading`}>reading list</Link> here, alongside
                notes on technology, AI, and everyday life. You can explore my{' '}
                <Link href={`${prefix}/works`}>work</Link>, or{' '}
                <Link href={`${prefix}/guestbook`}>leave me a note</Link>.
              </>
            ) : (
              <>
                这里还放着一些读过后会想起的<Link href="/reading">书</Link>，以及关于技术、AI
                和日常生活的文字。你可以看看我的<Link href="/works">作品</Link>，或者
                <Link href="/guestbook">留句话</Link>。
              </>
            )}
          </p>
        </div>
        <div
          className="personal-social"
          aria-label={en ? 'Find me elsewhere' : '也可以在这里找到我'}
        >
          <a href={siteConfig.social.github}>
            <Code2 size={16} />
            GitHub
          </a>
          <a href="/rss.xml">
            <Rss size={15} />
            RSS
          </a>
          <a href={`mailto:${siteConfig.email}`}>
            <Mail size={16} />
            Email
          </a>
        </div>
        <section className="home-recent" aria-labelledby="recent-title">
          <div className="home-recent-heading">
            <h2 id="recent-title">{en ? 'Recently written' : '最近写下'}</h2>
            <Link href={`${prefix}/blog`}>
              {en ? 'All writing' : '全部文章'}
              <ArrowUpRight size={13} />
            </Link>
          </div>
          {posts.map((post) => (
            <Link className="home-recent-link" href={`${prefix}/blog/${post.slug}`} key={post.slug}>
              <span>{post.title}</span>
              <time dateTime={post.date}>{post.date.slice(5, 10).replace('-', '.')}</time>
            </Link>
          ))}
        </section>
      </div>
    </>
  )
}
