import { JsonLd } from '@/components/json-ld'
import { BlogFilter } from '@/components/blog-filter'
import type { Locale } from '@/i18n/config'
import { localePathPrefix } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import { getBlogPageCount, getBlogPagePosts, getPublishedPosts } from '@/lib/posts'
import { createBreadcrumbJsonLd, createCollectionPageJsonLd } from '@/lib/seo'

/**
 * Blog list page body. `page` is 1-based; the route shell is responsible
 * for parsing it from the URL and 404'ing on bad values.
 */
export function BlogListPageContent({ locale, page = 1 }: { locale: Locale; page?: number }) {
  const dict = getDictionary(locale)
  const prefix = localePathPrefix[locale]
  const allPosts = getPublishedPosts()
  const pageCount = getBlogPageCount(allPosts)
  const pagedPosts = getBlogPagePosts(page, allPosts)

  return (
    <>
      <JsonLd
        data={[
          createCollectionPageJsonLd({
            name: dict.blog.title,
            description: dict.site.writingDescription,
            path: `${prefix}/blog`,
          }),
          createBreadcrumbJsonLd([
            { name: dict.breadcrumb.home, path: prefix === '' ? '/' : prefix },
            { name: dict.breadcrumb.writing, path: `${prefix}/blog` },
          ]),
        ]}
      />
      <BlogFilter
        allPosts={allPosts}
        dict={dict}
        page={page}
        pageCount={pageCount}
        pagedPosts={pagedPosts}
        pathPrefix={prefix}
      />
    </>
  )
}
