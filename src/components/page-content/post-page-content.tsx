import { MDXContent } from '@content-collections/mdx/react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EarlyContentBanner } from '@/components/early-content-banner'
import { JsonLd } from '@/components/json-ld'
import { mdxComponents } from '@/components/mdx/mdx-components'
import type { Locale } from '@/i18n/config'
import { localePathPrefix } from '@/i18n/config'
import { type Dictionary, getDictionary } from '@/i18n/get-dictionary'
import type { TableOfContentsItem } from '@/lib/post-metadata'
import {
  getPostWithNeighbors,
  type PublishedPost,
} from '@/lib/posts'
import {
  createBlogPostingJsonLd,
  createBreadcrumbJsonLd,
} from '@/lib/seo'

export function PostPageContent({ locale, slug }: { locale: Locale; slug: string }) {
  const dict = getDictionary(locale)
  const prefix = localePathPrefix[locale]
  const { post, newerPost, olderPost } = getPostWithNeighbors(slug)

  if (!post) notFound()

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[minmax(0,42rem)_14rem] lg:items-start lg:justify-center">
      <JsonLd
        data={[
          createBlogPostingJsonLd(post),
          createBreadcrumbJsonLd([
            { name: dict.breadcrumb.home, path: prefix === '' ? '/' : prefix },
            { name: dict.breadcrumb.writing, path: `${prefix}/blog` },
            { name: post.title, path: `${prefix}/blog/${post.slug}` },
          ]),
        ]}
      />
      <article className="mx-auto w-full max-w-2xl min-w-0 lg:mx-0">
        <header className="mb-8 space-y-3">
          <h1 className="font-serif text-3xl leading-tight text-balance break-words sm:text-4xl">
            {post.title}
          </h1>
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs">
            <time dateTime={post.date}>{post.date}</time>
            <span aria-hidden="true">/</span>
            <span>{post.readingTime.text}</span>
          </div>
        </header>
        {post.earlyContent && <EarlyContentBanner message={dict.blog.earlyContent} />}
        <div className="prose min-w-0">
          <MDXContent code={post.body} components={mdxComponents} />
        </div>
        <PostNavigation
          dict={dict}
          newerPost={newerPost}
          olderPost={olderPost}
          pathPrefix={prefix}
        />
      </article>
      <PostTableOfContents dict={dict} items={post.tableOfContents} />
    </div>
  )
}

function PostTableOfContents({
  dict,
  items,
}: {
  dict: Dictionary
  items: TableOfContentsItem[]
}) {
  if (items.length === 0) return null

  return (
    <aside className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto lg:block">
      <nav aria-label={dict.blog.tocAria} className="border-border/80 border-l py-1 pl-4">
        <div className="text-muted-foreground mb-3 font-mono text-xs tracking-normal">
          {dict.blog.tableOfContents}
        </div>
        <ol className="space-y-2">
          {items.map((item) => (
            <li key={`${item.id}-${item.title}`}>
              <a
                href={`#${item.id}`}
                className={`text-muted-foreground hover:text-accent block text-sm leading-snug transition-colors ${
                  item.level === 3 ? 'pl-3 text-xs' : ''
                }`}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  )
}

function PostNavigation({
  dict,
  newerPost,
  olderPost,
  pathPrefix,
}: {
  dict: Dictionary
  newerPost: PublishedPost | null
  olderPost: PublishedPost | null
  pathPrefix: string
}) {
  if (!newerPost && !olderPost) return null

  return (
    <nav className="border-border mt-12 grid gap-3 border-t pt-6 md:grid-cols-2">
      {newerPost ? (
        <PostNavigationLink
          label={dict.blog.previousPost}
          pathPrefix={pathPrefix}
          post={newerPost}
        />
      ) : (
        <div className="hidden md:block" />
      )}
      {olderPost ? (
        <PostNavigationLink
          align="end"
          label={dict.blog.nextPost}
          pathPrefix={pathPrefix}
          post={olderPost}
        />
      ) : (
        <div className="hidden md:block" />
      )}
    </nav>
  )
}

function PostNavigationLink({
  align = 'start',
  label,
  pathPrefix,
  post,
}: {
  align?: 'start' | 'end'
  label: string
  pathPrefix: string
  post: PublishedPost
}) {
  return (
    <Link
      href={`${pathPrefix}/blog/${post.slug}`}
      className={`border-border hover:border-accent block rounded-md border p-4 transition-colors ${
        align === 'end' ? 'md:text-right' : ''
      }`}
    >
      <div className="text-muted-foreground font-mono text-xs">{label}</div>
      <div className="mt-2 font-serif text-base break-words">{post.title}</div>
      <time dateTime={post.date} className="text-muted-foreground mt-1 block font-mono text-xs">
        {post.date}
      </time>
    </Link>
  )
}
