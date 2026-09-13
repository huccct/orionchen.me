import { expect, it } from 'vitest'
import { createNeighborhoodStops, neighborhoodWalk } from '@/lib/neighborhood'

it('links real content in its locale and handles empty archives and works without detail pages', () => {
  const stops = createNeighborhoodStops(
    'en',
    [{ title: 'A post', slug: 'a-post' }],
    [{ title: 'Upcoming film', summary: 'In progress' }],
    [{ title: 'A book', note: 'Worth keeping' }]
  )
  expect(stops.map((stop) => stop.href)).toEqual(['/en/blog', '/en/works', '/en/reading'])
  expect(stops[1].summary).toBe('In progress')
  expect(stops[2].title).toBe('A book')
  expect(createNeighborhoodStops('zh', [], [], []).map((stop) => stop.href)).toEqual([
    '/blog',
    '/works',
    '/reading',
  ])
})

it('residents pause at both ends and retrace their footpath without jumping', () => {
  expect(neighborhoodWalk(0, 10)).toEqual({ returning: false, moving: true, u: 0 })
  expect(neighborhoodWalk(11, 10)).toEqual({ returning: false, moving: false, u: 1 })
  expect(neighborhoodWalk(18, 10)).toEqual({ returning: true, moving: true, u: 0.5 })
  expect(neighborhoodWalk(25, 10)).toEqual({ returning: true, moving: false, u: 0 })
  expect(neighborhoodWalk(26, 10)).toEqual(neighborhoodWalk(0, 10))
})
