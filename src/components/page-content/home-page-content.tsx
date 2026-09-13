import { JsonLd } from '@/components/json-ld'
import { Neighborhood } from '@/components/neighborhood'
import { createNeighborhoodStops } from '@/lib/neighborhood'
import type { Locale } from '@/i18n/config'
import { localePathPrefix } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import { getPublishedPosts } from '@/lib/posts'
import { createBreadcrumbJsonLd, createCollectionPageJsonLd } from '@/lib/seo'
import { getVisibleWorks } from '@/lib/works'

/**
 * Home page body. Used by both `/` (zh) and `/en` route shells. Filters
 * posts and works by locale once it's wired through the schema.
 */
export function HomePageContent({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale)
  const prefix = localePathPrefix[locale]
  const posts = getPublishedPosts(locale)
  const stops = createNeighborhoodStops(
    locale,
    posts,
    getVisibleWorks(locale),
    dict.about.readingItems
  )

  return (
    <div className="town-home">
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
      <Neighborhood
        locale={locale}
        stops={stops}
        books={dict.about.readingItems}
        posts={posts.map((post) => ({
          title: post.title,
          href: `${prefix}/blog/${post.slug}`,
          summary: post.summary ?? '',
        }))}
      />
    </div>
  )
}
